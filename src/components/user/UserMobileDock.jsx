import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserMobileDock.css';

/* ─── Vector Line SVG Icons (Matching Screenshot Aesthetic) ───────────────── */
function IconHome({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F2C230' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5h-4v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function IconSearch({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F2C230' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconMap({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F2C230' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function IconHistory({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F2C230' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconSettings({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#F2C230' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const DOCK_ITEMS = [
  { id: 'dashboard', label: 'Home', path: '/dashboard', matches: ['/', '/dashboard', '/user'], Icon: IconHome },
  { id: 'search', label: 'Find', path: '/search', matches: ['/search', '/book'], Icon: IconSearch },
  { id: 'map', label: 'Map', path: '/map', matches: ['/map'], Icon: IconMap },
  { id: 'history', label: 'History', path: '/history', matches: ['/history'], Icon: IconHistory },
  { id: 'profile', label: 'Profile', path: '/profile', matches: ['/profile'], Icon: IconSettings },
];

const UserMobileDock = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide dock on payment checkout screens to avoid overlaying input fields
  const isPaymentScreen =
    location.pathname.includes('/pay') ||
    location.pathname.includes('/payment') ||
    location.pathname.includes('/confirm');

  if (isPaymentScreen) {
    return null;
  }

  const isCurrentActive = (item) => {
    return item.matches.some((m) => {
      if (m === '/') return location.pathname === '/';
      return location.pathname.startsWith(m);
    });
  };

  return (
    <div className="vp-mobile-dock-wrapper" aria-label="Mobile Navigation Dock">
      <nav className="vp-mobile-dock">
        {DOCK_ITEMS.map((item) => {
          const active = isCurrentActive(item);
          const Icon = item.Icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`vp-dock-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              <span className="vp-dock-icon">
                <Icon active={active} />
              </span>
              {active && <span className="vp-dock-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default UserMobileDock;
