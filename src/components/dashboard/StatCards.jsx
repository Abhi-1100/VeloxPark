/**
 * StatCards.jsx
 * -------------
 * Renders the four KPI stat cards (Total Vehicles, Currently Parked,
 * Total Exited, Today's Revenue).
 *
 * WHY EXTRACTED: The stat grid is a repeated, self-contained display block.
 * Extracting it removes ~35 lines of JSX from AdminDashboard and makes each
 * card easy to extend (e.g. add a tooltip or click handler) in one place.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 373-408):
 *   • <div className="pf-stats-grid"> … </div>
 *
 * PROPS:
 *   stats  { total, parked, exited, revenue }  — computed by useDashboardData
 */

const StatCards = ({ stats }) => (
    <div className="pf-stats-grid">
        {/* Total Vehicles */}
        <div className="pf-stat-card">
            <div className="pf-stat-header">
                <span className="material-symbols-outlined pf-stat-icon">
                    directions_car
                </span>
                <span className="pf-stat-badge pf-badge-green">+12%</span>
            </div>
            <p className="pf-stat-label">Total Vehicles</p>
            <h3 className="pf-stat-value">{stats.total}</h3>
        </div>

        {/* Currently Parked */}
        <div className="pf-stat-card">
            <div className="pf-stat-header">
                <span className="material-symbols-outlined pf-stat-icon">
                    local_parking
                </span>
                <span className="pf-stat-badge pf-badge-green">LIVE</span>
            </div>
            <p className="pf-stat-label">Currently Parked</p>
            <h3 className="pf-stat-value">
                {stats.parked}
                <span className="pf-stat-sub"> / {stats.total}</span>
            </h3>
        </div>

        {/* Total Exited */}
        <div className="pf-stat-card">
            <div className="pf-stat-header">
                <span className="material-symbols-outlined pf-stat-icon">
                    timer
                </span>
                <span className="pf-stat-badge pf-badge-neutral">STABLE</span>
            </div>
            <p className="pf-stat-label">Total Exited</p>
            <h3 className="pf-stat-value">{stats.exited}</h3>
        </div>

        {/* Today's Revenue */}
        <div className="pf-stat-card">
            <div className="pf-stat-header">
                <span className="material-symbols-outlined pf-stat-icon">
                    payments
                </span>
                <span className="pf-stat-badge pf-badge-green">TODAY</span>
            </div>
            <p className="pf-stat-label">Today's Revenue</p>
            <h3 className="pf-stat-value">
                ₹{stats.revenue}
                <span className="pf-stat-sub"> INR</span>
            </h3>
        </div>
    </div>
);

export default StatCards;
