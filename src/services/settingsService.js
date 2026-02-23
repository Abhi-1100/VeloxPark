/**
 * settingsService.js
 * ------------------
 * Manages parking rate settings in Firebase.
 * Rates are stored under /settings/rates and each parking entry 
 * will store the rate that was active at the time of entry.
 */

import { ref, get, set, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Default rate structure
 */
const DEFAULT_RATES = {
    car: 20,
    bike: 10,
    truck: 50,
    lastUpdated: new Date().toISOString(),
};

/**
 * Get current parking rates from Firebase
 * @returns {Promise<Object>} Current rates object
 */
export const getCurrentRates = async () => {
    try {
        const ratesRef = ref(database, 'settings/rates');
        const snapshot = await get(ratesRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            // Initialize with default rates if not exists
            await set(ratesRef, DEFAULT_RATES);
            return DEFAULT_RATES;
        }
    } catch (error) {
        console.error('Error fetching rates:', error);
        // Return default rates on error
        return DEFAULT_RATES;
    }
};

/**
 * Update parking rates in Firebase
 * @param {Object} rates - New rates object { car, bike, truck }
 * @returns {Promise<void>}
 */
export const updateRates = async (rates) => {
    try {
        const ratesRef = ref(database, 'settings/rates');
        const updatedRates = {
            ...rates,
            lastUpdated: new Date().toISOString(),
        };
        await set(ratesRef, updatedRates);
        return updatedRates;
    } catch (error) {
        console.error('Error updating rates:', error);
        throw error;
    }
};

/**
 * Subscribe to rate changes in Firebase
 * @param {Function} callback - Called with updated rates on every change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToRates = (callback) => {
    const ratesRef = ref(database, 'settings/rates');
    
    onValue(ratesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(DEFAULT_RATES);
        }
    });
    
    return () => off(ratesRef);
};

/**
 * Get rate for a specific vehicle type
 * @param {string} vehicleType - 'car', 'bike', 'truck', etc.
 * @returns {Promise<number>} Rate per hour for the vehicle type
 */
export const getRateForVehicleType = async (vehicleType) => {
    const rates = await getCurrentRates();
    const type = vehicleType?.toLowerCase() || 'car';
    
    // Map common vehicle type variations
    if (type.includes('bike') || type.includes('motorcycle') || type.includes('two')) {
        return rates.bike || DEFAULT_RATES.bike;
    } else if (type.includes('truck') || type.includes('heavy')) {
        return rates.truck || DEFAULT_RATES.truck;
    } else {
        // Default to car rate
        return rates.car || DEFAULT_RATES.car;
    }
};
