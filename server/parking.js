/* global process */
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

export function parseDate(value) {
  if (!value) return null;
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native;
  const m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{2})/);
  if (m) return new Date(Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]));
  const l = String(value).match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})[,\s]+(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (l && MONTHS[l[2].toLowerCase()] !== undefined) {
    let hour = Number(l[4]);
    if (l[6]?.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (l[6]?.toLowerCase() === 'am' && hour === 12) hour = 0;
    return new Date(Number(l[3]), MONTHS[l[2].toLowerCase()], Number(l[1]), hour, Number(l[5]));
  }
  return null;
}

export function calculateAmount(entry, exit, storedAmount, rateAtEntry = 20) {
  if (storedAmount !== undefined && storedAmount !== null && Number.isFinite(Number(storedAmount))) return Math.max(0, Number(storedAmount));
  const start = parseDate(entry); const end = parseDate(exit);
  if (!start || !end || end < start) return 0;
  const minutes = Math.floor((end - start) / 60000);
  return minutes <= 30 ? 0 : Math.ceil((minutes - 30) / 60) * Number(rateAtEntry || 20);
}

export function findLegacySession(data, requested) {
  const scans = Object.entries(data || {})
    .map(([key, record]) => ({ key, record, date: parseDate(record.date_time || record.inTime || record.timestamp) }))
    .filter((x) => x.date && String(x.record.number_plate || x.record.plate || '').toUpperCase() === requested.plate)
    .sort((a, b) => a.date - b.date);
  for (let i = scans.length - 1; i > 0; i -= 2) {
    const entry = scans[i - 1]; const exit = scans[i];
    const entryValue = entry.record.date_time || entry.record.inTime;
    const exitValue = exit.record.date_time || exit.record.inTime;
    const id = `legacy_\${entry.key}_\${exit.key}`;
    if (requested.sessionId === id || requested.entry === entryValue) {
      return { sessionId: id, source: 'numberplate', plate: requested.plate, entry: entryValue, exit: exitValue, amount: calculateAmount(entryValue, exitValue), duration: null };
    }
  }
  return null;
}

export async function findParkingSession(db, requested) {
  const plate = String(requested?.plate || '').trim().toUpperCase();
  if (!plate || !requested?.entry) throw new Error('A parking session is required');
  const logs = (await db.ref('parkingLogs').once('value')).val() || {};
  if (requested.sessionId && logs[requested.sessionId]) {
    const r = logs[requested.sessionId];
    if (String(r.plate || '').toUpperCase() === plate && (r.inTime || r.timestamp) === requested.entry) {
      return { sessionId: requested.sessionId, source: 'parkingLogs', plate, entry: r.inTime || r.timestamp, exit: r.outTime || null, amount: calculateAmount(r.inTime || r.timestamp, r.outTime, r.amount, r.rateAtEntry), duration: r.duration, zone: r.zone || null };
    }
  }
  const matching = Object.entries(logs).find(([, r]) => String(r.plate || '').toUpperCase() === plate && (r.inTime || r.timestamp) === requested.entry);
  if (matching) {
    const [id, r] = matching;
    return { sessionId: id, source: 'parkingLogs', plate, entry: r.inTime || r.timestamp, exit: r.outTime || null, amount: calculateAmount(r.inTime || r.timestamp, r.outTime, r.amount, r.rateAtEntry), duration: r.duration, zone: r.zone || null };
  }
  const legacy = (await db.ref('numberplate').once('value')).val() || {};
  const session = findLegacySession(legacy, { ...requested, plate });
  if (session) return session;
  throw new Error('Parking session was not found');
}



