/**
 * firebaseService.js
 * ------------------
 * Centralises all Firebase Realtime Database operations.
 *
 * SCHEMA — two Firebase nodes are read/written:
 *
 *  numberplate/  (legacy — hardware ESP32 writes here)
 *    <pushKey>: {
 *      number_plate: "TS15EL5671",
 *      date_time:    "29/1/26 14:00"  // every scan = 1 record; pairs = session
 *    }
 *
 *  parkingLogs/  (PRD schema — manual entries and future hardware writes)
 *    <pushKey>: {
 *      plate:        "TS15EL5671",
 *      inTime:       "2026-03-01T08:30:00.000Z",  // ISO — reliable parsing
 *      outTime:      "2026-03-01T10:45:00.000Z",  // null while parked
 *      duration:     135,           // minutes, null while parked
 *      amount:       60,            // ₹, null while parked
 *      status:       "parked",      // "parked" | "exited"
 *      vehicleType:  "Car",
 *      zone:         "Zone A",
 *      rateAtEntry:  20,
 *      manualEntry:  true
 *    }
 *
 * settings/rates/  (parking fee rates)
 *    car: 20, bike: 10, truck: 50
 */

import { ref, onValue, off, push } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { processParkingData } from '../utils/parkingUtils';
import { getRateForVehicleType } from './settingsService';

/**
 * Normalises a raw Firebase entry from EITHER schema into a flat object.
 *
 * Legacy (numberplate node):
 *   { number_plate, date_time }  →  { id, plate, timestamp }
 *
 * PRD (parkingLogs node):
 *   { plate, inTime, outTime?, status? }  →  { id, plate, timestamp,
 *                                              _outTime, _amount, ... }
 *   The `_outTime` sentinel is checked by processParkingData to skip pairing.
 */
const normaliseEntry = (key, entry) => {
    // Support both schema field names for the plate number
    const plateVal =
        entry.plate || entry.number_plate || entry.numberPlate || '';
    if (!plateVal || plateVal === 'NULL') return null;

    // Entry time — PRD uses `inTime` (ISO), legacy uses `date_time`
    const inTime =
        entry.inTime ||
        entry.date_time ||
        entry.dateTime ||
        entry.timestamp ||
        entry.time;

    const base = {
        id:           key,
        plate:        plateVal,
        timestamp:    inTime,
        rate_at_entry: entry.rateAtEntry || entry.rate_at_entry || null,
        vehicle_type:  entry.vehicleType || entry.vehicle_type || null,
        zone:          entry.zone || null,
    };

    // PRD schema: preserve outTime + amount so processParkingData
    // can map these directly without pairing
    if (entry.outTime !== undefined) {
        base._outTime = entry.outTime || null;  // null = still parked
        base._amount  = entry.amount  != null ? entry.amount : null;
        base._status  = entry.status  || null;
    }

    return base;
};

/**
 * Subscribes to the Firebase `numberplate` node.
 *
 * @param {function} onSuccess  Called with { rawData, processedData } on every update.
 * @param {function} onError    Called with the Firebase error; triggers a fallback fetch.
 * @returns {function}          Unsubscribe / cleanup function.
 */
/**
 * Subscribes to BOTH Firebase nodes and merges results:
 *   - `numberplate`  (legacy hardware records)
 *   - `parkingLogs`  (PRD-schema manual/future hardware records)
 *
 * Waits for both initial responses before calling onSuccess to avoid
 * a partial render.  Subsequent real-time updates propagate immediately.
 *
 * @param {function} onSuccess  Called with { rawData, processedData } on every update.
 * @param {function} onError    Called when legacy node fails AND no data is available.
 * @returns {function}          Unsubscribe / cleanup function.
 */
export const subscribeToNumberplates = (onSuccess, onError) => {
    if (!database) {
        console.error('Firebase database is not initialized');
        onError(new Error('Firebase database is not initialized'));
        return () => {};
    }

    const numberplateRef  = ref(database, 'numberplate');
    const parkingLogsRef  = ref(database, 'parkingLogs');

    // Local caches — `null` means "not yet received" (distinct from empty [])
    let legacyData    = null;
    let prdData       = null;

    /** Merge both caches and call onSuccess. */
    const notify = () => {
        const rawData      = [...(legacyData || []), ...(prdData || [])];
        const processedData = processParkingData(rawData);
        console.log(`Firebase merged: ${(legacyData||[]).length} legacy + ${(prdData||[]).length} PRD → ${processedData.length} sessions`);
        onSuccess({ rawData, processedData });
    };

    // ── numberplate node ───────────────────────────────────────────────────────
    onValue(
        numberplateRef,
        (snapshot) => {
            const val = snapshot.val();
            legacyData = [];
            if (val) {
                Object.keys(val).forEach((key) => {
                    const entry = normaliseEntry(key, val[key]);
                    if (entry) legacyData.push(entry);
                });
            }
            // Notify only after both nodes have responded at least once
            if (prdData !== null) notify();
        },
        (error) => {
            console.error('Firebase numberplate error:', error.code, error.message);
            legacyData = [];                 // treat as empty so we can still proceed
            if (prdData !== null) {
                notify();                    // show whatever PRD data we have
            } else {
                onError(error);              // both nodes failed — trigger fallback
            }
        }
    );

    // ── parkingLogs node ───────────────────────────────────────────────────────
    onValue(
        parkingLogsRef,
        (snapshot) => {
            const val = snapshot.val();
            prdData = [];
            if (val) {
                Object.keys(val).forEach((key) => {
                    const entry = normaliseEntry(key, val[key]);
                    if (entry) prdData.push(entry);
                });
            }
            if (legacyData !== null) notify();
        },
        (error) => {
            // parkingLogs might not exist yet — treat as empty, not fatal
            console.warn('Firebase parkingLogs error (may not exist yet):', error.code);
            prdData = [];
            if (legacyData !== null) notify();
        }
    );

    return () => {
        off(numberplateRef);
        off(parkingLogsRef);
    };
};

/**
 * Fallback: loads parking data from local JSON files.
 * Attempts to load BOTH `/numberplate.json` (legacy) and `/parkingLogs.json` (PRD schema).
 * Used when Firebase is unreachable.
 *
 * @param {function} onSuccess  Called with { rawData, processedData }.
 * @param {function} onError    Called with the fetch error.
 */
export const loadLocalFallback = async (onSuccess, onError) => {
    try {
        const rawData = [];

        // Load legacy numberplate.json
        try {
            const res = await fetch('/numberplate.json');
            const json = await res.json();
            const entries = Array.isArray(json)
                ? json.map((item, idx) => [String(idx), item])
                : Object.entries(json);

            entries.forEach(([key, entry]) => {
                const normalised = normaliseEntry(key, entry);
                if (normalised) {
                    rawData.push({ ...normalised, id: `local_${key}` });
                }
            });
        } catch (err) {
            console.warn('numberplate.json not found or error:', err.message);
        }

        // Load PRD schema parkingLogs.json
        try {
            const res = await fetch('/parkingLogs.json');
            const json = await res.json();
            const entries = Array.isArray(json)
                ? json.map((item, idx) => [String(idx), item])
                : Object.entries(json);

            entries.forEach(([key, entry]) => {
                const normalised = normaliseEntry(key, entry);
                if (normalised) {
                    rawData.push({ ...normalised, id: `local_${key}` });
                }
            });
        } catch (err) {
            console.warn('parkingLogs.json not found or error:', err.message);
        }

        const processedData = processParkingData(rawData);
        onSuccess({ rawData, processedData });
    } catch (err) {
        console.error('Failed to load local data:', err);
        onError(err);
    }
};

/**
 * Manually pushes a new vehicle entry to the `parkingLogs` PRD-schema node.
 * Uses ISO timestamps for reliable cross-platform parsing.
 * Stores rateAtEntry so future rate changes never affect this session's billing.
 *
 * @param {string} plate   Licence plate (uppercased)
 * @param {string} type    Vehicle type ('Car', 'Bike', 'Truck', 'EV')
 * @param {string} zone    Parking zone ('Zone A' …)
 * @returns {Promise<string>}  Resolves with the new Firebase push-key.
 */
export const pushManualEntry = async (plate, type, zone) => {
    try {
        if (!database) throw new Error('Firebase database is not initialized');

        const parkingLogsRef = ref(database, 'parkingLogs');
        const vehicleType    = type || 'Car';

        // Fetch current rate; fall back to hardcoded defaults on error
        let rateAtEntry;
        try {
            rateAtEntry = await getRateForVehicleType(vehicleType);
        } catch {
            const defaults = { Car: 20, Bike: 10, Truck: 50, EV: 20 };
            rateAtEntry = defaults[vehicleType] || 20;
        }

        const payload = {
            plate:       plate.toUpperCase().trim(),
            inTime:      new Date().toISOString(),  // ISO — reliable parseToDate target
            outTime:     null,
            duration:    null,
            amount:      null,
            status:      'parked',
            vehicleType: vehicleType,
            zone:        zone || 'Zone A',
            rateAtEntry: rateAtEntry,
            manualEntry: true,
        };

        console.log('Pushing manual entry to parkingLogs:', payload);
        const newRef = await push(parkingLogsRef, payload);
        console.log('Manual entry created, key:', newRef.key);
        return newRef.key;
    } catch (error) {
        console.error('pushManualEntry error:', error);
        throw new Error(error.message || 'Failed to create entry');
    }
};

/**
 * Signs the current admin user out of Firebase Auth.
 */
export const logoutAdmin = () => signOut(auth);
