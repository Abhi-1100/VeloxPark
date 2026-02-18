/**
 * DurationChart.jsx
 * -----------------
 * Stay duration analysis: a CSS-only animated donut ring + breakdown list.
 * The donut uses conic-gradient driven by real bucket percentages.
 *
 * PROPS:
 *   durationBuckets  [{ label, pct, color }]
 *   avgDurationHrs   {number}
 */

const DurationChart = ({ durationBuckets, avgDurationHrs }) => {
    // Build conic-gradient stops from bucket percentages
    let cumulative = 0;
    const stops = durationBuckets.map((b) => {
        const start = cumulative;
        cumulative += b.pct;
        return `${b.color} ${start}% ${cumulative}%`;
    });
    // Fill remainder with dark if percentages don't add to 100
    if (cumulative < 100) stops.push(`#1e293b ${cumulative}% 100%`);
    const gradient = `conic-gradient(from -90deg, ${stops.join(', ')})`;

    return (
        <div className="an-chart-card">
            <h4 className="an-section-title" style={{ marginBottom: '24px' }}>Stay Duration Analysis</h4>

            {/* Donut ring */}
            <div className="an-donut-wrap">
                <div className="an-donut" style={{ background: gradient }}>
                    <div className="an-donut-hole">
                        <p className="an-donut-value">{avgDurationHrs}h</p>
                        <p className="an-donut-sub">Average</p>
                    </div>
                </div>
            </div>

            {/* Breakdown list */}
            <div className="an-duration-list">
                {durationBuckets.map((b, i) => (
                    <div key={i} className="an-duration-row">
                        <div className="an-duration-label">
                            <span className="an-duration-dot" style={{ background: b.color }} />
                            <span>{b.label}</span>
                        </div>
                        <span className="an-duration-pct">{b.pct}%</span>
                    </div>
                ))}
                {durationBuckets.length === 0 && (
                    <p className="an-empty-hint">No completed sessions yet</p>
                )}
            </div>
        </div>
    );
};

export default DurationChart;
