/**
 * ZoneMapPage.jsx
 * -------------------
 * Full-page visualization of Urban OS 'Zone Map' with hover telemetry.
 */
import { useState } from 'react';
import useDashboardData from '../hooks/useDashboardData';
import Sidebar from './dashboard/Sidebar';
import Topbar from './dashboard/Topbar';
import { logoutAdmin } from '../services/firebaseService';
import './ZoneMapPage.css';

const ZoneRow = ({ prefix, count, occupiedSlots, vehiclesInZone, hoveredSlot, setHoveredSlot }) => {
    return (
        <div className="pf-map-line">
            <h3 className="pf-map-row-title">Row {prefix}</h3>
            <div className="pf-slot-track">
                {Array.from({ length: count }, (_, i) => {
                    const isOccupied = occupiedSlots.includes(i);
                    const label = `${prefix}${String(i + 1).padStart(2, '0')}`;
                    // Just take a vehicle deterministically for the occupied slot
                    const vehicleMatch = isOccupied ? vehiclesInZone[i % vehiclesInZone.length] : null;

                    return (
                        <div
                            key={i}
                            className={`pf-big-slot ${isOccupied ? 'pf-big-slot-occ' : 'pf-big-slot-avail'}`}
                            onMouseEnter={() => setHoveredSlot({
                                id: label, 
                                isOccupied, 
                                vehicle: vehicleMatch
                            })}
                            onMouseLeave={() => setHoveredSlot(null)}
                        >
                            <span className="pf-slot-id">{label}</span>
                            {isOccupied && <span className="pf-slot-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ZoneMapPage = ({ user }) => {
    const { visibleData, searchTerm, setSearchTerm, dateFilter, setDateFilter } = useDashboardData();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [hoveredSlot, setHoveredSlot] = useState(null);

    const adminName = user?.email?.split('@')[0] || 'Admin';

    // Get parked vehicles for simulated slot mapping
    const parkedVehicles = visibleData.filter(v => v.status === 'Parked' || v._status === 'parked');
    const zoneAVehicles = parkedVehicles.filter(v => typeof v.zone === 'string' && v.zone.includes('A'));
    const zoneBVehicles = parkedVehicles.filter(v => typeof v.zone === 'string' && v.zone.includes('B'));
    const zoneCVehicles = parkedVehicles.filter(v => typeof v.zone === 'string' && v.zone.includes('C'));

    // Dynamic occupation sets (up to the number of vehicles in zone)
    const occA = zoneAVehicles.map((_, i) => i * 2); // Simulated mapping
    const occB = zoneBVehicles.map((_, i) => i * 2 + 1);
    const occC = zoneCVehicles.map((_, i) => i * 3);

    return (
        <div className="pf-root" style={{ fontFamily: "'Space Grotesk', sans-serif", background: '#0a0a0a', color: '#e7e2d9' }}>
            <Sidebar
                adminName={adminName}
                onLogout={logoutAdmin}
                activePage="map"
                isMobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <main className="pf-main">
                <Topbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onOpenEntry={() => {}}
                    onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                />

                <div className="pf-body">
                    <header className="pf-map-page-header">
                        <div>
                            <h1 className="pf-page-title">Zone Visualization</h1>
                            <p className="pf-page-subtitle">Live Urban OS infrastructure monitoring</p>
                        </div>
                        <div className="pf-map-legend-pills">
                            <span className="pf-legend-chip pf-avail-chip"><span className="pf-chip-dot"></span> Available</span>
                            <span className="pf-legend-chip pf-occ-chip"><span className="pf-chip-dot"></span> Occupied</span>
                        </div>
                    </header>

                    <div className="pf-map-canvas">
                        <ZoneRow prefix="A" count={12} occupiedSlots={occA.length ? occA : [1,4,5,8]} vehiclesInZone={zoneAVehicles} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot} />
                        <ZoneRow prefix="B" count={12} occupiedSlots={occB.length ? occB : [0,2,6,7,9]} vehiclesInZone={zoneBVehicles} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot} />
                        <ZoneRow prefix="C" count={12} occupiedSlots={occC.length ? occC : [3,5,6]} vehiclesInZone={zoneCVehicles} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot} />

                        {/* Floating Glassmorphic Telemetry Panel */}
                        {hoveredSlot && (
                            <div className="pf-glass-telemetry">
                                <div className="pf-telemetry-header">
                                    <span className="pf-label-sm">SENSOR FEED</span>
                                    {hoveredSlot.isOccupied ? (
                                        <span className="pf-status-pulse pf-pulse-yellow"></span>
                                    ) : (
                                        <span className="pf-status-pulse pf-pulse-dark"></span>
                                    )}
                                </div>
                                <h2 className="pf-telemetry-slot">{hoveredSlot.id}</h2>
                                <h3 className="pf-telemetry-state" style={{ color: hoveredSlot.isOccupied ? '#f5c518' : '#e7e2d9' }}>
                                    {hoveredSlot.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                                </h3>
                                
                                {hoveredSlot.isOccupied && hoveredSlot.vehicle && (
                                    <div className="pf-telemetry-data">
                                        <div className="pf-t-row">
                                            <span className="pf-t-label">PLATE</span>
                                            <span className="pf-t-val">{hoveredSlot.vehicle.plate || 'UNKNOWN'}</span>
                                        </div>
                                        <div className="pf-t-row">
                                            <span className="pf-t-label">ENTRY</span>
                                            <span className="pf-t-val">
                                                {hoveredSlot.vehicle.timestamp 
                                                    ? new Date(hoveredSlot.vehicle.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                                    : '--:--'}
                                            </span>
                                        </div>
                                        <div className="pf-t-row">
                                            <span className="pf-t-label">CLASS</span>
                                            <span className="pf-t-val">{hoveredSlot.vehicle.vehicle_type || 'Car'}</span>
                                        </div>
                                    </div>
                                )}
                                {!hoveredSlot.isOccupied && (
                                    <div className="pf-telemetry-data">
                                        <p className="pf-t-empty-msg">Stall is clear. Arrays nominal.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ZoneMapPage;
