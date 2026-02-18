/**
 * TrafficPanel.jsx
 * ----------------
 * Renders the Traffic Flow chart, Peak Trends bars, Live Occupancy bar,
 * and the Export Report button.
 *
 * WHY EXTRACTED: The traffic panel is a self-contained analytics widget.
 * TrafficChart and TrendBar are kept co-located here because they are only
 * ever used inside this panel.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 436-463 + 577-602):
 *   • <div className="pf-traffic-card"> … </div>
 *   • TrafficChart component
 *   • TrendBar component
 *
 * PROPS:
 *   occupancyPct    {number}    Live occupancy percentage (0-100)
 *   onExportPDF     {function}  PDF export handler from useExportPDF hook
 */

/** Simple bar chart for traffic flow — static demo data. */
const TrafficChart = () => {
    const bars = [30, 45, 75, 95, 60, 50, 85];
    return (
        <div className="pf-chart">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="pf-chart-bar-wrap"
                    style={{ height: `${h}%` }}
                >
                    <div className="pf-chart-bar" />
                </div>
            ))}
        </div>
    );
};

/** Horizontal progress bar for peak trends. */
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

/** Traffic Flow + Peak Trends + Live Occupancy panel. */
const TrafficPanel = ({ occupancyPct, onExportPDF }) => (
    <div className="pf-traffic-card">
        {/* Traffic Flow chart */}
        <div>
            <div className="pf-traffic-header">
                <h2 className="pf-section-title">Traffic Flow</h2>
                <span className="pf-live-badge">Live</span>
            </div>
            <TrafficChart />
            <div className="pf-chart-labels">
                <span>08:00</span>
                <span>16:00</span>
                <span>23:00</span>
            </div>
        </div>

        {/* Peak Trends */}
        <div>
            <h2 className="pf-section-title" style={{ marginBottom: '20px' }}>
                Peak Trends
            </h2>
            <div className="pf-trends">
                <TrendBar label="Mon – Wed" pct={88} />
                <TrendBar label="Thu – Fri" pct={94} />
                <TrendBar label="Weekends" pct={42} />
            </div>
        </div>

        {/* Live Occupancy */}
        <div>
            <h2 className="pf-section-title" style={{ marginBottom: '12px' }}>
                Live Occupancy
            </h2>
            <TrendBar label="Current" pct={occupancyPct} />
        </div>

        {/* Export button */}
        <button onClick={onExportPDF} className="pf-export-btn">
            <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px' }}
            >
                download
            </span>
            Export Full Report
        </button>
    </div>
);

export default TrafficPanel;
