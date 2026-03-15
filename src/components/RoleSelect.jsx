import { useNavigate } from 'react-router-dom';
import './RoleSelect.css';

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="rs-root">
      {/* Ambient glow blobs */}
      <div className="rs-glow rs-glow-tl" aria-hidden="true" />
      <div className="rs-glow rs-glow-br" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="rs-grid-overlay" aria-hidden="true" />

      <div className="rs-wrap">
        {/* Header */}
        <div className="rs-header">
          <button
            className="rs-back-btn"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            Back
          </button>
          <div className="rs-logo">V.PARK</div>
        </div>

        {/* Title */}
        <div className="rs-title-block">
          <div className="rs-badge">Select Access Mode</div>
          <h1 className="rs-title">
            HOW WILL<br />
            YOU <span className="rs-title-accent">CONNECT?</span>
          </h1>
          <p className="rs-subtitle">
            Choose your role to access the VeloxPark operating system.
          </p>
        </div>

        {/* Cards */}
        <div className="rs-cards">
          {/* Admin Card */}
          <button className="rs-card rs-card-admin" onClick={() => navigate('/admin')}>
            <div className="rs-card-num">01</div>
            <div className="rs-card-icon">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="rs-card-title">Admin</h2>
            <p className="rs-card-desc">
              Manage parking facilities, monitor analytics, configure system settings, and oversee operations.
            </p>
            <div className="rs-card-tags">
              <span>Dashboard</span>
              <span>Analytics</span>
              <span>Settings</span>
            </div>
            <div className="rs-card-cta">
              Access Admin Portal
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* User Card */}
          <button className="rs-card rs-card-user" onClick={() => navigate('/user')}>
            <div className="rs-card-num">02</div>
            <div className="rs-card-icon">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="rs-card-title">User</h2>
            <p className="rs-card-desc">
              Find parking spots, book sessions, manage payments, and track your parking history in real-time.
            </p>
            <div className="rs-card-tags">
              <span>Book Spot</span>
              <span>Payments</span>
              <span>History</span>
            </div>
            <div className="rs-card-cta">
              Enter User Portal
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="rs-footer">
          <span className="rs-footer-dot" />
          <p>VeloxPark OS v4.0 — All connections encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
