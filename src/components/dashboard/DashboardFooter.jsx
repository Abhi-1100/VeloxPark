/**
 * DashboardFooter.jsx
 * -------------------
 * Simple footer bar with copyright notice and policy links.
 *
 * WHY EXTRACTED: The footer is a static, reusable element that has no
 * dependency on dashboard state.  Extracting it keeps AdminDashboard.jsx
 * focused on layout orchestration.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 540-552):
 *   • <footer className="pf-footer"> … </footer>
 *
 * No props required.
 */

const DashboardFooter = () => (
    <footer className="pf-footer">
        <div className="pf-footer-inner">
            <div className="pf-footer-copy">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px' }}
                >
                    copyright
                </span>
                <span>2026 ParkPortal Systems Inc.</span>
            </div>
            <div className="pf-footer-links">
                <a href="#" className="pf-footer-link">TERMS</a>
                <a href="#" className="pf-footer-link">PRIVACY</a>
                <a href="#" className="pf-footer-link">COOKIES</a>
            </div>
        </div>
    </footer>
);

export default DashboardFooter;
