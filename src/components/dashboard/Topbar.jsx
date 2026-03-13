/**
 * Topbar.jsx
 * ----------
 * The sticky top navigation / command bar.
 *
 * WHY EXTRACTED: The topbar is a distinct UI region with its own layout and
 * interactive controls.  Separating it from the page body makes both easier
 * to read and modify independently.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 316-349):
 *   • <div className="pf-topbar"> … </div>
 *
 * PROPS:
 *   searchTerm    {string}    Current search input value
 *   setSearchTerm {function}  Updates search term in the parent hook
 *   dateFilter    {string}    Current date filter value (yyyy-mm-dd)
 *   setDateFilter {function}  Updates date filter in the parent hook
 */

const Topbar = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter, onOpenEntry }) => (
    <div className="pf-topbar">
        {/* Brand pill */}
        <div className="pf-brand-pill">
            <span className="pf-brand-name">VeloxPark</span>
            <span className="pf-brand-dot" />
            <span className="pf-brand-version">Enterprise v2.0</span>
        </div>

        {/* Search / command bar */}
        <div className="pf-command-bar">
            <span className="material-symbols-outlined pf-cmd-icon">
                terminal
            </span>
            <input
                type="text"
                className="pf-cmd-input"
                placeholder="Search by plate number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pf-cmd-right">
                <kbd className="pf-kbd">⌘K</kbd>
                <div className="pf-cmd-divider" />
                <button className="pf-icon-btn">
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px' }}
                    >
                        notifications
                    </span>
                </button>
            </div>
        </div>

        {/* Right controls */}
        <div className="pf-topbar-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                    type="date"
                    className="pf-date-input"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    title="Filter by date (clear to show all)"
                />
                {dateFilter && (
                    <button
                        onClick={() => setDateFilter('')}
                        title="Show all dates"
                        style={{
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '8px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            padding: '6px 10px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ALL DATES
                    </button>
                )}
            </div>
            <button className="pf-new-entry-btn" onClick={onOpenEntry}>
                + NEW ENTRY
            </button>
        </div>
    </div>
);

export default Topbar;
