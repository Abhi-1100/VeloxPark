/**
 * AnalyticsHeader.jsx
 * -------------------
 * Page header with title, period selector, "Generate Monthly Report" button,
 * and notifications icon.
 *
 * PROPS:
 *   period          {string}    Currently selected period label
 *   setPeriod       {function}  Updates selected period
 *   onGenerateReport{function}  Triggers PDF generation for the month
 *   dateRangeLabel  {string}    Human-readable date range shown in subtitle
 */

const AnalyticsHeader = ({ period, setPeriod, onGenerateReport, dateRangeLabel }) => (
    <header className="an-header">
        <div className="an-header-left">
            <h2 className="an-page-title">Parking Analytics &amp; Reports</h2>
            <p className="an-page-sub">Performance metrics · {dateRangeLabel}</p>
        </div>
        <div className="an-header-right">
            {/* Period selector */}
            <div className="an-select-wrap">
                <span className="material-symbols-outlined an-select-icon">calendar_today</span>
                <select
                    className="an-select"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Monthly View</option>
                    <option>Custom Range</option>
                </select>
            </div>

            {/* Generate Monthly Report */}
            <button className="an-report-btn" onClick={onGenerateReport}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>summarize</span>
                Generate Monthly Report
            </button>

            {/* Notifications */}
            <button className="an-notif-btn">
                <span className="material-symbols-outlined">notifications</span>
            </button>
        </div>
    </header>
);

export default AnalyticsHeader;
