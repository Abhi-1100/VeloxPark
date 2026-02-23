/**
 * Sidebar.jsx  (updated)
 * ----------------------
 * Slim collapsible sidebar — now uses React Router <Link> for navigation
 * and accepts an `activePage` prop to highlight the correct nav item.
 *
 * PROPS:
 *   adminName   {string}    Display name derived from user.email
 *   onLogout    {function}  Logout handler
 *   activePage  {string}    'dashboard' | 'analytics'  (default: 'dashboard')
 */

import { Link } from 'react-router-dom';

const NAV_ITEMS = [
    { key: 'dashboard', to: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { key: 'analytics', to: '/admin/analytics', icon: 'monitoring', label: 'Analytics' },
    { key: 'map', to: '#', icon: 'map', label: 'Zone Map' },
    { key: 'users', to: '#', icon: 'group', label: 'Users' },
    { key: 'settings', to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

const Sidebar = ({ adminName, onLogout, activePage = 'dashboard' }) => (
    <aside className="pf-sidebar group/sidebar">
        {/* Logo */}
        <div className="pf-sidebar-logo">
            <div className="pf-logo-icon">
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px', fontWeight: 700 }}
                >
                    local_parking
                </span>
            </div>
            <span className="pf-sidebar-label pf-logo-text">VeloxPark</span>
        </div>

        {/* Nav */}
        <nav className="pf-nav">
            {NAV_ITEMS.map(({ key, to, icon, label }) => {
                const isActive = activePage === key;
                return (
                    <Link
                        key={key}
                        to={to}
                        className={`pf-nav-item ${isActive ? 'pf-nav-active' : 'pf-nav-inactive'}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="pf-nav-icon-wrap">
                            <span className={`material-symbols-outlined ${isActive ? 'pf-glow-icon' : ''}`}>
                                {icon}
                            </span>
                        </div>
                        <span className="pf-sidebar-label">{label}</span>
                        {isActive && <div className="pf-active-bar" />}
                    </Link>
                );
            })}
        </nav>

        {/* Bottom section */}
        <div className="pf-sidebar-bottom">
            {/* Systems online indicator */}
            <div className="pf-nav-item pf-nav-inactive" style={{ cursor: 'default' }}>
                <div className="pf-nav-icon-wrap">
                    <span className="pf-online-dot" />
                </div>
                <span className="pf-sidebar-label pf-online-text">Systems Online</span>
            </div>

            {/* User info */}
            <div className="pf-nav-item" style={{ overflow: 'hidden' }}>
                <div className="pf-nav-icon-wrap">
                    <div className="pf-avatar">
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '18px', color: '#f9d006' }}
                        >
                            manage_accounts
                        </span>
                    </div>
                </div>
                <div className="pf-sidebar-label pf-user-info">
                    <p className="pf-user-name">{adminName}</p>
                    <p className="pf-user-role">Lead Admin</p>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={onLogout}
                className="pf-nav-item pf-nav-inactive pf-logout-btn"
                style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
                <div className="pf-nav-icon-wrap">
                    <span className="material-symbols-outlined">logout</span>
                </div>
                <span className="pf-sidebar-label">Logout</span>
            </button>
        </div>
    </aside>
);

export default Sidebar;
