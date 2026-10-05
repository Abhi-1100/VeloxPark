import { onValue, off, push, ref } from 'firebase/database';
import { database } from '../config/firebase';
import { getRateForVehicleType } from './settingsService';
import { calculateAmount, calculateDuration, parseToDate } from '../utils/parkingUtils';
import { normalizeEntry } from '../utils/schemaUtils';
import { cleanPlate, validateLicensePlate } from '../utils/validation';

export const USER_STATES = ['idle', 'loading', 'notFound', 'error', 'offline', 'parked', 'exitedUnpaid', 'exitedFree', 'paid'];

const normalizeRaw = (key, raw, source) => {
  const entry = normalizeEntry(raw);
  if (!entry || !entry.plate || !entry.inTime) return null;
  const checked = validateLicensePlate(entry.plate);
  if (!checked.valid) return null;
  return { ...entry, id: key, sessionId: key, source, plate: checked.cleaned };
};

const sessionFromDirect = (entry) => {
  const duration = entry.outTime ? calculateDuration(entry.inTime, entry.outTime) : null;
  return { ...entry, entry: entry.inTime, exit: entry.outTime || null, status: entry.outTime || entry.status === 'exited' ? 'exited' : 'parked', duration };
};

export const pairLegacyScans = (entries = []) => {
  const grouped = {};
  entries.forEach((entry) => { (grouped[entry.plate] ||= []).push(entry); });
  return Object.values(grouped).flatMap((scans) => {
    scans.sort((a, b) => (parseToDate(a.inTime)?.getTime() || 0) - (parseToDate(b.inTime)?.getTime() || 0));
    const sessions = [];
    for (let i = 0; i < scans.length; i += 2) {
      const current = scans[i];
      const next = scans[i + 1];
      sessions.push({
        ...current,
        sessionId: `legacy_${current.id}`,
        entry: current.inTime,
        exit: next?.inTime || null,
        status: next ? 'exited' : 'parked',
        duration: next ? calculateDuration(current.inTime, next.inTime) : null,
      });
    }
    return sessions;
  });
};

const buildSessions = async (legacy, logs) => {
  const sessions = [...pairLegacyScans(legacy), ...logs.map(sessionFromDirect)];
  const rates = await Promise.all(sessions.map(async (session) => {
    const rate = Number(session.rateAtEntry);
    return Number.isFinite(rate) && rate >= 0 ? rate : getRateForVehicleType(session.vehicleType);
  }));
  return sessions.map((session, index) => {
    const rateAtEntry = rates[index];
    const duration = session.duration || (session.exit ? calculateDuration(session.entry, session.exit) : null);
    const amount = session.exit ? calculateAmount(duration, rateAtEntry) : null;
    return { ...session, rateAtEntry, duration, amount, paymentStatus: session.paymentStatus || (session.paidAt ? 'paid' : 'none') };
  }).sort((a, b) => (parseToDate(b.entry)?.getTime() || 0) - (parseToDate(a.entry)?.getTime() || 0));
};

export const selectPlateSessions = (sessions, plate) => {
  const matches = sessions.filter((item) => item.plate === plate);
  if (!matches.length) return { current: null, previous: [] };
  const current = matches[0];
  const state = current.status === 'parked' ? 'parked' : current.paymentStatus === 'paid' ? 'paid' : current.amount <= 0 ? 'exitedFree' : 'exitedUnpaid';
  return { current: { ...current, state }, previous: matches.slice(1, 6) };
};

export const subscribeToVehicle = (plateInput, onData, onError) => {
  const checked = validateLicensePlate(plateInput);
  if (!checked.valid) { onError(Object.assign(new Error(checked.message), { code: 'INVALID_PLATE' })); return () => {}; }
  if (!database) { onError(Object.assign(new Error('Database is unavailable'), { code: 'NETWORK_ERROR' })); return () => {}; }
  let legacy = null; let logs = null; let failed = false;
  const notify = async () => {
    if (legacy === null || logs === null) return;
    const sessions = await buildSessions(legacy, logs);
    onData(selectPlateSessions(sessions, checked.cleaned));
  };
  const handle = (source, value) => {
    const list = value ? Object.entries(value).map(([key, raw]) => normalizeRaw(key, raw, source)).filter(Boolean) : [];
    if (source === 'numberplate') legacy = list; else logs = list;
    failed = false; notify().catch(onError);
  };
  const handleError = (error) => { if (!failed) { failed = true; onError(error); } };
  const legacyRef = ref(database, 'numberplate'); const logsRef = ref(database, 'parkingLogs');
  onValue(legacyRef, (snap) => handle('numberplate', snap.val()), handleError);
  onValue(logsRef, (snap) => handle('parkingLogs', snap.val()), handleError);
  return () => { off(legacyRef); off(logsRef); };
};

export const loadLocalVehicle = async (plateInput) => {
  const checked = validateLicensePlate(plateInput);
  if (!checked.valid) throw Object.assign(new Error(checked.message), { code: 'INVALID_PLATE' });
  const read = async (path, source) => { const response = await fetch(path); if (!response.ok) throw new Error('fallback unavailable'); const value = await response.json(); return Object.entries(value || {}).map(([key, raw]) => normalizeRaw(key, raw, source)).filter(Boolean); };
  const [legacy, logs] = await Promise.all([read('/numberplate.json', 'numberplate'), read('/parkingLogs.json', 'parkingLogs')]);
  return selectPlateSessions(await buildSessions(legacy, logs), checked.cleaned);
};

export const submitPaymentReference = async ({ sessionId, plate, amount, paymentRef }) => {
  if (!database) throw new Error('Database is unavailable');
  const refKey = await push(ref(database, 'paymentSubmissions'), { sessionId, plate: cleanPlate(plate), amount: Number(amount), txnRef: paymentRef, submittedAt: new Date().toISOString(), status: 'pending_verification' });
  return refKey.key;
};

export const listenPaymentStatus = (sessionId, callback, onError) => {
  if (!database || !sessionId || sessionId.startsWith('legacy_')) return () => {};
  const sessionRef = ref(database, `parkingLogs/${sessionId}`);
  const handler = (snap) => callback(snap.exists() ? normalizeEntry(snap.val()) : null);
  onValue(sessionRef, handler, onError);
  return () => off(sessionRef, 'value', handler);
};

export const loadVehicleSession = (plate, sessionId, onUpdate, onError) => {
  let settled = false;
  const unsubscribe = subscribeToVehicle(plate, (data) => {
    const current = data?.current?.sessionId === sessionId ? data.current : data?.previous?.find((item) => item.sessionId === sessionId);
    if (current) { settled = true; onUpdate(current); }
  }, onError);
  return () => { if (!settled) unsubscribe(); else unsubscribe(); };
};

export const createPaymentOrder = async () => {
  // TODO: call a trusted Firebase Cloud Function that creates a Razorpay order.
  // The webhook must verify signature, amount, sessionId and set parkingLogs.paymentStatus.
  throw new Error('Razorpay payment mode is not configured');
};
