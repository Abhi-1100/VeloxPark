import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
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
        upiName: 'Smart Parking System'
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

    const searchVehicle = async (plate) => {
        const numberplateRef = ref(database, 'numberplate');

        return new Promise((resolve, reject) => {
            onValue(numberplateRef, (snapshot) => {
                const data = snapshot.val();

                if (!data) {
                    resolve(null);
                    return;
                }

                // Find all entries for this plate
                const entries = [];
                Object.keys(data).forEach(key => {
                    const entry = data[key];
                    if (entry.number_plate === plate && entry.number_plate !== 'NULL') {
                        entries.push({
                            id: key,
                            plate: entry.number_plate,
                            timestamp: entry.date_time
                        });
                    }
                });

                if (entries.length === 0) {
                    resolve(null);
                    return;
                }

                // Sort by timestamp
                entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                // Determine entry/exit
                let vehicleInfo = {
                    plate: plate,
                    entry: entries[0].timestamp,
                    exit: null,
                    status: 'Parked'
                };

                // If there are 2 or more entries, the second one is exit
                if (entries.length >= 2) {
                    vehicleInfo.exit = entries[1].timestamp;
                    vehicleInfo.status = 'Exited';

                    // Calculate duration and amount
                    const dur = calculateDuration(vehicleInfo.entry, vehicleInfo.exit);
                    vehicleInfo.duration = dur;
                    vehicleInfo.amount = calculateAmount(dur);
                }

                resolve(vehicleInfo);
            }, (error) => {
                reject(error);
            });
        });
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
                    <h1 className="user-logo">Smart Parking</h1>
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
