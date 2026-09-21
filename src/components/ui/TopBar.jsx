import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import avatarJack from '../../assets/avatar-jack.jpg';
import './TopBar.css';

/* ─── Vector SVG Icons (No Emojis) ────────────────────────────────────────── */
function IconDashboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const navItems = [
  { to: '/', label: 'Dashboard', Icon: IconDashboard, end: true },
  { to: '/book', label: 'Book a slot', Icon: IconBook },
  { to: '/map', label: 'Live map', Icon: IconMap },
  { to: '/history', label: 'History', Icon: IconHistory },
  { to: '/profile', label: 'Profile', Icon: IconProfile },
];

function TopBar({ userName, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isDedicatedMobileScreen = ['/book', '/map', '/confirm'].includes(location.pathname);
  const displayName = userName || 'Jack Harrison';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className={`vp-topbar ${isDedicatedMobileScreen ? 'vp-topbar-mobile-hidden' : ''}`}>
        {/* ── Desktop TopBar Layout ────────────────────────────────────────── */}
        <div className="vp-page-container vp-topbar-inner vp-desktop-header">
          {/* ── Brand Logo ──────────────────────────────────────────────────── */}
          <Link to="/" className="vp-brand-link" style={{ gap: '12px', paddingLeft: '8px' }}>
            <img src="/veloxpark logo.png" alt="VeloxPark Logo" style={{ height: '36px', width: 'auto' }} />
          </Link>

          {/* ── Center Section Pill Tabs ───────────────────────────────────── */}
          <nav aria-label="User navigation" className="vp-nav-pill-group">
            {navItems.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `vp-nav-pill ${isActive ? 'active' : ''}`}
              >
                <span className="vp-nav-pill-icon"><Icon /></span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* ── User Profile & Sign Out (Right Side) ─────────────────────────── */}
          <div className="vp-user-actions">
            <Link to="/profile" className="vp-user-profile-chip" title="Account settings">
              <div className="vp-user-avatar">{initials}</div>
              <div className="vp-user-text">
                <span className="vp-user-name">{displayName}</span>
                <span className="vp-user-role">DRIVER</span>
              </div>
            </Link>

            {onSignOut && (
              <button
                type="button"
                className="vp-signout-btn"
                onClick={onSignOut}
                title="Sign out of account"
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile TopBar Layout (Image 4 Mockup) ─────────────────────────── */}
        <div className="vp-mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/profile">
              <img src={avatarJack} alt={displayName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Welcome Back</span>
              <span style={{ fontSize: '17px', color: '#ffffff', fontWeight: 600 }}>{displayName}</span>
            </div>
          </div>
          
          <button
            type="button"
            className="vp-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', display: 'flex' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-out Drawer Navigation ─────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="vp-mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="vp-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="vp-drawer-header">
              <div className="flex items-center gap-3">
                <img src={avatarJack} alt={displayName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-paper text-base leading-tight">{displayName}</div>
                  <div className="text-xs text-muted">Brooklyn, NY · Driver</div>
                </div>
              </div>
              <button
                type="button"
                className="vp-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className="vp-drawer-nav">
              {navItems.map(({ to, label, Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `vp-drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="vp-drawer-icon"><Icon /></span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {onSignOut && (
              <div className="vp-drawer-footer">
                <button
                  type="button"
                  className="vp-drawer-signout-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TopBar;
