/**
 * RevenueChart.jsx  (SVG-based proper X/Y chart)
 * ------------------------------------------------
 * A real bar chart with:
 *   Y-axis  — Amount (₹) labels on the LEFT, properly aligned
 *   X-axis  — Day labels BELOW the chart, never overlapping bars
 *   Grid    — horizontal dashed lines at each Y tick
 *   Bars    — current period (yellow) + previous period (slate, 7-day only)
 *   Tooltip — hover shows exact ₹ value
 *
 * Uses SVG so every element has a precise coordinate — no CSS flexbox hacks.
 *
 * PROPS:
 *   barChartData  [{ label, current, previous }]  — from useAnalyticsData
 *   period        {string}                         — drives title + legend
 */

import { useState } from 'react';

// ── Chart constants ────────────────────────────────────────────────────────────
const CHART_H = 260;   // total SVG height (px)
const CHART_W = 900;   // total SVG width  (px) — viewBox, scales to container
const PAD_LEFT = 56;    // room for Y-axis labels
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 36;    // room for X-axis labels
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM;
const PLOT_W = CHART_W - PAD_LEFT - PAD_RIGHT;
const Y_TICKS = 5;     // number of horizontal grid lines

/** Round up to a "nice" number for the Y-axis ceiling. */
const niceMax = (raw) => {
    if (raw <= 0) return 100;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const nice = Math.ceil(raw / mag) * mag;
    return nice === raw ? nice + mag : nice;
};

// ── Component ─────────────────────────────────────────────────────────────────
const RevenueChart = ({ barChartData, period }) => {
    const [tooltip, setTooltip] = useState(null); // { x, y, label, value }

    if (!barChartData || barChartData.length === 0) {
        return (
            <div className="an-chart-card an-chart-wide">
                <div className="an-chart-header">
                    <h4 className="an-section-title">Revenue (Amount vs Days)</h4>
                </div>
                <div className="an-chart-empty">
                    <span className="material-symbols-outlined">bar_chart</span>
                    <p>No revenue data for this period</p>
                </div>
            </div>
        );
    }

    // ── Derived values ────────────────────────────────────────────────────────
    const showPrev = barChartData.length <= 14; // only show prev bars for 7-day view
    const rawMax = Math.max(
        1,
        ...barChartData.map((d) => Math.max(d.current, showPrev ? d.previous : 0))
    );
    const yMax = niceMax(rawMax);
    const totalRev = barChartData.reduce((s, d) => s + d.current, 0);

    const n = barChartData.length;

    // Bar geometry
    const groupW = PLOT_W / n;
    const barW = showPrev
        ? Math.max(2, groupW * 0.32)
        : Math.max(2, groupW * 0.55);
    const gap = showPrev ? Math.max(1, groupW * 0.06) : 0;

    // Map a ₹ value → SVG Y coordinate (0 at top, PLOT_H at bottom)
    const toY = (val) => PAD_TOP + PLOT_H - (val / yMax) * PLOT_H;

    // Y-axis tick values
    const yTicks = Array.from({ length: Y_TICKS + 1 }, (_, i) =>
        Math.round((yMax / Y_TICKS) * i)
    );

    // Chart title
    const chartTitle =
        period === 'Last 30 Days' ? 'Revenue — Last 30 Days (Amount vs Days)' :
            period === 'Monthly View' ? 'Revenue — This Month (Amount vs Days)' :
                'Revenue — Last 7 Days (Amount vs Days)';

    return (
        <div className="an-chart-card an-chart-wide">
            {/* ── Header ── */}
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

            {/* ── SVG Chart ── */}
            <div className="an-svg-wrap">
                <svg
                    viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                    preserveAspectRatio="none"
                    className="an-svg"
                    aria-label="Revenue bar chart"
                    onMouseLeave={() => setTooltip(null)}
                >
                    {/* ── Y-axis grid lines + labels ── */}
                    {yTicks.map((tick, i) => {
                        const y = toY(tick);
                        return (
                            <g key={i}>
                                {/* Horizontal grid line */}
                                <line
                                    x1={PAD_LEFT}
                                    y1={y}
                                    x2={CHART_W - PAD_RIGHT}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="1"
                                    strokeDasharray={tick === 0 ? 'none' : '4 4'}
                                />
                                {/* Y-axis label — right-aligned to PAD_LEFT - 6 */}
                                <text
                                    x={PAD_LEFT - 6}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="rgba(255,255,255,0.35)"
                                    fontFamily="Space Grotesk, sans-serif"
                                    fontWeight="600"
                                >
                                    ₹{tick >= 1000 ? `${tick / 1000}k` : tick}
                                </text>
                            </g>
                        );
                    })}

                    {/* ── Y-axis vertical line ── */}
                    <line
                        x1={PAD_LEFT}
                        y1={PAD_TOP}
                        x2={PAD_LEFT}
                        y2={PAD_TOP + PLOT_H}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                    />

                    {/* ── X-axis horizontal line ── */}
                    <line
                        x1={PAD_LEFT}
                        y1={PAD_TOP + PLOT_H}
                        x2={CHART_W - PAD_RIGHT}
                        y2={PAD_TOP + PLOT_H}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                    />

                    {/* ── Bars + X labels ── */}
                    {barChartData.map((d, i) => {
                        const groupX = PAD_LEFT + i * groupW;
                        const centerX = groupX + groupW / 2;

                        // Current bar
                        const currH = Math.max(2, (d.current / yMax) * PLOT_H);
                        const currX = showPrev
                            ? centerX - gap / 2 - barW
                            : centerX - barW / 2;
                        const currY = PAD_TOP + PLOT_H - currH;

                        // Previous bar (7-day only)
                        const prevH = Math.max(2, (d.previous / yMax) * PLOT_H);
                        const prevX = centerX + gap / 2;
                        const prevY = PAD_TOP + PLOT_H - prevH;

                        // X label — only render if non-empty
                        const xLabel = d.label || '';

                        return (
                            <g key={i}>
                                {/* Previous period bar */}
                                {showPrev && d.previous > 0 && (
                                    <rect
                                        x={prevX}
                                        y={prevY}
                                        width={barW}
                                        height={prevH}
                                        rx="2"
                                        fill="#334155"
                                        opacity="0.8"
                                        onMouseEnter={() => setTooltip({
                                            x: prevX + barW / 2,
                                            y: prevY,
                                            label: d.date,
                                            value: d.previous,
                                            type: 'prev',
                                        })}
                                    />
                                )}

                                {/* Current period bar */}
                                <rect
                                    x={currX}
                                    y={currY}
                                    width={barW}
                                    height={currH}
                                    rx="2"
                                    fill={d.current > 0 ? '#f9d006' : 'rgba(249,208,6,0.15)'}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setTooltip({
                                        x: currX + barW / 2,
                                        y: currY,
                                        label: d.date,
                                        value: d.current,
                                        type: 'curr',
                                    })}
                                />

                                {/* X-axis label — always BELOW the axis line */}
                                {xLabel && (
                                    <text
                                        x={centerX}
                                        y={PAD_TOP + PLOT_H + 20}
                                        textAnchor="middle"
                                        fontSize="9"
                                        fill="rgba(255,255,255,0.35)"
                                        fontFamily="Space Grotesk, sans-serif"
                                        fontWeight="700"
                                    >
                                        {xLabel}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* ── Y-axis title (rotated) ── */}
                    <text
                        x={10}
                        y={PAD_TOP + PLOT_H / 2}
                        textAnchor="middle"
                        fontSize="9"
                        fill="rgba(255,255,255,0.3)"
                        fontFamily="Space Grotesk, sans-serif"
                        fontWeight="700"
                        transform={`rotate(-90, 10, ${PAD_TOP + PLOT_H / 2})`}
                        letterSpacing="1"
                    >
                        AMOUNT (₹)
                    </text>

                    {/* ── X-axis title ── */}
                    <text
                        x={PAD_LEFT + PLOT_W / 2}
                        y={CHART_H - 2}
                        textAnchor="middle"
                        fontSize="9"
                        fill="rgba(255,255,255,0.3)"
                        fontFamily="Space Grotesk, sans-serif"
                        fontWeight="700"
                        letterSpacing="1"
                    >
                        DAYS
                    </text>

                    {/* ── Tooltip ── */}
                    {tooltip && (
                        <g>
                            {/* Tooltip box */}
                            <rect
                                x={Math.min(tooltip.x - 36, CHART_W - PAD_RIGHT - 80)}
                                y={Math.max(PAD_TOP, tooltip.y - 38)}
                                width={80}
                                height={28}
                                rx="4"
                                fill="#1f1f1f"
                                stroke={tooltip.type === 'curr' ? '#f9d006' : '#334155'}
                                strokeWidth="1"
                            />
                            <text
                                x={Math.min(tooltip.x - 36, CHART_W - PAD_RIGHT - 80) + 40}
                                y={Math.max(PAD_TOP, tooltip.y - 38) + 11}
                                textAnchor="middle"
                                fontSize="9"
                                fill="rgba(255,255,255,0.55)"
                                fontFamily="Space Grotesk, sans-serif"
                                fontWeight="600"
                            >
                                {tooltip.label}
                            </text>
                            <text
                                x={Math.min(tooltip.x - 36, CHART_W - PAD_RIGHT - 80) + 40}
                                y={Math.max(PAD_TOP, tooltip.y - 38) + 23}
                                textAnchor="middle"
                                fontSize="11"
                                fill={tooltip.type === 'curr' ? '#f9d006' : '#94a3b8'}
                                fontFamily="Space Grotesk, sans-serif"
                                fontWeight="800"
                            >
                                ₹{tooltip.value.toLocaleString('en-IN')}
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* ── Period total ── */}
            <div className="an-chart-total">
                <span className="an-chart-total-label">Period Total</span>
                <span className="an-chart-total-value">
                    ₹{totalRev.toLocaleString('en-IN')}
                </span>
            </div>
        </div>
    );
};

export default RevenueChart;
