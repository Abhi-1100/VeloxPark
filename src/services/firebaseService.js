/**
 * firebaseService.js
 * ------------------
 * Centralises all Firebase Realtime Database read operations.
 * Components / hooks import from here instead of calling Firebase APIs directly.
 *
 * WHY: Separation of concerns — UI components should not know about Firebase
 * internals. Swapping the data source (e.g. REST API, mock) only requires
 * changes here, nowhere else.
 */

import { ref, onValue, off, push } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { processParkingData } from '../utils/parkingUtils';
import { getRateForVehicleType } from './settingsService';

/**
 * Normalises a raw Firebase / JSON entry into a flat { id, plate, timestamp, rate_at_entry } object.
 * Returns null when the plate value is missing or "NULL".
 */
const normaliseEntry = (key, entry) => {
    const plateVal =
        entry.number_plate || entry.numberPlate || entry.plate || '';
    if (!plateVal || plateVal === 'NULL') return null;
    return {
        id: key,
        plate: plateVal,
        timestamp:
            entry.date_time ||
            entry.dateTime ||
            entry.timestamp ||
            entry.time,
        rate_at_entry: entry.rate_at_entry || entry.rateAtEntry || null,
    };
};

/**
 * Subscribes to the Firebase `numberplate` node.
 *
 * @param {function} onSuccess  Called with { rawData, processedData } on every update.
 * @param {function} onError    Called with the Firebase error; triggers a fallback fetch.
 * @returns {function}          Unsubscribe / cleanup function.
 */
export const subscribeToNumberplates = (onSuccess, onError) => {
    const numberplateRef = ref(database, 'numberplate');

    const handleSnapshot = (snapshot) => {
        const val = snapshot.val();
        const rawData = [];

        if (val) {
            Object.keys(val).forEach((key) => {
                const entry = normaliseEntry(key, val[key]);
                if (entry) rawData.push(entry);
            });
        }

        const processedData = processParkingData(rawData);
        onSuccess({ rawData, processedData });
    };

    onValue(numberplateRef, handleSnapshot, (error) => {
        console.error('Firebase error:', error);
        onError(error);
    });

    // Return cleanup so callers can call off() in useEffect return
    return () => off(numberplateRef);
};

/**
 * Fallback: loads parking data from the local `/numberplate.json` file.
 * Used when Firebase is unreachable.
 *
 * @param {function} onSuccess  Called with { rawData, processedData }.
 * @param {function} onError    Called with the fetch error.
 */
export const loadLocalFallback = async (onSuccess, onError) => {
    try {
        const res = await fetch('/numberplate.json');
        const json = await res.json();
        const rawData = [];

        const entries = Array.isArray(json)
            ? json.map((item, idx) => [String(idx), item])
            : Object.entries(json);

        entries.forEach(([key, entry]) => {
            const normalised = normaliseEntry(key, entry);
            if (normalised) {
                // Prefix local IDs so they never collide with Firebase keys
                rawData.push({ ...normalised, id: `local_${key}` });
            }
        });

        const processedData = processParkingData(rawData);
        onSuccess({ rawData, processedData });
    } catch (err) {
        console.error('Failed to load local data:', err);
        onError(err);
    }
};

/**
 * Manually pushes a new vehicle entry to Firebase `numberplate` node.
 * Mirrors the exact payload written by the hardware sensor.
 * IMPORTANT: Stores the current rate at entry time (rateAtEntry) so that
 * future rate changes don't affect this parking session's pricing.
 *
 * @param {string} plate   Licence plate string (will be uppercased)
 * @param {string} type    Vehicle type label (e.g. 'Car', 'Bike')
 * @param {string} zone    Parking zone label (e.g. 'Zone A')
 * @returns {Promise<string>}  Resolves with the new Firebase key.
 */
export const pushManualEntry = async (plate, type, zone) => {
    const numberplateRef = ref(database, 'numberplate');
    const now = new Date();
    // Format: "DD Mon YYYY, HH:MM am/pm"  — same as hardware timestamps
    const formatted = now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    }).replace(',', '');

    // Fetch the current rate for this vehicle type
    const vehicleType = type || 'Car';
    const currentRate = await getRateForVehicleType(vehicleType);

    const payload = {
        number_plate: plate.toUpperCase().trim(),
        date_time: formatted,
        vehicle_type: vehicleType,
        zone: zone || 'Zone A',
        manual_entry: true,
        rate_at_entry: currentRate, // Store rate at entry time
    };

    const newRef = await push(numberplateRef, payload);
    return newRef.key;
};

/**
 * Signs the current admin user out of Firebase Auth.
 */
export const logoutAdmin = () => signOut(auth);
