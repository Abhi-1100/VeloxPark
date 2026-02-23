// Calculate duration between entry and exit
export const calculateDuration = (entry, exit) => {
  if (!exit) return null;
  
  const entryTime = new Date(entry);
  const exitTime = new Date(exit);
  const diffMs = exitTime - entryTime;
  
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

// Robust parsing for many timestamp formats to a Date object
export const parseToDate = (dateTimeStr) => {
  if (!dateTimeStr) return null;
  
  // Try native parse first
  const d = new Date(dateTimeStr);
  if (!isNaN(d)) return d;

  // Try common dd/mm/yy or dd-mm-yyyy with optional time
  const m = dateTimeStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (m) {
    let day = parseInt(m[1], 10);
    let month = parseInt(m[2], 10) - 1; // zero-based
    let year = parseInt(m[3], 10);
    if (year < 100) year += 2000; // assume 2000+
    const hour = m[4] ? parseInt(m[4], 10) : 0;
    const minute = m[5] ? parseInt(m[5], 10) : 0;
    const dt = new Date(year, month, day, hour, minute);
    if (!isNaN(dt)) return dt;
  }

  return null;
};

// Check if a datetime string falls on a given yyyy-mm-dd date string
export const isSameDate = (dateTimeStr, dateStr) => {
  if (!dateTimeStr || !dateStr) return false;
  const d = parseToDate(dateTimeStr);
  if (!d) return false;
  return d.toISOString().split('T')[0] === dateStr;
};

// Get today's date in yyyy-mm-dd format
export const getTodayDateStr = () => {
  return new Date().toISOString().split('T')[0];
};

// Process parking data to determine entry/exit
export const processParkingData = (data) => {
  // Sort by timestamp
  data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const processed = [];
  const plateMap = {};

  data.forEach(entry => {
    const plate = entry.plate;
    // Extract rate_at_entry if it exists, otherwise use default
    const rateAtEntry = entry.rate_at_entry || entry.rateAtEntry || 20;

    if (!plateMap[plate]) {
      // First occurrence - Entry
      plateMap[plate] = {
        plate: plate,
        entry: entry.timestamp,
        exit: null,
        status: 'Parked',
        rateAtEntry: rateAtEntry, // Store rate for this parking session
      };
    } else if (plateMap[plate].status === 'Parked') {
      // Second occurrence - Exit
      plateMap[plate].exit = entry.timestamp;
      plateMap[plate].status = 'Exited';
      
      // Calculate duration and amount using the rate stored at entry
      const duration = calculateDuration(plateMap[plate].entry, plateMap[plate].exit);
      const amount = calculateAmount(duration, plateMap[plate].rateAtEntry);
      
      plateMap[plate].duration = duration;
      plateMap[plate].amount = amount;
      
      // Add to processed and reset for new entry
      processed.push({...plateMap[plate]});
      delete plateMap[plate];
    } else {
      // New entry for same plate after exit
      processed.push({...plateMap[plate]});
      plateMap[plate] = {
        plate: plate,
        entry: entry.timestamp,
        exit: null,
        status: 'Parked',
        rateAtEntry: rateAtEntry,
      };
    }
  });

  // Add remaining parked vehicles
  Object.values(plateMap).forEach(vehicle => {
    processed.push(vehicle);
  });

  return processed.reverse(); // Show newest first
};

// Generate UPI payment link
export const generateUPILink = (upiId, upiName, amount, plate) => {
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Parking - ' + plate)}`;
};
