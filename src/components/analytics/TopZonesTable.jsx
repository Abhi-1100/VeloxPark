/**
 * TopZonesTable.jsx
 * -----------------
 * Table of top-performing parking zones.
 * Zone data is static/demo (zones are not tracked per-slot in Firebase yet).
 * Revenue column is derived from real total revenue proportionally.
 *
 * PROPS:
 *   totalRevenue  {number}  Real total revenue from useAnalyticsData
 */

const ZONES = [
    { id: 'North-A2', occupancy: 94, turnover: '4.2/day', revShare: 0.32 },
    { id: 'East-B1', occupancy: 88, turnover: '3.8/day', revShare: 0.27 },
    { id: 'South-C5', occupancy: 82, turnover: '3.1/day', revShare: 0.25 },
    { id: 'West-D2', occupancy: 75, turnover: '2.9/day', revShare: 0.16 },
];

const OccupancyBar = ({ pct }) => (
    <div className="an-zone-bar-wrap">
        <div className="an-zone-bar-track">
            <div className="an-zone-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="an-zone-bar-label">{pct}%</span>
    </div>
);

const TopZonesTable = ({ totalRevenue }) => (
    <div className="an-chart-card">
        <div className="an-zones-header">
            <h4 className="an-section-title">Top Performing Zones</h4>
            <button className="an-view-all-btn">View All</button>
        </div>

        <div className="an-zones-table-wrap">
            <table className="an-zones-table">
                <thead>
                    <tr>
                        <th>Zone ID</th>
                        <th>Occupancy</th>
                        <th>Turnover</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {ZONES.map((z) => (
                        <tr key={z.id}>
                            <td className="an-zone-id">{z.id}</td>
                            <td><OccupancyBar pct={z.occupancy} /></td>
                            <td className="an-zone-turnover">{z.turnover}</td>
                            <td className="an-zone-revenue">
                                ₹{Math.round(totalRevenue * z.revShare).toLocaleString('en-IN')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TopZonesTable;
