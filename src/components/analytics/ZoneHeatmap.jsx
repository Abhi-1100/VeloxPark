/**
 * ZoneHeatmap.jsx
 * ---------------
 * Visual heatmap of parking zone usage intensity.
 * The 40 cells are static demo data (matching the original design).
 * Intensity values 0-4 map to opacity levels of the primary colour.
 *
 * No props required.
 */

// 40 cells: 0 = cold, 4 = hot
const HEATMAP_DATA = [
    0, 0, 1, 2, 3, 4, 4, 4,
    0, 0, 0, 1, 2, 3, 4, 4,
    0, 1, 0, 0, 2, 3, 4, 4,
    0, 0, 0, 0, 0, 1, 2, 3,
    0, 0, 0, 0, 0, 0, 0, 0,
];

const INTENSITY_CLASSES = [
    'an-heat-0',
    'an-heat-1',
    'an-heat-2',
    'an-heat-3',
    'an-heat-4',
];

const ZoneHeatmap = () => (
    <div className="an-chart-card">
        <div className="an-heatmap-header">
            <h4 className="an-section-title">Zone Usage Heatmap</h4>
            <div className="an-heat-legend">
                <span className="an-heat-legend-label">LOW</span>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`an-heat-swatch ${INTENSITY_CLASSES[i]}`} />
                ))}
                <span className="an-heat-legend-label">HIGH</span>
            </div>
        </div>

        <div className="an-heatmap-grid">
            {HEATMAP_DATA.map((intensity, i) => (
                <div
                    key={i}
                    className={`an-heatmap-cell ${INTENSITY_CLASSES[intensity]}`}
                    title={`Zone cell ${i + 1} — intensity ${intensity}`}
                />
            ))}
        </div>

        <p className="an-heatmap-note">
            * Hot zones detected in North Terminal Level 2 (Zone B7–B12)
        </p>
    </div>
);

export default ZoneHeatmap;
