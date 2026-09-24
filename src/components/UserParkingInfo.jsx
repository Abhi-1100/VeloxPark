import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import {
  calculateDuration,
  calculateAmount,
  generateUPILink,
} from '../utils/parkingUtils';
import Dashboard from '../pages/user/Dashboard';
import UserParkingInfoDesktop from './user/UserParkingInfoDesktop';

const UserParkingInfo = () => {
  const navigate = useNavigate();

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
    Object.keys(data).forEach((key) => {
      const entry = data[key];
      const entryPlate = entry.number_plate || entry.plate || '';
      if (entryPlate === plate && entryPlate !== 'NULL') {
        const ts = entry.date_time || entry.inTime || entry.timestamp;
        if (ts) scans.push({ id: key, plate: entryPlate, timestamp: ts });
      }
    });
    if (scans.length === 0) return null;

    // Sort all scans ascending (oldest -> newest)
    scans.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const lastIdx = scans.length - 1;
    const isOddCount = scans.length % 2 !== 0;

    // If odd number of scans, vehicle is still parked
    if (isOddCount) {
      return { plate, entry: scans[lastIdx].timestamp, exit: null, status: 'Parked' };
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
    const plate = plateInput.trim().toUpperCase();
    if (!plate) return;
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

  const handlePayNow = () => {
    const upiLink = generateUPILink(
      upiConfig.upiId,
      upiConfig.upiName,
      vehicleData?.amount || 0,
      vehicleData?.plate || ''
    );
    navigate('/user/payment', { state: { vehicleData, upiConfig, upiLink } });
  };

  const sharedProps = {
    plateInput,
    setPlateInput,
    loading,
    error,
    vehicleData,
    upiConfig,
    onSubmit: handleSubmit,
    onPayNow: handlePayNow,
  };

  return (
    <>
      {/* Mobile Dashboard (< 1024px) */}
      <div className="block lg:hidden">
        <Dashboard />
      </div>

      {/* Desktop Dashboard (>= 1024px) */}
      <div className="hidden lg:block">
        <UserParkingInfoDesktop {...sharedProps} />
      </div>
    </>
  );
};

export default UserParkingInfo;
