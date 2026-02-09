import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { auth, database } from '../config/firebase';
import {
    processParkingData,
    formatDateTime,
    formatDuration,
    isSameDate,
    getTodayDateStr,
    parseToDate
} from '../utils/parkingUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
    const [parkingData, setParkingData] = useState([]);
    const [processedData, setProcessedData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(getTodayDateStr());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        parked: 0,
        exited: 0,
        revenue: 0
    });

    // Load parking data from Firebase
    useEffect(() => {
        const numberplateRef = ref(database, 'numberplate');

        const loadData = (snapshot) => {
            const val = snapshot.val();
            const rawData = [];

            if (val) {
                Object.keys(val).forEach(key => {
                    const entry = val[key];
                    const plateVal = entry.number_plate || entry.numberPlate || entry.plate || '';
                    if (plateVal && plateVal !== 'NULL') {
                        rawData.push({
                            id: key,
                            plate: plateVal,
                            timestamp: entry.date_time || entry.dateTime || entry.timestamp || entry.time
                        });
                    }
                });
            }

            setParkingData(rawData);
            const processed = processParkingData(rawData);
            setProcessedData(processed);
            setLoading(false);
        };

        // Try to load from Firebase
        onValue(numberplateRef, loadData, (error) => {
            console.error('Firebase error:', error);
            // Fallback to local JSON
            fetch('/numberplate.json')
                .then(res => res.json())
                .then(json => {
                    const rawData = [];
                    if (Array.isArray(json)) {
                        json.forEach((item, idx) => {
                            const plateVal = item.number_plate || item.numberPlate || item.plate || '';
                            if (plateVal && plateVal !== 'NULL') {
                                rawData.push({
                                    id: 'local_' + idx,
                                    plate: plateVal,
                                    timestamp: item.date_time || item.dateTime || item.timestamp || item.time
                                });
                            }
                        });
                    } else {
                        Object.keys(json).forEach(key => {
                            const entry = json[key];
                            const plateVal = entry.number_plate || entry.numberPlate || entry.plate || '';
                            if (plateVal && plateVal !== 'NULL') {
                                rawData.push({
                                    id: key,
                                    plate: plateVal,
                                    timestamp: entry.date_time || entry.dateTime || entry.timestamp || entry.time
                                });
                            }
                        });
                    }
                    setParkingData(rawData);
                    const processed = processParkingData(rawData);
                    setProcessedData(processed);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load local data:', err);
                    setLoading(false);
                });
        });

        return () => {
            off(numberplateRef);
        };
    }, []);

    // Apply filters and update visible data
    useEffect(() => {
        let filtered = processedData;

        // Apply date filter
        if (dateFilter) {
            filtered = filtered.filter(v =>
                isSameDate(v.entry, dateFilter) || isSameDate(v.exit, dateFilter)
            );
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(v =>
                v.plate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setVisibleData(filtered);

        // Update statistics
        const parked = filtered.filter(v => v.status === 'Parked').length;
        const exited = filtered.filter(v => v.status === 'Exited').length;

        let revenue = 0;
        if (dateFilter) {
            revenue = filtered
                .filter(v => v.exit && isSameDate(v.exit, dateFilter))
                .reduce((sum, v) => sum + (v.amount || 0), 0);
        } else {
            const today = getTodayDateStr();
            revenue = processedData
                .filter(v => v.exit && isSameDate(v.exit, today))
                .reduce((sum, v) => sum + (v.amount || 0), 0);
        }

        setStats({
            total: filtered.length,
            parked,
            exited,
            revenue
        });
    }, [processedData, searchTerm, dateFilter]);

    const handleLogout = () => {
        signOut(auth);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text('Smart Parking System', 14, 20);

        doc.setFontSize(12);
        doc.text('Parking Records Report', 14, 28);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

        // Prepare table data
        const tableData = visibleData.map(v => [
            v.plate,
            formatDateTime(v.entry),
            v.exit ? formatDateTime(v.exit) : '-',
            formatDuration(v.duration),
            `₹${v.amount || 0}`,
            v.status
        ]);

        // Add table
        doc.autoTable({
            startY: 45,
            head: [['Plate', 'Entry', 'Exit', 'Duration', 'Amount', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] },
            styles: { fontSize: 8 }
        });

        // Save PDF
        doc.save(`parking-report-${Date.now()}.pdf`);
    };

    const clearDateFilter = () => {
        setDateFilter('');
        setSearchTerm('');
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="header">
                <div className="logo">Smart Parking</div>
                <div className="user-info">
                    <span className="user-name">{user?.email?.split('@')[0] || 'Admin'}</span>
                    <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="container">
                {/* Statistics */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Vehicles</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Currently Parked</div>
                        <div className="stat-value">{stats.parked}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Exited</div>
                        <div className="stat-value">{stats.exited}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Today's Revenue</div>
                        <div className="stat-value">₹{stats.revenue}</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by plate number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="date-box">
                        <input
                            type="date"
                            className="form-input"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            title="Filter by date"
                        />
                        <button className="btn" onClick={clearDateFilter} title="Show all dates">
                            All
                        </button>
                    </div>

                    <button className="btn btn-export" onClick={handleExportPDF}>
                        Export PDF
                    </button>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading">Loading parking data...</div>
                    ) : visibleData.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Plate Number</th>
                                    <th>Entry Time</th>
                                    <th>Exit Time</th>
                                    <th>Duration</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleData.map((vehicle, index) => (
                                    <tr key={index}>
                                        <td><strong>{vehicle.plate}</strong></td>
                                        <td>{formatDateTime(vehicle.entry)}</td>
                                        <td>{vehicle.exit ? formatDateTime(vehicle.exit) : '-'}</td>
                                        <td>{formatDuration(vehicle.duration)}</td>
                                        <td><strong>₹{vehicle.amount || 0}</strong></td>
                                        <td>
                                            <span className={`status-badge ${vehicle.status === 'Parked' ? 'status-parked' : 'status-exited'}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No parking records found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
