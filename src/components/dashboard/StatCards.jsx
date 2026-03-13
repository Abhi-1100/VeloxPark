/**
 * StatCards.jsx
 * -------------
 * Renders the four KPI stat cards (Total Vehicles, Currently Parked,
 * Total Exited, Revenue).
 *
 * PROPS:
 *   stats       { total, parked, exited, revenue }  — computed by useDashboardData
 *   dateFilter  {string}  Active yyyy-mm-dd filter; empty = all dates (revenue is today's)
 */

const StatCards = ({ stats, dateFilter }) => {
    const revenueLabel = dateFilter
        ? new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' Revenue'
        : "Today's Revenue";
    const revenueBadge = dateFilter ? 'FILTERED' : 'TODAY';

    return (
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

            {/* Revenue */}
            <div className="pf-stat-card">
                <div className="pf-stat-header">
                    <span className="material-symbols-outlined pf-stat-icon">
                        payments
                    </span>
                    <span className="pf-stat-badge pf-badge-green">{revenueBadge}</span>
                </div>
                <p className="pf-stat-label">{revenueLabel}</p>
                <h3 className="pf-stat-value">
                    ₹{(stats.revenue || 0).toLocaleString('en-IN')}
                    <span className="pf-stat-sub"> INR</span>
                </h3>
            </div>
        </div>
    );
};

export default StatCards;

