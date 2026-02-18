/**
 * AnalyticsKPICards.jsx
 * ----------------------
 * Four KPI summary cards: Total Revenue, Occupancy Rate, Active Sessions,
 * Avg. Turnover — all driven by real Firebase data via useAnalyticsData.
 *
 * PROPS:
 *   stats  { totalRevenue, occupancyRate, activeSessions, avgTurnoverHrs }
 */

const KPICard = ({ icon, iconClass, label, value, trend, trendUp, barPct, barClass }) => (
    <div className="an-kpi-card">
        <div className="an-kpi-top">
            <div className={`an-kpi-icon-wrap ${iconClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className={`an-kpi-trend ${trendUp ? 'an-trend-up' : 'an-trend-down'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {trendUp ? 'trending_up' : 'trending_down'}
                </span>
                {trend}
            </div>
        </div>
        <div className="an-kpi-body">
            <p className="an-kpi-label">{label}</p>
            <h3 className="an-kpi-value">{value}</h3>
        </div>
        <div className="an-kpi-bar-track">
            <div className={`an-kpi-bar-fill ${barClass}`} style={{ width: `${barPct}%` }} />
        </div>
    </div>
);

const AnalyticsKPICards = ({ stats }) => {
    const { totalRevenue, occupancyRate, activeSessions, avgTurnoverHrs } = stats;

    // Bar widths capped at 100
    const revBar = Math.min(100, totalRevenue > 0 ? 72 : 0);
    const occBar = Math.min(100, occupancyRate);
    const sessBar = Math.min(100, activeSessions > 0 ? Math.min(activeSessions * 5, 100) : 0);
    const turnBar = Math.min(100, avgTurnoverHrs > 0 ? Math.min(avgTurnoverHrs * 10, 100) : 0);

    return (
        <div className="an-kpi-grid">
            <KPICard
                icon="payments"
                iconClass="an-icon-green"
                label="Total Revenue"
                value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                trend="Live"
                trendUp={true}
                barPct={revBar}
                barClass="an-bar-green"
            />
            <KPICard
                icon="directions_car"
                iconClass="an-icon-yellow"
                label="Occupancy Rate"
                value={`${occupancyRate}%`}
                trend={`${occupancyRate > 50 ? '+' : ''}${occupancyRate - 50}%`}
                trendUp={occupancyRate >= 50}
                barPct={occBar}
                barClass="an-bar-yellow"
            />
            <KPICard
                icon="timer"
                iconClass="an-icon-blue"
                label="Active Sessions"
                value={activeSessions.toLocaleString()}
                trend="Live"
                trendUp={true}
                barPct={sessBar}
                barClass="an-bar-blue"
            />
            <KPICard
                icon="published_with_changes"
                iconClass="an-icon-purple"
                label="Avg. Turnover"
                value={`${avgTurnoverHrs}h`}
                trend="Avg"
                trendUp={true}
                barPct={turnBar}
                barClass="an-bar-purple"
            />
        </div>
    );
};

export default AnalyticsKPICards;
