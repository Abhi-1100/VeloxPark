/**
 * ZoneMap.jsx
 * -----------
 * Renders the "Zone Alpha Map" parking-slot visualisation panel.
 * Also contains the ZoneRow helper component (UI-only, no logic).
 *
 * WHY EXTRACTED: The zone map is a standalone visual widget.  Keeping ZoneRow
 * co-located here (rather than in a separate file) avoids over-fragmenting
 * small, tightly coupled helpers.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 412-434 + 562-575):
 *   • <div className="pf-zone-card"> … </div>
 *   • ZoneRow component
 *
 * No props required — slot data is static/demo data.
 */

/** Renders one labelled row of parking slots. */
const ZoneRow = ({ prefix, count, occupied }) => (
    <div className="pf-slot-row">
        {Array.from({ length: count }, (_, i) => {
            const isOccupied = occupied.includes(i);
            const label = `${prefix}${String(i + 1).padStart(2, '0')}`;
            return (
                <div
                    key={i}
                    className={`pf-slot ${isOccupied ? 'pf-slot-occ' : 'pf-slot-avail'}`}
                >
                    {!isOccupied && (
                        <span className="pf-slot-label">{label}</span>
                    )}
                </div>
            );
        })}
    </div>
);

/** Zone Alpha Map panel with three rows (A, B, C). */
const ZoneMap = () => (
    <div className="pf-zone-card">
        <div className="pf-zone-header">
            <div>
                <h2 className="pf-section-title">Zone Alpha Map</h2>
                <p className="pf-section-sub">Real-time slot visualization</p>
            </div>
            <div className="pf-zone-legend">
                <span className="pf-legend-item pf-legend-avail">
                    <span className="pf-legend-dot pf-dot-avail" /> Available
                </span>
                <span className="pf-legend-item pf-legend-occ">
                    <span className="pf-legend-dot pf-dot-occ" /> Occupied
                </span>
            </div>
        </div>

        <div className="pf-zone-body">
            <ZoneRow prefix="A" count={10} occupied={[1, 2, 5, 6, 7]} />
            <div className="pf-zone-divider" />
            <ZoneRow prefix="B" count={10} occupied={[0, 3, 4, 5, 8, 9]} />
            <div className="pf-zone-divider" />
            <ZoneRow prefix="C" count={10} occupied={[2, 3, 4, 5, 6, 7, 8]} />
        </div>
    </div>
);

export default ZoneMap;
