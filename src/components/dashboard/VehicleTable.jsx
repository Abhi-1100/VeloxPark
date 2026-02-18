/**
 * VehicleTable.jsx
 * ----------------
 * Renders the Vehicle Records table including loading, empty, and data states.
 *
 * WHY EXTRACTED: The table is the largest single JSX block (~70 lines) in the
 * original file.  Extracting it makes AdminDashboard.jsx dramatically shorter
 * and keeps all table-related markup in one maintainable place.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 467-537):
 *   • <div className="pf-records-card"> … </div>
 *
 * PROPS:
 *   visibleData   {Array}     Filtered vehicle records from useDashboardData
 *   loading       {boolean}   Whether data is still being fetched
 *   stats         { parked, exited }  For the subtitle count line
 *   dateFilter    {string}    Active date filter (yyyy-mm-dd)
 *   onExportPDF   {function}  PDF export handler
 */

import { formatDateTime, formatDuration } from '../../utils/parkingUtils';

const VehicleTable = ({
    visibleData,
    loading,
    stats,
    dateFilter,
    onExportPDF,
}) => (
    <div className="pf-records-card">
        {/* Header row */}
        <div className="pf-records-header">
            <div className="pf-records-title-group">
                <span className="material-symbols-outlined pf-records-icon">
                    table_rows
                </span>
                <div>
                    <h2 className="pf-section-title">
                        Vehicle Records
                        {dateFilter && (
                            <span className="pf-date-chip">
                                {new Date(
                                    dateFilter + 'T00:00:00'
                                ).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                    </h2>
                    <p className="pf-section-sub">
                        {visibleData.length} record
                        {visibleData.length !== 1 ? 's' : ''}&nbsp;·&nbsp;
                        {stats.parked} parked&nbsp;·&nbsp;{stats.exited} exited
                    </p>
                </div>
            </div>
            <button onClick={onExportPDF} className="pf-export-inline-btn">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '16px' }}
                >
                    download
                </span>
                Export PDF
            </button>
        </div>

        {/* Table / loading / empty state */}
        <div className="pf-records-wrap">
            {loading ? (
                <div className="pf-empty-state">
                    <span className="material-symbols-outlined pf-empty-icon pf-spin">
                        refresh
                    </span>
                    <p>Loading parking data...</p>
                </div>
            ) : visibleData.length > 0 ? (
                <table className="pf-records-table">
                    <thead>
                        <tr>
                            <th>Plate Number</th>
                            <th>Entry Time</th>
                            <th>Exit Time</th>
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.map((vehicle, index) => (
                            <tr key={index} className="pf-rec-row">
                                <td>
                                    <span className="pf-rec-plate">
                                        {vehicle.plate}
                                    </span>
                                </td>
                                <td className="pf-rec-time">
                                    {formatDateTime(vehicle.entry)}
                                </td>
                                <td className="pf-rec-time">
                                    {vehicle.exit ? (
                                        formatDateTime(vehicle.exit)
                                    ) : (
                                        <span className="pf-rec-dash">—</span>
                                    )}
                                </td>
                                <td className="pf-rec-time">
                                    {formatDuration(vehicle.duration)}
                                </td>
                                <td className="pf-rec-amount">
                                    ₹{vehicle.amount || 0}
                                </td>
                                <td>
                                    <span
                                        className={`pf-rec-badge ${vehicle.status === 'Parked'
                                                ? 'pf-rec-parked'
                                                : 'pf-rec-exited'
                                            }`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="pf-empty-state">
                    <span className="material-symbols-outlined pf-empty-icon">
                        search_off
                    </span>
                    <p>No records for this date / filter</p>
                    <p className="pf-empty-sub">
                        Try a different date or clear the status filter
                    </p>
                </div>
            )}
        </div>
    </div>
);

export default VehicleTable;
