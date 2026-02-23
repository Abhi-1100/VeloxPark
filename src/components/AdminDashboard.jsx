/**
 * AdminDashboard.jsx  (refactored)
 * ---------------------------------
 * Pure layout orchestrator.  All business logic, Firebase operations, and
 * heavy JSX blocks have been extracted into dedicated files:
 *
 *   hooks/useDashboardData.js   — state, Firebase subscription, filter logic
 *   hooks/useExportPDF.js       — PDF export handler
 *   services/firebaseService.js — Firebase read operations + logout
 *   components/dashboard/
 *     Sidebar.jsx               — slim sidebar navigation
 *     Topbar.jsx                — sticky top command bar
 *     StatCards.jsx             — four KPI stat cards
 *     ZoneMap.jsx               — parking slot visualisation
 *     TrafficPanel.jsx          — traffic chart + trend bars
 *     VehicleTable.jsx          — vehicle records table
 *     DashboardFooter.jsx       — footer bar
 *
 * This file now only:
 *   1. Calls hooks to get data and handlers
 *   2. Derives simple display values
 *   3. Assembles the page layout from imported components
 */

import useDashboardData from '../hooks/useDashboardData';
import useExportPDF from '../hooks/useExportPDF';
import { logoutAdmin } from '../services/firebaseService';
import { useState } from 'react';

import ManualEntryModal from './dashboard/ManualEntryModal';

import Sidebar from './dashboard/Sidebar';
import Topbar from './dashboard/Topbar';
import StatCards from './dashboard/StatCards';
import ZoneMap from './dashboard/ZoneMap';
import TrafficPanel from './dashboard/TrafficPanel';
import VehicleTable from './dashboard/VehicleTable';
import DashboardFooter from './dashboard/DashboardFooter';

import './AdminDashboard.css';

// ─── AdminDashboard ────────────────────────────────────────────────────────────
const AdminDashboard = ({ user }) => {
    // ── Data & filters (all logic lives in the hook) ───────────────────────────
    const {
        visibleData,
        loading,
        stats,
        searchTerm, setSearchTerm,
        dateFilter, setDateFilter,
        statusFilter, setStatusFilter,
    } = useDashboardData();

    // ── PDF export handler ─────────────────────────────────────────────────────
    const { handleExportPDF } = useExportPDF({ visibleData, dateFilter });

    // ── Modal state ────────────────────────────────────────────────────────────
    const [entryModalOpen, setEntryModalOpen] = useState(false);

    // ── Derived display values ─────────────────────────────────────────────────
    const adminName = user?.email?.split('@')[0] || 'Admin';
    const occupancyPct = stats.total > 0
        ? Math.round((stats.parked / stats.total) * 100)
        : 0;

    // ── Layout ─────────────────────────────────────────────────────────────────
    return (
        <div
            className="pf-root"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: '#0a0a0a', color: '#f1f5f9' }}
        >
            {/* Manual entry modal — overlays everything */}
            <ManualEntryModal
                isOpen={entryModalOpen}
                onClose={() => setEntryModalOpen(false)}
            />

            {/* Slim sidebar */}
            <Sidebar adminName={adminName} onLogout={logoutAdmin} activePage="dashboard" />

            {/* Main content area */}
            <main className="pf-main">

                {/* Sticky top bar */}
                <Topbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onOpenEntry={() => setEntryModalOpen(true)}
                />

                {/* Page body — natural scroll */}
                <div className="pf-body">

                    {/* Status filter + record count */}
                    <div className="pf-filter-row">
                        <div className="pf-filter-pills">
                            {['All', 'Parked', 'Exited'].map((f) => (
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

                    {/* KPI stat cards */}
                    <StatCards stats={stats} />

                    {/* Zone Map + Traffic Panel */}
                    <div className="pf-mid-grid">
                        <ZoneMap />
                        <TrafficPanel
                            occupancyPct={occupancyPct}
                            onExportPDF={handleExportPDF}
                        />
                    </div>

                    {/* Vehicle records table */}
                    <VehicleTable
                        visibleData={visibleData}
                        loading={loading}
                        stats={stats}
                        dateFilter={dateFilter}
                        onExportPDF={handleExportPDF}
                    />

                    {/* Footer */}
                    <DashboardFooter />

                </div>{/* /pf-body */}
            </main>
        </div>
    );
};

export default AdminDashboard;
