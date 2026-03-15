// Calculate duration between entry and exit
export const calculateDuration = (entry, exit) => {
  if (!exit) return null;

  // Use parseToDate to handle all formats (legacy "27/2/26 08:00", ISO, etc.)
  // new Date() alone cannot parse "DD/MM/YY HH:MM" and returns NaN.
  const entryTime = parseToDate(entry) || new Date(entry);
  const exitTime  = parseToDate(exit)  || new Date(exit);
  const diffMs = exitTime - entryTime;

  if (isNaN(diffMs) || diffMs < 0) return { hours: 0, minutes: 0, totalMinutes: 0 };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, totalMinutes: Math.floor(diffMs / (1000 * 60)) };
};

// Calculate parking amount
// Uses the rate that was active at entry time (rateAtEntry)
// If rateAtEntry is not provided, falls back to default ₹20
export const calculateAmount = (duration, rateAtEntry = 20) => {
  if (!duration) return 0;
  
  const totalMinutes = duration.totalMinutes;
  
  // First 30 minutes free
  if (totalMinutes <= 30) return 0;
  
  // Use rateAtEntry per hour after 30 minutes
  const chargeableMinutes = totalMinutes - 30;
  const hours = Math.ceil(chargeableMinutes / 60);
  
  return hours * rateAtEntry;
};

// Format duration for display
export const formatDuration = (duration) => {
  if (!duration) return '-';
  return `${duration.hours}h ${duration.minutes}m`;
};

// Format date time for display
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '-';
  const date = parseToDate(dateTime);
  if (!date) return '-';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Month name → zero-based index lookup (covers en-IN locale abbreviated names)
const MONTH_MAP = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// Robust parsing for every timestamp format used by hardware, manual entry,
// and the en-IN locale output (pushManualEntry previously used this).
export const parseToDate = (dateTimeStr) => {
  if (!dateTimeStr) return null;

  // ── 1. ISO / standard formats (most entries after the schema fix) ──────────
  const iso = new Date(dateTimeStr);
  if (!isNaN(iso)) return iso;

  // ── 2. "DD Mon YYYY HH:MM am/pm" — en-IN locale output ("03 Mar 2026 10:30 am") ──
  const localeM = String(dateTimeStr).match(
    /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i
  );
  if (localeM) {
    const monthIdx = MONTH_MAP[localeM[2].toLowerCase()];
    if (monthIdx !== undefined) {
      let hour = parseInt(localeM[4], 10);
      const minute = parseInt(localeM[5], 10);
      const sec    = localeM[6] ? parseInt(localeM[6], 10) : 0;
      const ampm   = (localeM[7] || '').toLowerCase();
      if (ampm === 'pm' && hour < 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      const dt = new Date(parseInt(localeM[3], 10), monthIdx, parseInt(localeM[1], 10), hour, minute, sec);
      if (!isNaN(dt)) return dt;
    }
  }

  // ── 3. "DD/MM/YY HH:MM" or "DD-MM-YYYY HH:MM" — hardware / local JSON ────
  const numM = String(dateTimeStr).match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/
  );
  if (numM) {
    let year = parseInt(numM[3], 10);
    if (year < 100) year += 2000;
    const hour   = numM[4] ? parseInt(numM[4], 10) : 0;
    const minute = numM[5] ? parseInt(numM[5], 10) : 0;
    const dt = new Date(year, parseInt(numM[2], 10) - 1, parseInt(numM[1], 10), hour, minute);
    if (!isNaN(dt)) return dt;
  }

  return null;
};

// Check if a datetime string falls on a given yyyy-mm-dd date string.
// Uses LOCAL date parts (not UTC) to avoid IST/UTC +5:30 day-shift bug.
export const isSameDate = (dateTimeStr, dateStr) => {
  if (!dateTimeStr || !dateStr) return false;
  const d = parseToDate(dateTimeStr);
  if (!d) return false;
  const y  = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${dd}` === dateStr;
};

// Get today's date in yyyy-mm-dd format
export const getTodayDateStr = () => {
  return new Date().toISOString().split('T')[0];
};

// ── processParkingData ────────────────────────────────────────────────────────
//
// Supports TWO schemas:
//
//  A) PRD schema (new — one record per session with outTime already set):
//     { plate, inTime, outTime, duration, amount, status, rateAtEntry, ... }
//     These records come from the `parkingLogs` Firebase node (manual entries).
//
//  B) Legacy schema (hardware — every scan is a separate record, paired by order):
//     { plate, timestamp, rate_at_entry }
//     These come from the `numberplate` Firebase node.
//
export const processParkingData = (data) => {
  // ── 1. Separate PRD records (already have outTime) from legacy records ────
  const directRecords = data.filter(e => e._outTime !== undefined);
  const legacyRecords = data.filter(e => e._outTime === undefined);

  // ── 2. Robustly sort legacy records by parsed timestamp (asc) ─────────────
  legacyRecords.sort((a, b) => {
    const da = parseToDate(a.timestamp);
    const db = parseToDate(b.timestamp);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });

  // ── 3. Pair legacy records into sessions ──────────────────────────────────
  const processed = [];
  const plateMap  = {};

  legacyRecords.forEach(entry => {
    const plate       = entry.plate;
    const rateAtEntry = entry.rate_at_entry || entry.rateAtEntry || 20;

    if (!plateMap[plate]) {
      plateMap[plate] = { plate, entry: entry.timestamp, exit: null, status: 'Parked', rateAtEntry };
    } else if (plateMap[plate].status === 'Parked') {
      plateMap[plate].exit   = entry.timestamp;
      plateMap[plate].status = 'Exited';
      const dur = calculateDuration(plateMap[plate].entry, plateMap[plate].exit);
      plateMap[plate].duration = dur;
      plateMap[plate].amount   = calculateAmount(dur, plateMap[plate].rateAtEntry);
      processed.push({ ...plateMap[plate] });
      delete plateMap[plate];
    } else {
      processed.push({ ...plateMap[plate] });
      plateMap[plate] = { plate, entry: entry.timestamp, exit: null, status: 'Parked', rateAtEntry };
    }
  });

  Object.values(plateMap).forEach(v => processed.push(v));

  // ── 4. Map PRD records directly (no pairing needed) ───────────────────────
  const directProcessed = directRecords.map(entry => {
    const inTime  = entry.timestamp;   // normalised to `timestamp` by normaliseEntry
    const outTime = entry._outTime;    // stored as _outTime by normaliseEntry to avoid collision
    const rate    = entry.rate_at_entry || 20;
    const dur     = outTime ? calculateDuration(inTime, outTime) : null;
    const amount  = entry._amount != null ? entry._amount : calculateAmount(dur, rate);
    return {
      plate:       entry.plate,
      entry:       inTime,
      exit:        outTime || null,
      status:      outTime ? 'Exited' : 'Parked',
      duration:    dur,
      amount:      amount || 0,
      rateAtEntry: rate,
      vehicle_type: entry.vehicle_type || null,
      zone:         entry.zone || null,
    };
  });

  // ── 5. Merge both arrays, sort newest-first ───────────────────────────────
  const all = [...processed, ...directProcessed];
  all.sort((a, b) => {
    const da = parseToDate(b.entry);
    const db = parseToDate(a.entry);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });
  return all;
};

// Generate UPI payment link
export const generateUPILink = (upiId, upiName, amount, plate) => {
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Parking - ' + plate)}`;
};
