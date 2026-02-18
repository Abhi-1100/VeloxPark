/**
 * AnalyticsDashboard.jsx
 * ----------------------
 * Main orchestrator for the Analytics page.
 * Mirrors the clean architecture of AdminDashboard.jsx:
 *   - Calls hooks for data and handlers
 *   - Assembles layout from imported sub-components
 *   - Contains zero business logic itself
 *
 * ROUTE: /admin/analytics  (protected, same auth guard as /admin)
 */

import useAnalyticsData from '../hooks/useAnalyticsData';
import useMonthlyReport from '../hooks/useMonthlyReport';
import { logoutAdmin } from '../services/firebaseService';

import Sidebar from './dashboard/Sidebar';
import AnalyticsHeader from './analytics/AnalyticsHeader';
import AnalyticsKPICards from './analytics/AnalyticsKPICards';
import RevenueChart from './analytics/RevenueChart';
import DurationChart from './analytics/DurationChart';
import ZoneHeatmap from './analytics/ZoneHeatmap';
import TopZonesTable from './analytics/TopZonesTable';

import './AnalyticsDashboard.css';

// ── AnalyticsDashboard ─────────────────────────────────────────────────────────
const AnalyticsDashboard = ({ user }) => {
    // ── Data (period drives all metrics) ─────────────────────────────────────
    const {
        analyticsStats,
        barChartData,       // renamed from weeklyRevenue — now period-aware
        durationBuckets,
        avgDurationHrs,
        periodData,         // renamed from monthlyData — scoped to selected period
        periodLabel,        // "yyyy-mm-dd → yyyy-mm-dd" string
        period,
        setPeriod,
        loading,
    } = useAnalyticsData();

    // ── PDF report — uses periodData so it matches what's on screen ──────────
    const { handleGenerateReport } = useMonthlyReport({
        monthlyData: periodData,
        analyticsStats,
    });

    const adminName = user?.email?.split('@')[0] || 'Admin';

    // ── Layout ────────────────────────────────────────────────────────────────
    return (
        <div
            className="an-root"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {/* Shared sidebar — Analytics link is active */}
            <Sidebar adminName={adminName} onLogout={logoutAdmin} activePage="analytics" />

            <main className="an-main">
                {/* Loading overlay */}
                {loading && (
                    <div className="an-loading">
                        <span className="material-symbols-outlined an-spin">refresh</span>
                        <p>Loading analytics…</p>
                    </div>
                )}

                {/* Page header — period selector lives here */}
                <AnalyticsHeader
                    period={period}
                    setPeriod={setPeriod}
                    onGenerateReport={handleGenerateReport}
                    dateRangeLabel={periodLabel}
                />

                <div className="an-body">
                    {/* KPI cards — all scoped to selected period */}
                    <AnalyticsKPICards stats={analyticsStats} period={period} />

                    {/* Charts row: Revenue bar chart (wide) + Duration donut (narrow) */}
                    <div className="an-charts-row">
                        <RevenueChart barChartData={barChartData} period={period} />
                        <DurationChart
                            durationBuckets={durationBuckets}
                            avgDurationHrs={avgDurationHrs}
                        />
                    </div>

                    {/* Bottom row: Heatmap + Top Zones */}
                    <div className="an-bottom-row">
                        <ZoneHeatmap />
                        <TopZonesTable totalRevenue={analyticsStats.totalRevenue} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalyticsDashboard;
