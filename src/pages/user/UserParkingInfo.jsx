import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../config/firebase';
import {
  calculateDuration,
  calculateAmount,
} from '../../utils/parkingUtils';
import { validateLicensePlate } from '../../utils/validation';
import Dashboard from './Dashboard';

const UserParkingInfo = () => {
  const [plateInput, setPlateInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [upiConfig, setUpiConfig] = useState({
    upiId: 'parking@upi',
    upiName: 'VeloxPark',
  });

  // Load UPI config
  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((cfg) => {
        if (cfg.upiId) setUpiConfig((prev) => ({ ...prev, upiId: cfg.upiId }));
        if (cfg.upiName) setUpiConfig((prev) => ({ ...prev, upiName: cfg.upiName }));
      })
      .catch(() => {
        /* Use defaults */
      });
  }, []);

  /** Parse raw numberplate data object and find the most recent session for a plate. */
  const findVehicleInData = (data, plate) => {
    if (!data) return null;
    const scans = [];
    let directSession = null;
    Object.keys(data).forEach((key) => {
      const entry = data[key];
      const entryPlate = entry.number_plate || entry.plate || '';
      if (entryPlate === plate && entryPlate !== 'NULL') {
        if (entry.outTime !== undefined) {
          const dur = entry.duration != null ? { hours: Math.floor(entry.duration / 60), minutes: entry.duration % 60, totalMinutes: entry.duration } : calculateDuration(entry.inTime, entry.outTime);
          directSession = { sessionId: key, source: 'parkingLogs', plate, entry: entry.inTime || entry.date_time, exit: entry.outTime, status: entry.outTime ? 'Exited' : 'Parked', duration: dur, amount: entry.amount != null ? entry.amount : calculateAmount(dur, entry.rateAtEntry || 20) };
          return;
        }
        const ts = entry.date_time || entry.inTime || entry.timestamp;
        if (ts) scans.push({ id: key, plate: entryPlate, timestamp: ts });
      }
    });
    if (directSession) return directSession;
    if (scans.length === 0) return null;

    // Sort all scans ascending (oldest -> newest)
    scans.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const lastIdx = scans.length - 1;
    const isOddCount = scans.length % 2 !== 0;

    // If odd number of scans, vehicle is still parked
    if (isOddCount) {
      return { sessionId: 'legacy_' + scans[lastIdx].id, source: 'numberplate', plate, entry: scans[lastIdx].timestamp, exit: null, status: 'Parked' };
    }

    // Even: last two scans form the most recent session
    const sessionEntry = scans[lastIdx - 1].timestamp;
    const sessionExit = scans[lastIdx].timestamp;
    const dur = calculateDuration(sessionEntry, sessionExit);
    return {
      plate,
      entry: sessionEntry,
      exit: sessionExit,
      status: 'Exited',
      duration: dur,
      amount: calculateAmount(dur),
    };
  };

  const searchVehicle = async (plate) => {
    // Try Firebase first
    try {
      const numberplateRef = ref(database, 'numberplate');
      const snapshot = await get(numberplateRef);
      const result = findVehicleInData(snapshot.val(), plate);
      if (!result) {
        try {
          const logsRef = ref(database, 'parkingLogs');
          const logsSnap = await get(logsRef);
          return findVehicleInData(logsSnap.val(), plate);
        } catch {
          /* fall through */
        }
      }
      return result;
    } catch (firebaseErr) {
      console.warn('[UserParkingInfo] Firebase read failed, using local fallback:', firebaseErr.code);
    }

    // Local fallback
    try {
      const res = await fetch('/numberplate.json');
      const data = await res.json();
      return findVehicleInData(data, plate);
    } catch (localErr) {
      console.error('[UserParkingInfo] Local fallback also failed:', localErr);
      throw localErr;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plateCheck = validateLicensePlate(plateInput);
    if (!plateCheck.valid) {
      setError(plateCheck.message || 'Invalid license plate format.');
      return;
    }
    const plate = plateCheck.cleaned;
    setLoading(true);
    setError('');
    setVehicleData(null);
    try {
      const data = await searchVehicle(plate);
      if (data) setVehicleData(data);
      else setError('Vehicle not found. Please check the number plate and try again.');
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sharedProps = {
    plateInput,
    setPlateInput,
    loading,
    error,
    vehicleData,
    upiConfig,
    onSubmit: handleSubmit,
  };

  return <Dashboard {...sharedProps} />;
};

export default UserParkingInfo;






