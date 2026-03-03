import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      {/* Top Navigation Bar */}
      <header className="notfound-header">
        <div className="notfound-header-left">
          <div className="notfound-icon">
            <span className="material-symbols-outlined">local_parking</span>
          </div>
          <h2 className="notfound-title">Smart Parking Admin</h2>
        </div>
        <div className="notfound-header-right">
          <nav className="notfound-nav">
            <a href="/" className="notfound-nav-link">Dashboard</a>
            <a href="/admin" className="notfound-nav-link">Map</a>
            <a href="/admin/analytics" className="notfound-nav-link">Analytics</a>
            <a href="/admin/settings" className="notfound-nav-link">Settings</a>
          </nav>
          <div className="notfound-actions">
            <button className="notfound-action-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="notfound-action-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="notfound-main">
        {/* Background Immersive Visual */}
        <div className="notfound-background">
          <div className="notfound-background-image"></div>
          <div className="notfound-background-gradient"></div>
        </div>

        {/* Floating Dust Particles */}
        <div className="notfound-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        {/* Center Content */}
        <div className="notfound-content">
          {/* Large Glitch 404 */}
          <div className="notfound-number-wrapper">
            <h1 className="notfound-number">404</h1>
            <div className="notfound-glow"></div>
          </div>

          {/* Error Title */}
          <div className="notfound-message">
            <h2 className="notfound-heading">
              Parking Space <span className="notfound-highlight">Not Found</span>
            </h2>
            <p className="notfound-description">
              Looks like you took a wrong turn or this slot is currently under maintenance.
              The sensor network cannot locate the requested coordinates.
            </p>
          </div>

          {/* Neon 'X' On Floor Visual */}
          <div className="notfound-symbol-wrapper">
            <div className="notfound-symbol-glow"></div>
            <div className="notfound-symbol">
              <span className="material-symbols-outlined notfound-x">add</span>
            </div>
            <p className="notfound-zone-text">Zone Restricted</p>
          </div>

          {/* Navigation Button */}
          <button
            onClick={() => navigate('/')}
            className="notfound-back-btn"
          >
            <span className="material-symbols-outlined">turn_left</span>
            NAVIGATE BACK TO DASHBOARD
            <div className="notfound-corner notfound-corner-tr"></div>
            <div className="notfound-corner notfound-corner-bl"></div>
          </button>
        </div>

        {/* System Footer Info */}
        <div className="notfound-footer">
          <div className="notfound-footer-item">
            <span className="notfound-error-dot"></span>
            System Error: 0x882
          </div>
          <div className="notfound-divider"></div>
          <a href="#" className="notfound-footer-link">Emergency Protocol</a>
          <div className="notfound-divider"></div>
          <a href="#" className="notfound-footer-link">Contact Dispatch</a>
        </div>

        {/* Scanning Line Effect */}
        <div className="notfound-scanline"></div>
      </main>
    </div>
  );
}

export default NotFound;
