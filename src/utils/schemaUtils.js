/**
 * Unified schema field mapping for backward compatibility
 * Handles both legacy and PRD database schemas
 *
 * VeloxPark uses two database schemas:
 * - Legacy: number_plate, date_time (from ESP32 hardware)
 * - PRD: plate, inTime, outTime, status (from manual entries)
 *
 * This utility normalizes both schemas to a canonical format.
 */

export const UNIFIED_SCHEMA = {
  plate: ['plate', 'number_plate', 'numberPlate'],
  inTime: ['inTime', 'date_time', 'dateTime', 'timestamp'],
  outTime: ['outTime', 'exit_time', 'exitTime'],
  vehicleType: ['vehicleType', 'vehicle_type'],
  zone: ['zone', 'parking_zone'],
  rateAtEntry: ['rateAtEntry', 'rate_at_entry'],
  status: ['status'],
  duration: ['duration'],
  amount: ['amount'],
  manualEntry: ['manualEntry', 'manual_entry'],
  createdAt: ['createdAt', 'created_at'],
  createdBy: ['createdBy', 'created_by'],
  lastModified: ['lastModified', 'last_modified'],
  schemaVersion: ['schemaVersion', 'schema_version']
};

/**
 * Normalizes database entry to use canonical field names
 *
 * @param {Object} entry - Raw database entry from either schema
 * @returns {Object|null} Normalized entry with canonical field names
 *
 * @example
 * // Legacy entry
 * normalizeEntry({ number_plate: 'TS15EL5671', date_time: '29/1/26 14:00' })
 * // Returns: { plate: 'TS15EL5671', inTime: '29/1/26 14:00' }
 *
 * @example
 * // PRD entry
 * normalizeEntry({ plate: 'TS15EL5671', inTime: '2026-03-01T08:30:00.000Z', status: 'parked' })
 * // Returns: { plate: 'TS15EL5671', inTime: '2026-03-01T08:30:00.000Z', status: 'parked' }
 */
export const normalizeEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return null;

  const normalized = {};

  Object.keys(UNIFIED_SCHEMA).forEach(canonicalField => {
    const aliases = UNIFIED_SCHEMA[canonicalField];
    for (const alias of aliases) {
      if (entry[alias] !== undefined && entry[alias] !== null) {
        normalized[canonicalField] = entry[alias];
        break;
      }
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : null;
};

/**
 * Validates if an entry has minimum required fields
 *
 * @param {Object} entry - Database entry to validate
 * @returns {boolean} True if entry has required fields
 *
 * @example
 * validateEntry({ plate: 'TS15EL5671', inTime: '2026-03-01T08:30:00.000Z' }) // true
 * validateEntry({ inTime: '2026-03-01T08:30:00.000Z' })  // false (no plate)
 * validateEntry({}) // false
 */
export const validateEntry = (entry) => {
  const normalized = normalizeEntry(entry);
  if (!normalized) return false;

  // Must have plate and at least one timestamp
  return !!(normalized.plate && (normalized.inTime || normalized.outTime));
};

/**
 * Converts legacy entry to PRD schema format
 *
 * @param {Object} entry - Legacy format entry
 * @returns {Object} Entry in PRD format
 *
 * @example
 * convertLegacyToPRD({ number_plate: 'TS15EL5671', date_time: '29/1/26 14:00' })
 * // Returns: { plate: 'TS15EL5671', inTime: '29/1/26 14:00', status: 'parked' }
 */
export const convertLegacyToPRD = (entry) => {
  const normalized = normalizeEntry(entry);
  if (!normalized) return null;

  return {
    plate: normalized.plate,
    inTime: normalized.inTime || new Date().toISOString(),
    outTime: normalized.outTime || null,
    duration: normalized.duration || null,
    amount: normalized.amount || null,
    status: normalized.status || 'parked',
    vehicleType: normalized.vehicleType || 'Car',
    zone: normalized.zone || 'Zone A',
    rateAtEntry: normalized.rateAtEntry || 20,
    manualEntry: normalized.manualEntry || false,
    schemaVersion: 2
  };
};

/**
 * Batch normalize array of entries
 *
 * @param {Array} entries - Array of raw database entries
 * @returns {Array} Array of normalized entries
 */
export const normalizeEntries = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries
    .map(normalizeEntry)
    .filter(entry => entry !== null);
};
