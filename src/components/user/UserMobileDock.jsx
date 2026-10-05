import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserMobileDock.css';

const DOCK_ITEMS = [
  { id: 'home', label: 'Home', path: '/dashboard', matches: ['/dashboard', '/user'], icon: 'home' },
  { id: 'find', label: 'Find', path: '/search', matches: ['/search', '/book'], icon: 'search' },
  { id: 'bookings', label: 'Bookings', path: '/history', matches: ['/history'], icon: 'event_available' },
  { id: 'profile', label: 'Profile', path: '/profile', matches: ['/profile'], icon: 'person' },
];

const UserMobileDock = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide dock on payment checkout screens and map screen to match UI screenshot
  const isPaymentScreen =
    location.pathname.includes('/pay') ||
    location.pathname.includes('/payment') ||
    location.pathname.includes('/confirm') ||
    location.pathname === '/map';

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

          return (
            <button
              key={item.id}
              type="button"
              className={`vp-dock-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span className={`material-symbols-outlined vp-dock-icon ${active ? 'filled' : ''}`}>
                {item.icon}
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
