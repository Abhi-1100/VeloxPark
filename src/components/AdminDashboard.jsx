import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { auth, database } from '../config/firebase';
import {
    processParkingData,
    formatDateTime,
    formatDuration,
    isSameDate,
    getTodayDateStr
} from '../utils/parkingUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminDashboard.css';

// ─── AdminDashboard ────────────────────────────────────────────────────────────
const AdminDashboard = ({ user }) => {
    // ── State (unchanged) ──────────────────────────────────────────────────────
    const [parkingData, setParkingData] = useState([]);
    const [processedData, setProcessedData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(getTodayDateStr());
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        parked: 0,
        exited: 0,
        revenue: 0
    });

    // ── Load parking data from Firebase (unchanged) ────────────────────────────
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

        return () => { off(numberplateRef); };
    }, []);

    // ── Apply filters and update visible data (unchanged) ──────────────────────
    useEffect(() => {
        let filtered = processedData;

        if (dateFilter) {
            filtered = filtered.filter(v =>
                isSameDate(v.entry, dateFilter) || isSameDate(v.exit, dateFilter)
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(v =>
                v.plate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter(v => v.status === statusFilter);
        }

        setVisibleData(filtered);

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

        setStats({ total: filtered.length, parked, exited, revenue });
    }, [processedData, searchTerm, dateFilter, statusFilter]);

    // ── Handlers (unchanged) ───────────────────────────────────────────────────
    const handleLogout = () => { signOut(auth); };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            // Title
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.text('Smart Parking - Vehicle Records Report', 14, 18);

            // Subtitle
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

            if (dateFilter) {
                const label = new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
                doc.text(`Date Filter: ${label}`, 14, 32);
            }

            // Table data — use "Rs." instead of "₹" to avoid font encoding issues
            const tableData = visibleData.map(v => [
                v.plate,
                formatDateTime(v.entry),
                v.exit ? formatDateTime(v.exit) : '-',
                formatDuration(v.duration),
                `Rs. ${v.amount || 0}`,
                v.status
            ]);

            // jspdf-autotable v5: call autoTable(doc, options) — NOT doc.autoTable()
            autoTable(doc, {
                startY: dateFilter ? 38 : 32,
                head: [['Plate Number', 'Entry Time', 'Exit Time', 'Duration', 'Amount', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [249, 208, 6],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 10,
                    halign: 'center'
                },
                bodyStyles: {
                    textColor: [30, 30, 30],
                    fontSize: 9,
                    fillColor: [255, 255, 255]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { fontStyle: 'bold' },
                    5: { halign: 'center' }
                },
                didDrawPage: (data) => {
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(
                        `Page ${data.pageNumber}  |  Smart Parking System`,
                        pageWidth / 2,
                        pageHeight - 8,
                        { align: 'center' }
                    );
                }
            });

            doc.save(`parking-report-${Date.now()}.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert(`PDF generation failed: ${error.message}`);
        }
    };

    // ── Derived display values ─────────────────────────────────────────────────
    const adminName = user?.email?.split('@')[0] || 'Admin';
    const occupancyPct = stats.total > 0 ? Math.round((stats.parked / stats.total) * 100) : 0;

    // ── JSX ────────────────────────────────────────────────────────────────────
    return (
        <div
            className="pf-root"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: '#0a0a0a', color: '#f1f5f9' }}
        >
            {/* ── Slim Sidebar ─────────────────────────────────────────────── */}
            <aside className="pf-sidebar group/sidebar">
                {/* Logo */}
                <div className="pf-sidebar-logo">
                    <div className="pf-logo-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 700 }}>local_parking</span>
                    </div>
                    <span className="pf-sidebar-label pf-logo-text">ParkFlow</span>
                </div>

                {/* Nav */}
                <nav className="pf-nav">
                    <a href="#" className="pf-nav-item pf-nav-active">
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined pf-glow-icon">dashboard</span>
                        </div>
                        <span className="pf-sidebar-label">Dashboard</span>
                        <div className="pf-active-bar" />
                    </a>
                    <a href="#" className="pf-nav-item pf-nav-inactive">
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <span className="pf-sidebar-label">Analytics</span>
                    </a>
                    <a href="#" className="pf-nav-item pf-nav-inactive">
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined">map</span>
                        </div>
                        <span className="pf-sidebar-label">Zone Map</span>
                    </a>
                    <a href="#" className="pf-nav-item pf-nav-inactive">
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="pf-sidebar-label">Users</span>
                    </a>
                    <a href="#" className="pf-nav-item pf-nav-inactive">
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                        <span className="pf-sidebar-label">Settings</span>
                    </a>
                </nav>

                {/* Bottom section */}
                <div className="pf-sidebar-bottom">
                    <div className="pf-nav-item pf-nav-inactive" style={{ cursor: 'default' }}>
                        <div className="pf-nav-icon-wrap">
                            <span className="pf-online-dot" />
                        </div>
                        <span className="pf-sidebar-label pf-online-text">Systems Online</span>
                    </div>
                    <div className="pf-nav-item" style={{ overflow: 'hidden' }}>
                        <div className="pf-nav-icon-wrap">
                            <div className="pf-avatar">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f9d006' }}>manage_accounts</span>
                            </div>
                        </div>
                        <div className="pf-sidebar-label pf-user-info">
                            <p className="pf-user-name">{adminName}</p>
                            <p className="pf-user-role">Lead Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="pf-nav-item pf-nav-inactive pf-logout-btn" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div className="pf-nav-icon-wrap">
                            <span className="material-symbols-outlined">logout</span>
                        </div>
                        <span className="pf-sidebar-label">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="pf-main">

                {/* ── Sticky Top Bar ───────────────────────────────────────── */}
                <div className="pf-topbar">
                    <div className="pf-brand-pill">
                        <span className="pf-brand-name">ParkFlow</span>
                        <span className="pf-brand-dot" />
                        <span className="pf-brand-version">Enterprise v2.0</span>
                    </div>
                    <div className="pf-command-bar">
                        <span className="material-symbols-outlined pf-cmd-icon">terminal</span>
                        <input
                            type="text"
                            className="pf-cmd-input"
                            placeholder="Search by plate number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="pf-cmd-right">
                            <kbd className="pf-kbd">⌘K</kbd>
                            <div className="pf-cmd-divider" />
                            <button className="pf-icon-btn">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                            </button>
                        </div>
                    </div>
                    <div className="pf-topbar-right">
                        <input
                            type="date"
                            className="pf-date-input"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            title="Filter by date"
                        />
                        <button className="pf-new-entry-btn">NEW ENTRY</button>
                    </div>
                </div>

                {/* ── Page body — natural scroll ────────────────────────────── */}
                <div className="pf-body">

                    {/* Status filter + record count */}
                    <div className="pf-filter-row">
                        <div className="pf-filter-pills">
                            {['All', 'Parked', 'Exited'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`pf-filter-pill ${statusFilter === f ? 'pf-filter-pill-active' : ''}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <span className="pf-record-count">
                            {visibleData.length} record{visibleData.length !== 1 ? 's' : ''} found
                        </span>
                    </div>

                    {/* Stat Cards */}
                    <div className="pf-stats-grid">
                        <div className="pf-stat-card">
                            <div className="pf-stat-header">
                                <span className="material-symbols-outlined pf-stat-icon">directions_car</span>
                                <span className="pf-stat-badge pf-badge-green">+12%</span>
                            </div>
                            <p className="pf-stat-label">Total Vehicles</p>
                            <h3 className="pf-stat-value">{stats.total}</h3>
                        </div>
                        <div className="pf-stat-card">
                            <div className="pf-stat-header">
                                <span className="material-symbols-outlined pf-stat-icon">local_parking</span>
                                <span className="pf-stat-badge pf-badge-green">LIVE</span>
                            </div>
                            <p className="pf-stat-label">Currently Parked</p>
                            <h3 className="pf-stat-value">
                                {stats.parked}<span className="pf-stat-sub"> / {stats.total}</span>
                            </h3>
                        </div>
                        <div className="pf-stat-card">
                            <div className="pf-stat-header">
                                <span className="material-symbols-outlined pf-stat-icon">timer</span>
                                <span className="pf-stat-badge pf-badge-neutral">STABLE</span>
                            </div>
                            <p className="pf-stat-label">Total Exited</p>
                            <h3 className="pf-stat-value">{stats.exited}</h3>
                        </div>
                        <div className="pf-stat-card">
                            <div className="pf-stat-header">
                                <span className="material-symbols-outlined pf-stat-icon">payments</span>
                                <span className="pf-stat-badge pf-badge-green">TODAY</span>
                            </div>
                            <p className="pf-stat-label">Today's Revenue</p>
                            <h3 className="pf-stat-value">₹{stats.revenue}<span className="pf-stat-sub"> INR</span></h3>
                        </div>
                    </div>

                    {/* Zone Map + Traffic Panel */}
                    <div className="pf-mid-grid">
                        <div className="pf-zone-card">
                            <div className="pf-zone-header">
                                <div>
                                    <h2 className="pf-section-title">Zone Alpha Map</h2>
                                    <p className="pf-section-sub">Real-time slot visualization</p>
                                </div>
                                <div className="pf-zone-legend">
                                    <span className="pf-legend-item pf-legend-avail">
                                        <span className="pf-legend-dot pf-dot-avail" /> Available
                                    </span>
                                    <span className="pf-legend-item pf-legend-occ">
                                        <span className="pf-legend-dot pf-dot-occ" /> Occupied
                                    </span>
                                </div>
                            </div>
                            <div className="pf-zone-body">
                                <ZoneRow prefix="A" count={10} occupied={[1, 2, 5, 6, 7]} />
                                <div className="pf-zone-divider" />
                                <ZoneRow prefix="B" count={10} occupied={[0, 3, 4, 5, 8, 9]} />
                                <div className="pf-zone-divider" />
                                <ZoneRow prefix="C" count={10} occupied={[2, 3, 4, 5, 6, 7, 8]} />
                            </div>
                        </div>

                        <div className="pf-traffic-card">
                            <div>
                                <div className="pf-traffic-header">
                                    <h2 className="pf-section-title">Traffic Flow</h2>
                                    <span className="pf-live-badge">Live</span>
                                </div>
                                <TrafficChart />
                                <div className="pf-chart-labels">
                                    <span>08:00</span><span>16:00</span><span>23:00</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="pf-section-title" style={{ marginBottom: '20px' }}>Peak Trends</h2>
                                <div className="pf-trends">
                                    <TrendBar label="Mon – Wed" pct={88} />
                                    <TrendBar label="Thu – Fri" pct={94} />
                                    <TrendBar label="Weekends" pct={42} />
                                </div>
                            </div>
                            <div>
                                <h2 className="pf-section-title" style={{ marginBottom: '12px' }}>Live Occupancy</h2>
                                <TrendBar label="Current" pct={occupancyPct} />
                            </div>
                            <button onClick={handleExportPDF} className="pf-export-btn">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                                Export Full Report
                            </button>
                        </div>
                    </div>

                    {/* Vehicle Records Table */}
                    <div className="pf-records-card">
                        <div className="pf-records-header">
                            <div className="pf-records-title-group">
                                <span className="material-symbols-outlined pf-records-icon">table_rows</span>
                                <div>
                                    <h2 className="pf-section-title">
                                        Vehicle Records
                                        {dateFilter && (
                                            <span className="pf-date-chip">
                                                {new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        )}
                                    </h2>
                                    <p className="pf-section-sub">
                                        {visibleData.length} record{visibleData.length !== 1 ? 's' : ''}&nbsp;·&nbsp;
                                        {stats.parked} parked&nbsp;·&nbsp;{stats.exited} exited
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleExportPDF} className="pf-export-inline-btn">
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                                Export PDF
                            </button>
                        </div>

                        <div className="pf-records-wrap">
                            {loading ? (
                                <div className="pf-empty-state">
                                    <span className="material-symbols-outlined pf-empty-icon pf-spin">refresh</span>
                                    <p>Loading parking data...</p>
                                </div>
                            ) : visibleData.length > 0 ? (
                                <table className="pf-records-table">
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
                                            <tr key={index} className="pf-rec-row">
                                                <td><span className="pf-rec-plate">{vehicle.plate}</span></td>
                                                <td className="pf-rec-time">{formatDateTime(vehicle.entry)}</td>
                                                <td className="pf-rec-time">
                                                    {vehicle.exit ? formatDateTime(vehicle.exit) : <span className="pf-rec-dash">—</span>}
                                                </td>
                                                <td className="pf-rec-time">{formatDuration(vehicle.duration)}</td>
                                                <td className="pf-rec-amount">₹{vehicle.amount || 0}</td>
                                                <td>
                                                    <span className={`pf-rec-badge ${vehicle.status === 'Parked' ? 'pf-rec-parked' : 'pf-rec-exited'}`}>
                                                        {vehicle.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="pf-empty-state">
                                    <span className="material-symbols-outlined pf-empty-icon">search_off</span>
                                    <p>No records for this date / filter</p>
                                    <p className="pf-empty-sub">Try a different date or clear the status filter</p>
                                </div>
                            )}
                        </div>
                    </div>{/* /pf-records-card */}

                    {/* ── Footer ───────────────────────────────────────────── */}
                    <footer className="pf-footer">
                        <div className="pf-footer-inner">
                            <div className="pf-footer-copy">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>copyright</span>
                                <span>2026 ParkPortal Systems Inc.</span>
                            </div>
                            <div className="pf-footer-links">
                                <a href="#" className="pf-footer-link">TERMS</a>
                                <a href="#" className="pf-footer-link">PRIVACY</a>
                                <a href="#" className="pf-footer-link">COOKIES</a>
                            </div>
                        </div>
                    </footer>

                </div>{/* /pf-body */}
            </main>
        </div>
    );
};

// ─── Sub-components (UI only, no logic) ───────────────────────────────────────

/** Renders one row of parking slots */
const ZoneRow = ({ prefix, count, occupied }) => (
    <div className="pf-slot-row">
        {Array.from({ length: count }, (_, i) => {
            const isOccupied = occupied.includes(i);
            const label = `${prefix}${String(i + 1).padStart(2, '0')}`;
            return (
                <div key={i} className={`pf-slot ${isOccupied ? 'pf-slot-occ' : 'pf-slot-avail'}`}>
                    {!isOccupied && <span className="pf-slot-label">{label}</span>}
                </div>
            );
        })}
    </div>
);

/** Simple bar chart for traffic flow */
const TrafficChart = () => {
    const bars = [30, 45, 75, 95, 60, 50, 85];
    return (
        <div className="pf-chart">
            {bars.map((h, i) => (
                <div key={i} className="pf-chart-bar-wrap" style={{ height: `${h}%` }}>
                    <div className="pf-chart-bar" />
                </div>
            ))}
        </div>
    );
};

/** Horizontal progress bar for peak trends */
const TrendBar = ({ label, pct }) => (
    <div className="pf-trend-item">
        <div className="pf-trend-labels">
            <span>{label}</span>
            <span className="pf-trend-pct">{pct}% Capacity</span>
        </div>
        <div className="pf-trend-track">
            <div className="pf-trend-fill" style={{ width: `${pct}%` }} />
        </div>
    </div>
);

export default AdminDashboard;
