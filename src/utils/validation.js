/**
 * Input validation utilities for VeloxPark
 * Provides validation functions for license plates, vehicle types, zones, and other inputs
 */

/**
 * Valid Indian State and Union Territory 2-letter RTO codes
 */
export const INDIAN_STATE_CODES = new Set([
  'AN', // Andaman and Nicobar Islands
  'AP', // Andhra Pradesh
  'AR', // Arunachal Pradesh
  'AS', // Assam
  'BR', // Bihar
  'CG', // Chhattisgarh
  'CH', // Chandigarh
  'DD', // Daman and Diu
  'DL', // Delhi
  'DN', // Dadra and Nagar Haveli
  'GA', // Goa
  'GJ', // Gujarat
  'HR', // Haryana
  'HP', // Himachal Pradesh
  'JH', // Jharkhand
  'JK', // Jammu and Kashmir
  'KA', // Karnataka
  'KL', // Kerala
  'LA', // Ladakh
  'LD', // Lakshadweep
  'MP', // Madhya Pradesh
  'MH', // Maharashtra
  'MN', // Manipur
  'ML', // Meghalaya
  'MZ', // Mizoram
  'NL', // Nagaland
  'OD', // Odisha
  'OR', // Odisha (legacy code)
  'PB', // Punjab
  'PY', // Puducherry
  'RJ', // Rajasthan
  'SK', // Sikkim
  'TN', // Tamil Nadu
  'TR', // Tripura
  'TS', // Telangana
  'UK', // Uttarakhand
  'UA', // Uttarakhand (legacy code)
  'UP', // Uttar Pradesh
  'WB', // West Bengal
]);

/**
 * Cleans a license plate string by stripping spaces, dashes, dots, and converting to uppercase.
 *
 * @param {string} plate - Raw license plate string
 * @returns {string} Cleaned alphanumeric uppercase string
 */
export const cleanPlate = (plate) => {
  if (!plate) return '';
  return String(plate).replace(/[^A-Za-z0-9]/g, '').toUpperCase().trim();
};

/**
 * Validates Indian license plate format according to MoRTH standards:
 *
 * 1. Standard State/UT Series:
 *    - 2 letters: Valid Indian State or UT code (e.g. RJ, GJ, TS, MH, DL)
 *    - 1-2 digits: RTO district code (e.g. 05, 14, 01)
 *    - 0-3 letters: Series code (e.g. CV, MZ, MP, SD, AJ, AK, A, CAA)
 *    - Exactly 4 digits: Vehicle registration number (0001 - 9999).
 *      Note: Under MoRTH & HSRP rules, numbers below 1000 MUST be zero-padded (e.g. 0002, 0193).
 *      Plates missing digits (e.g. RJ14CV0 or GJ05SD193) are invalid.
 *
 * 2. Bharat Series (BH):
 *    - 2 digits: Year of registration (e.g. 21, 22, 23, 24, 25, 26)
 *    - "BH": Bharat series identifier
 *    - Exactly 4 digits: Registration number (0001 - 9999)
 *    - 1-2 letters: Series letters (e.g. AA, AB, Z)
 *    Example: 22BH1234AA
 *
 * @param {string} plate - License plate to validate
 * @returns {Object} { valid: boolean, message?: string, cleaned: string, type?: string, state?: string }
 */
export const validateLicensePlate = (plate) => {
  if (!plate) {
    return {
      valid: false,
      message: 'License plate is required',
      cleaned: '',
    };
  }

  const cleaned = cleanPlate(plate);

  if (!cleaned) {
    return {
      valid: false,
      message: 'License plate cannot be empty',
      cleaned: '',
    };
  }

  // ── 1. Check Bharat Series (BH) ──────────────────────────────────────────
  // Format: YY BH 1234 AA (e.g., 22BH1234AA)
  const bhMatch = cleaned.match(/^([0-9]{2})BH([0-9]{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return {
      valid: true,
      cleaned,
      type: 'BH',
    };
  }

  // If starts with 2 digits but is not BH format
  if (/^[0-9]{2}/.test(cleaned)) {
    return {
      valid: false,
      message: 'Invalid format. Plate starting with numbers must follow BH series (e.g., 22BH1234AA)',
      cleaned,
    };
  }

  // ── 2. Check Standard State/UT Format ────────────────────────────────────
  // Standard format: State(2) + RTO(1-2) + Series(0-3) + Number(exactly 4 digits)
  const standardMatch = cleaned.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{4})$/);
  if (standardMatch) {
    const stateCode = standardMatch[1];
    if (!INDIAN_STATE_CODES.has(stateCode)) {
      return {
        valid: false,
        message: `Invalid state code "${stateCode}". Must start with a valid Indian state/UT code (e.g., RJ, GJ, TS, MH, DL)`,
        cleaned,
      };
    }
    return {
      valid: true,
      cleaned,
      type: 'Standard',
      state: stateCode,
    };
  }

  // ── 3. Diagnostic checks for informative error messages ───────────────────
  // A: Missing digits at the end (e.g. RJ14CV0 or GJ05SD193)
  const partialDigitsMatch = cleaned.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,3})$/);
  if (partialDigitsMatch) {
    const stateCode = partialDigitsMatch[1];
    const rto = partialDigitsMatch[2];
    const series = partialDigitsMatch[3] || '';
    const digits = partialDigitsMatch[4];
    const example = `${stateCode}${rto}${series}${digits.padStart(4, '0')}`;
    return {
      valid: false,
      message: `Incomplete number plate: standard vehicle registration must end with exactly 4 digits (e.g., ${example})`,
      cleaned,
    };
  }

  // B: Missing number entirely (e.g. RJ14CV)
  if (/^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}$/.test(cleaned)) {
    return {
      valid: false,
      message: `Missing number in plate: license plate must end with a 4-digit number (e.g., ${cleaned}1234)`,
      cleaned,
    };
  }

  // C: Too short or too long
  if (cleaned.length < 8) {
    return {
      valid: false,
      message: 'License plate is too short. Standard format requires at least 8 characters (e.g., DL01A1234, RJ14CV0002)',
      cleaned,
    };
  }

  if (cleaned.length > 11) {
    return {
      valid: false,
      message: 'License plate is too long. Standard format does not exceed 10-11 characters',
      cleaned,
    };
  }

  // Default invalid format error
  return {
    valid: false,
    message: 'Invalid license plate format. Must follow standard format (e.g., RJ14CV0002, TS15EL5671, 22BH1234AA)',
    cleaned,
  };
};

/**
 * Returns true if the license plate follows the standard Indian format.
 *
 * @param {string} plate - License plate string
 * @returns {boolean}
 */
export const isValidPlate = (plate) => {
  return validateLicensePlate(plate).valid;
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
