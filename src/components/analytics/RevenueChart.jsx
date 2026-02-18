/**
 * RevenueChart.jsx
 * ----------------
 * Period-aware revenue bar chart — current period vs previous period.
 * Handles 7, 30, or monthly bar counts gracefully.
 * Bars are scaled relative to the max value so the chart is always readable.
 *
 * PROPS:
 *   barChartData  [{ label, current, previous }]  — from useAnalyticsData
 *   period        {string}                         — for the chart title
 */

const RevenueChart = ({ barChartData, period }) => {
    // Find max value across all bars so we can scale heights 0–100%
    const maxVal = Math.max(
        1, // avoid /0
        ...barChartData.map((d) => Math.max(d.current, d.previous))
    );

    // For 30-day view, bars are very thin — hide previous-week bars to reduce clutter
    const showPrev = barChartData.length <= 14;

    const toHeight = (val) => Math.max(3, Math.round((val / maxVal) * 95));

    // Chart title adapts to period
    const chartTitle =
        period === 'Last 30 Days' ? 'Revenue — Last 30 Days (Daily)' :
            period === 'Monthly View' ? 'Revenue — This Month (Daily)' :
                'Revenue Distribution by Day';

    return (
        <div className="an-chart-card an-chart-wide">
            <div className="an-chart-header">
                <h4 className="an-section-title">{chartTitle}</h4>
                <div className="an-chart-legend">
                    {showPrev && (
                        <span className="an-legend-item">
                            <span className="an-legend-dot an-dot-prev" />
                            Previous Period
                        </span>
                    )}
                    <span className="an-legend-item">
                        <span className="an-legend-dot an-dot-curr" />
                        {period === 'Last 7 Days' ? 'Current Week' : 'Current Period'}
                    </span>
                </div>
            </div>

            {barChartData.length === 0 ? (
                <div className="an-chart-empty">
                    <span className="material-symbols-outlined">bar_chart</span>
                    <p>No revenue data for this period</p>
                </div>
            ) : (
                <>
                    <div
                        className="an-bar-chart"
                        style={{
                            // For 30-day view reduce gap so bars fit
                            gap: barChartData.length > 14 ? '3px' : '12px',
                        }}
                    >
                        {barChartData.map((d, i) => (
                            <div key={i} className="an-bar-group">
                                <div className="an-bar-pair">
                                    {/* Previous period bar — hidden for dense views */}
                                    {showPrev && (
                                        <div
                                            className="an-bar an-bar-prev"
                                            style={{ height: `${toHeight(d.previous)}%` }}
                                            title={`Prev: ₹${d.previous}`}
                                        />
                                    )}
                                    {/* Current period bar */}
                                    <div
                                        className="an-bar an-bar-curr"
                                        style={{ height: `${toHeight(d.current)}%` }}
                                        title={`${d.label || `Day ${i + 1}`}: ₹${d.current}`}
                                    />
                                </div>
                                {/* Only show label if non-empty (sparse for 30-day) */}
                                {d.label && (
                                    <span className="an-bar-label">{d.label}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Y-axis hint */}
                    <div className="an-chart-y-hint">
                        <span>₹0</span>
                        <span>₹{Math.round(maxVal / 2).toLocaleString('en-IN')}</span>
                        <span>₹{maxVal.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Total for period */}
                    <div className="an-chart-total">
                        <span className="an-chart-total-label">Period Total</span>
                        <span className="an-chart-total-value">
                            ₹{barChartData.reduce((s, d) => s + d.current, 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default RevenueChart;
