import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import {
    calculateDuration,
    calculateAmount,
    formatDateTime,
    formatDuration,
    generateUPILink
} from '../utils/parkingUtils';
import { QRCodeSVG } from 'qrcode.react';
import './UserPanel.css';

const UserPanel = () => {
    const [plateInput, setPlateInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vehicleData, setVehicleData] = useState(null);
    const [upiConfig, setUpiConfig] = useState({
        upiId: 'parking@upi',
        upiName: 'VeloxPark'
    });

    // Load UPI config
    useEffect(() => {
        fetch('/config.json')
            .then(res => res.json())
            .then(cfg => {
                if (cfg.upiId) setUpiConfig(prev => ({ ...prev, upiId: cfg.upiId }));
                if (cfg.upiName) setUpiConfig(prev => ({ ...prev, upiName: cfg.upiName }));
            })
            .catch(() => {
                // Use defaults
            });
    }, []);

    /** Parse raw numberplate data object and find the most recent session for a plate. */
    const findVehicleInData = (data, plate) => {
        if (!data) return null;
        const scans = [];
        Object.keys(data).forEach(key => {
            const entry = data[key];
            const entryPlate = entry.number_plate || entry.plate || '';
            if (entryPlate === plate && entryPlate !== 'NULL') {
                const ts = entry.date_time || entry.inTime || entry.timestamp;
                if (ts) scans.push({ id: key, plate: entryPlate, timestamp: ts });
            }
        });
        if (scans.length === 0) return null;
        scans.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const lastIdx = scans.length - 1;
        const isOddCount = scans.length % 2 !== 0;
        if (isOddCount) {
            return { plate, entry: scans[lastIdx].timestamp, exit: null, status: 'Parked' };
        }
        const sessionEntry = scans[lastIdx - 1].timestamp;
        const sessionExit  = scans[lastIdx].timestamp;
        const dur = calculateDuration(sessionEntry, sessionExit);
        return { plate, entry: sessionEntry, exit: sessionExit, status: 'Exited', duration: dur, amount: calculateAmount(dur) };
    };

    const searchVehicle = async (plate) => {
        // Try Firebase first
        try {
            const numberplateRef = ref(database, 'numberplate');
            const snapshot = await get(numberplateRef);
            return findVehicleInData(snapshot.val(), plate);
        } catch (firebaseErr) {
            console.warn('[UserPanel] Firebase read failed, using local fallback:', firebaseErr.code);
        }
        // Local JSON fallback
        try {
            const res = await fetch('/numberplate.json');
            const data = await res.json();
            return findVehicleInData(data, plate);
        } catch (localErr) {
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

            if (data) {
                setVehicleData(data);
            } else {
                setError('Vehicle not found. Please check the number plate and try again.');
            }
        } catch (err) {
            setError('Error fetching data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="background-grid"></div>
            <div className="user-container">
                {/* Header */}
                <div className="user-header">
                    <h1 className="user-logo">VeloxPark</h1>
                    <p className="tagline">Check Your Parking Status</p>
                </div>

                {/* Search Section */}
                <div className="search-section">
                    <h2 className="search-title">Enter Your Vehicle Number</h2>
                    <form className="search-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="e.g., TS15EL5671"
                            value={plateInput}
                            onChange={(e) => setPlateInput(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="submit" className="btn btn-search" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {/* Loading */}
                {loading && <div className="loading">Searching...</div>}

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Result Section */}
                {vehicleData && (
                    <div className="result-section">
                        {/* Vehicle Info Card */}
                        <div className="info-card">
                            <div className="plate-display">{vehicleData.plate}</div>

                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">Entry Time</div>
                                    <div className="info-value">{formatDateTime(vehicleData.entry)}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Exit Time</div>
                                    <div className="info-value">
                                        {vehicleData.exit ? formatDateTime(vehicleData.exit) : '-'}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Duration</div>
                                    <div className="info-value">{formatDuration(vehicleData.duration)}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">Status</div>
                                    <div className="info-value">
                                        <span className={`status-badge ${vehicleData.status === 'Parked' ? 'status-parked' : 'status-exited'}`}>
                                            {vehicleData.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alert for Parked Vehicles */}
                        {vehicleData.status === 'Parked' && (
                            <div className="alert">
                                Your vehicle is currently parked. Amount will be calculated upon exit.
                            </div>
                        )}

                        {/* Payment Section */}
                        {vehicleData.status === 'Exited' && (
                            <div className="payment-section">
                                <h3 className="payment-title">Total Payable Amount</h3>
                                <div className="amount-display">
                                    ₹<span>{vehicleData.amount || 0}</span>
                                </div>

                                <div className="qr-container">
                                    {vehicleData.amount > 0 ? (
                                        <QRCodeSVG
                                            value={generateUPILink(
                                                upiConfig.upiId,
                                                upiConfig.upiName,
                                                vehicleData.amount,
                                                vehicleData.plate
                                            )}
                                            size={200}
                                            level="H"
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                        />
                                    ) : (
                                        <p style={{ color: '#666', padding: '20px' }}>No payment required</p>
                                    )}
                                </div>

                                <div className="payment-info">
                                    Scan the QR code to pay via UPI<br />
                                    <strong>First 30 minutes FREE</strong><br />
                                    ₹20 per hour thereafter
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default UserPanel;
