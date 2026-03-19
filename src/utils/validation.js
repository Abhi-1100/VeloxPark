/**
 * Input validation utilities for VeloxPark
 * Provides validation functions for license plates, vehicle types, zones, and other inputs
 */

/**
 * Validates Indian license plate format
 *
 * Indian license plate format:
 * - 2 letters (State code, e.g., TS, MH, DL)
 * - 1-2 digits (RTO code)
 * - 1-3 letters (Series)
 * - 1-4 digits (Registration number)
 *
 * Examples: TS15EL5671, MH12AB1234, DL1CAB4321
 *
 * @param {string} plate - License plate to validate
 * @returns {Object} { valid: boolean, message?: string, cleaned?: string }
 *
 * @example
 * validateLicensePlate('TS15EL5671')
 * // Returns: { valid: true, cleaned: 'TS15EL5671' }
 *
 * @example
 * validateLicensePlate('abc123')
 * // Returns: { valid: false, message: 'Invalid format...' }
 *
 * @example
 * validateLicensePlate('  ts15el5671  ')
 * // Returns: { valid: true, cleaned: 'TS15EL5671' }
 */
export const validateLicensePlate = (plate) => {
  // Check if plate is provided
  if (!plate) {
    return {
      valid: false,
      message: 'License plate is required'
    };
  }

  // Clean the input (trim and uppercase)
  const cleaned = plate.toString().toUpperCase().trim();

  // Check length constraints
  if (cleaned.length < 4) {
    return {
      valid: false,
      message: 'License plate must be at least 4 characters'
    };
  }

  if (cleaned.length > 12) {
    return {
      valid: false,
      message: 'License plate must not exceed 12 characters'
    };
  }

  // Indian license plate pattern
  // Format: XX00XX0000
  // - 2 letters (state code)
  // - 1-2 digits (RTO code)
  // - 1-3 letters (series)
  // - 1-4 digits (registration number)
  const indianPlateRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/;

  if (!indianPlateRegex.test(cleaned)) {
    return {
      valid: false,
      message: 'Invalid format. Use XX00XX0000 (e.g., TS15EL5671, MH12AB1234)'
    };
  }

  return {
    valid: true,
    cleaned: cleaned
  };
};

/**
 * Validates vehicle type
 *
 * @param {string} type - Vehicle type to validate
 * @returns {boolean} True if vehicle type is valid
 *
 * @example
 * validateVehicleType('Car')  // true
 * validateVehicleType('Bike') // true
 * validateVehicleType('Bus')  // false
 */
export const validateVehicleType = (type) => {
  const validTypes = ['Car', 'Bike', 'Truck', 'EV'];
  return validTypes.includes(type);
};

/**
 * Validates zone name
 *
 * @param {string} zone - Zone name to validate
 * @returns {boolean} True if zone format is valid
 *
 * @example
 * validateZone('Zone A')     // true
 * validateZone('Zone E (EV)') // true
 * validateZone('Parking 1')  // false
 */
export const validateZone = (zone) => {
  if (!zone || typeof zone !== 'string') return false;

  // Basic zone pattern: "Zone X" or "Zone X (Y)"
  const zoneRegex = /^Zone [A-Z]( \([A-Z]+\))?$/;
  return zoneRegex.test(zone);
};

/**
 * Validates parking rate (must be a positive number)
 *
 * @param {number} rate - Parking rate per hour
 * @returns {Object} { valid: boolean, message?: string }
 *
 * @example
 * validateRate(20)  // { valid: true }
 * validateRate(-5)  // { valid: false, message: '...' }
 * validateRate('x') // { valid: false, message: '...' }
 */
export const validateRate = (rate) => {
  if (rate === null || rate === undefined) {
    return {
      valid: false,
      message: 'Rate is required'
    };
  }

  const numRate = Number(rate);

  if (isNaN(numRate)) {
    return {
      valid: false,
      message: 'Rate must be a valid number'
    };
  }

  if (numRate < 0) {
    return {
      valid: false,
      message: 'Rate cannot be negative'
    };
  }

  if (numRate > 1000) {
    return {
      valid: false,
      message: 'Rate seems too high (max: ₹1000/hour)'
    };
  }

  return {
    valid: true
  };
};

/**
 * Validates ISO 8601 timestamp
 *
 * @param {string} timestamp - ISO timestamp to validate
 * @returns {Object} { valid: boolean, message?: string }
 *
 * @example
 * validateTimestamp('2026-03-01T08:30:00.000Z') // { valid: true }
 * validateTimestamp('invalid') // { valid: false, message: '...' }
 */
export const validateTimestamp = (timestamp) => {
  if (!timestamp) {
    return {
      valid: false,
      message: 'Timestamp is required'
    };
  }

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return {
      valid: false,
      message: 'Invalid timestamp format'
    };
  }

  // Check if timestamp is in the future (with 1 minute tolerance)
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60000);

  if (date > oneMinuteFromNow) {
    return {
      valid: false,
      message: 'Timestamp cannot be in the future'
    };
  }

  return {
    valid: true
  };
};

/**
 * Validates parking status
 *
 * @param {string} status - Status to validate
 * @returns {boolean} True if status is valid
 *
 * @example
 * validateStatus('parked')  // true
 * validateStatus('exited')  // true
 * validateStatus('pending') // false
 */
export const validateStatus = (status) => {
  const validStatuses = ['parked', 'exited'];
  return validStatuses.includes(status);
};

/**
 * Validates duration object
 *
 * @param {Object} duration - Duration object with hours, minutes, totalMinutes
 * @returns {Object} { valid: boolean, message?: string }
 *
 * @example
 * validateDuration({ hours: 2, minutes: 30, totalMinutes: 150 })
 * // { valid: true }
 */
export const validateDuration = (duration) => {
  if (!duration || typeof duration !== 'object') {
    return {
      valid: false,
      message: 'Duration must be an object'
    };
  }

  const { hours, minutes, totalMinutes } = duration;

  if (typeof hours !== 'number' || typeof minutes !== 'number' || typeof totalMinutes !== 'number') {
    return {
      valid: false,
      message: 'Duration must contain numeric hours, minutes, and totalMinutes'
    };
  }

  if (hours < 0 || minutes < 0 || totalMinutes < 0) {
    return {
      valid: false,
      message: 'Duration values cannot be negative'
    };
  }

  if (hours > 720) {
    return {
      valid: false,
      message: 'Duration seems too long (max: 30 days)'
    };
  }

  return {
    valid: true
  };
};

/**
 * Validates complete parking entry (for manual entries)
 *
 * @param {Object} entry - Parking entry object
 * @returns {Object} { valid: boolean, errors: Array<string> }
 *
 * @example
 * validateParkingEntry({
 *   plate: 'TS15EL5671',
 *   vehicleType: 'Car',
 *   zone: 'Zone A',
 *   inTime: '2026-03-01T08:30:00.000Z'
 * })
 * // { valid: true, errors: [] }
 */
export const validateParkingEntry = (entry) => {
  const errors = [];

  // Validate plate
  const plateValidation = validateLicensePlate(entry.plate);
  if (!plateValidation.valid) {
    errors.push(`Plate: ${plateValidation.message}`);
  }

  // Validate vehicle type
  if (!validateVehicleType(entry.vehicleType)) {
    errors.push('Vehicle Type: Must be Car, Bike, Truck, or EV');
  }

  // Validate zone
  if (!validateZone(entry.zone)) {
    errors.push('Zone: Must be in format "Zone X"');
  }

  // Validate inTime
  if (entry.inTime) {
    const timeValidation = validateTimestamp(entry.inTime);
    if (!timeValidation.valid) {
      errors.push(`Entry Time: ${timeValidation.message}`);
    }
  }

  // Validate status
  if (entry.status && !validateStatus(entry.status)) {
    errors.push('Status: Must be "parked" or "exited"');
  }

  // Validate rate if provided
  if (entry.rateAtEntry !== undefined) {
    const rateValidation = validateRate(entry.rateAtEntry);
    if (!rateValidation.valid) {
      errors.push(`Rate: ${rateValidation.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Sanitizes user input (basic XSS prevention)
 *
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 *
 * @example
 * sanitizeInput('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
export const sanitizeInput = (input) => {
  if (!input) return '';

  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
