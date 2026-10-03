import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICEABLE_CITIES } from '../../data/serviceableCities';
import './UnserviceableAreaView.css';

/**
 * UnserviceableAreaView (Velox Signature Light Theme)
 * Redesigned to seamlessly match VeloxPark's clean, modern, warm light theme.
 * Shown when an entered location (e.g. Changa, rural areas, or unsupported towns) is outside coverage,
 * giving users immediate access to active metropolitan smart hubs (Anand, Nadiad, Surat, Ahmedabad, Mumbai, etc.).
 */
const UnserviceableAreaView = ({
  locationName = 'Changa, Gujarat, 388421, India',
  onSelectCity = null,
}) => {
  const navigate = useNavigate();
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [requestedNotification, setRequestedNotification] = useState(false);

  const handleCitySelect = (city) => {
    setShowCityPicker(false);
    if (onSelectCity) {
      onSelectCity(city);
    } else {
      navigate('/map', {
        state: {
          destination: city.name,
          address: `${city.stations[0]?.street || 'Station Rd'}, ${city.name}`,
          location: city.name,
          city: city.shortName,
          lat: city.stations[0]?.lat || city.center.lat,
          lon: city.stations[0]?.lng || city.center.lng,
          station: city.stations[0],
          isServiceable: true,
        },
      });
    }
  };

  const filteredCities = SERVICEABLE_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.state.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.shortName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="unserv-root">
      {/* ── Top Bar ── */}
      <header className="unserv-header">
        <button
          type="button"
          className="unserv-back-btn"
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate('/search');
          }}
          aria-label="Go Back"
          title="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="unserv-header-center">
          <div className="unserv-header-badge">
            <span className="unserv-offline-dot" />
            <span>REGION OFF-GRID</span>
          </div>
          <h1 className="unserv-header-title">Unserviceable Area</h1>
        </div>

        <button
          type="button"
          className="unserv-profile-btn"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          title="User Profile"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </header>

      {/* ── Location Selector Pill ── */}
      <div className="unserv-loc-pill-wrap">
        <button
          type="button"
          className="unserv-loc-pill"
          onClick={() => setShowCityPicker(true)}
          title="Change location"
        >
          <span className="unserv-loc-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </span>
          <span className="unserv-loc-name">{locationName}</span>
          <span className="unserv-loc-caret">▼</span>
        </button>
      </div>

      {/* ── Main Content Area ── */}
      <main className="unserv-scroll-area">
        {/* Hero Card */}
        <section className="unserv-hero-card">
          <div className="unserv-status-pill">
            <span className="unserv-status-dot" />
            <span>Outside VeloxPark Network</span>
          </div>

          <h2 className="unserv-title-big">Smart Nodes Not Deployed Yet</h2>
          <p className="unserv-desc-text">
            VeloxPark automated sensors and smart reservations are not active in this region yet.
            Explore our deployed metropolitan hubs below to reserve verified parking.
          </p>

          {/* ── Clean Vector Illustration Matching App Aesthetic ── */}
          <div className="unserv-stage-wrapper">
            <svg
              viewBox="0 0 400 210"
              className="unserv-stage-svg"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Smart parking terminal offline barrier"
            >
              <defs>
                {/* Barrier hazard stripe pattern */}
                <pattern id="barrier-stripes-light" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="8" height="16" fill="#ef4444" />
                  <rect x="8" width="8" height="16" fill="#ffffff" />
                </pattern>

                {/* Headlight cone gradient */}
                <linearGradient id="unserv-headlight-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#fecb35" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#fecb35" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fecb35" stopOpacity="0" />
                </linearGradient>

                {/* Soft radar sweep */}
                <radialGradient id="unserv-soft-radar" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.16" />
                  <stop offset="80%" stopColor="#ef4444" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Tarmac Canvas */}
              <rect x="0" y="0" width="400" height="210" rx="16" fill="#f1f5f9" />

              {/* Subtle Road Texture Grid */}
              <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6">
                <line x1="0" y1="50" x2="400" y2="50" />
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="150" x2="400" y2="150" />
                <line x1="100" y1="0" x2="100" y2="210" />
                <line x1="300" y1="0" x2="300" y2="210" />
              </g>

              {/* Central White Road Markings */}
              <line x1="200" y1="110" x2="200" y2="210" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="10 8" />

              {/* ── Barrier Gate Column (Left) ── */}
              <rect x="52" y="52" width="26" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
              <circle cx="65" cy="68" r="5" fill="#ef4444" />
              <rect x="58" y="80" width="14" height="20" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
              <text x="65" y="93" textAnchor="middle" fill="#ef4444" fontSize="7.5" fontFamily="-apple-system, sans-serif" fontWeight="800">OFF</text>

              {/* Barrier Gate Column (Right) ── */}
              <rect x="322" y="52" width="26" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
              <circle cx="335" cy="68" r="5" fill="#ef4444" />

              {/* ── Smart Boom Barrier Arm Down ── */}
              <rect x="70" y="74" width="260" height="12" rx="3" fill="url(#barrier-stripes-light)" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.1))" />

              {/* Center Restriced Badge on Barrier */}
              <g transform="translate(142, 66)">
                <rect x="0" y="0" width="116" height="28" rx="6" fill="#1c1d21" stroke="#334155" strokeWidth="1.2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.18))" />
                <circle cx="15" cy="14" r="4.5" fill="#ef4444" />
                <text x="26" y="18" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" letterSpacing="0.8">
                  RESTRICTED
                </text>
              </g>

              {/* Radar Scanner Arc */}
              <ellipse cx="200" cy="86" rx="95" ry="30" fill="url(#unserv-soft-radar)" />

              {/* Ground Warning Reticle */}
              <g stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" fill="none">
                <circle cx="200" cy="132" r="26" />
                <line x1="168" y1="132" x2="232" y2="132" />
                <line x1="200" y1="106" x2="200" y2="158" />
              </g>
              <text x="200" y="136" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="-apple-system, sans-serif" letterSpacing="0.8">
                NO VELOX NODES
              </text>

              {/* ── Signature Yellow Velox Car (Top-Down) ── */}
              <g transform="translate(200, 185)">
                {/* Headlight beams */}
                <polygon points="-12,-20 -26,-62 2,-62 -8,-20" fill="url(#unserv-headlight-grad)" />
                <polygon points="12,-20 26,-62 -2,-62 8,-20" fill="url(#unserv-headlight-grad)" />

                {/* Car Tires */}
                <rect x="-24" y="-14" width="5.5" height="12" rx="2" fill="#1e293b" />
                <rect x="18.5" y="-14" width="5.5" height="12" rx="2" fill="#1e293b" />
                <rect x="-24" y="10" width="5.5" height="12" rx="2" fill="#1e293b" />
                <rect x="18.5" y="10" width="5.5" height="12" rx="2" fill="#1e293b" />

                {/* Car Chassis (Signature Velox Bright Yellow) */}
                <rect x="-19" y="-22" width="38" height="50" rx="9" fill="#fecb35" stroke="#eab308" strokeWidth="1.4" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))" />

                {/* Front Windshield */}
                <path d="M -13,-12 L 13,-12 L 10,7 L -10,7 Z" fill="#1e293b" rx="2" />

                {/* Front Headlight LEDs */}
                <circle cx="-12" cy="-20" r="2.8" fill="#ffffff" filter="drop-shadow(0 0 4px #fecb35)" />
                <circle cx="12" cy="-20" r="2.8" fill="#ffffff" filter="drop-shadow(0 0 4px #fecb35)" />

                {/* Amber Indicators */}
                <circle cx="-16.5" cy="-20" r="1.8" fill="#f59e0b" />
                <circle cx="16.5" cy="-20" r="1.8" fill="#f59e0b" />

                {/* Velox Roof Sensor */}
                <circle cx="0" cy="-2" r="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="0.8" />
                <circle cx="0" cy="-2" r="1.2" fill="#0ea5e9" />
              </g>
            </svg>
          </div>
        </section>

        {/* ── Active Metropolitan Hubs Section ── */}
        <section className="unserv-hubs-section">
          <div className="unserv-hubs-header">
            <div className="unserv-hubs-title-row">
              <span className="unserv-hubs-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fecb35">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" fill="#191c21" />
                </svg>
              </span>
              <span className="unserv-hubs-title">Active Smart Hubs</span>
            </div>
            <span className="unserv-hubs-count-pill">{SERVICEABLE_CITIES.length} Cities Deployed</span>
          </div>

          <div className="unserv-hubs-grid">
            {SERVICEABLE_CITIES.map((city) => {
              const lowestRate = city.stations?.length > 0
                ? Math.min(...city.stations.map((s) => s.rate))
                : 30;

              return (
                <button
                  key={city.id}
                  type="button"
                  className="unserv-hub-card"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="unserv-hub-top">
                    <span className="unserv-hub-name">{city.shortName}</span>
                    <span className="unserv-hub-live-badge">
                      <span className="unserv-green-pulse" />
                      Live
                    </span>
                  </div>

                  <span className="unserv-hub-meta">
                    {city.stations.length} Dedicated Hubs
                  </span>

                  <div className="unserv-hub-bottom">
                    <span className="unserv-hub-rate-pill">From ₹{lowestRate}/h</span>
                    <span className="unserv-hub-arrow-btn">➔</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Quick Action Options ── */}
        <section className="unserv-actions-section">
          {/* Row 1: My Bookings */}
          <div
            className="unserv-action-row"
            onClick={() => navigate('/history')}
            role="button"
            tabIndex={0}
          >
            <div className="unserv-action-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1d21" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="unserv-action-text-col">
              <span className="unserv-action-title">My Bookings & Passes</span>
              <span className="unserv-action-subtitle">View existing slots, tickets, and receipts</span>
            </div>
            <span className="unserv-action-chevron">➔</span>
          </div>

          {/* Row 2: Notify Me */}
          <div
            className="unserv-action-row"
            onClick={() => setRequestedNotification(true)}
            role="button"
            tabIndex={0}
          >
            <div className="unserv-action-icon-wrap" style={{ background: requestedNotification ? '#ecfdf5' : '#f8fafc' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={requestedNotification ? '#10b981' : '#f59e0b'} strokeWidth="2.2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="unserv-action-text-col">
              <span className="unserv-action-title">
                {requestedNotification ? '✓ Expansion Alert Saved!' : 'Notify When Available Here'}
              </span>
              <span className="unserv-action-subtitle">
                {requestedNotification ? 'We will alert you when nodes launch in this zone' : 'Request smart parking deployment in this neighborhood'}
              </span>
            </div>
            <span className="unserv-action-chevron">➔</span>
          </div>
        </section>

        {/* ── Primary Floating Bottom CTA ── */}
        <div className="unserv-cta-container">
          <button
            type="button"
            className="unserv-primary-btn"
            onClick={() => handleCitySelect(SERVICEABLE_CITIES[0])}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" fill="currentColor" />
            </svg>
            <span>Explore Active Network (Anand Hub)</span>
          </button>
        </div>
      </main>

      {/* ── City Switcher Modal Sheet ── */}
      {showCityPicker && (
        <div className="unserv-modal-backdrop" onClick={() => setShowCityPicker(false)}>
          <div className="unserv-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="unserv-modal-grab" />
            <div className="unserv-modal-header">
              <h3 className="unserv-modal-title">Select Active City</h3>
              <button
                type="button"
                className="unserv-modal-close-btn"
                onClick={() => setShowCityPicker(false)}
              >
                ✕
              </button>
            </div>

            <div className="unserv-modal-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
              <input
                type="text"
                className="unserv-modal-input"
                placeholder="Search city (Anand, Surat, Delhi, Mumbai...)"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                autoFocus
              />
            </div>

            <div className="unserv-modal-list">
              {filteredCities.map((c) => (
                <div
                  key={c.id}
                  className="unserv-modal-item"
                  onClick={() => handleCitySelect(c)}
                >
                  <div className="unserv-modal-item-left">
                    <span className="unserv-modal-city-pin">📍</span>
                    <div>
                      <div className="unserv-modal-item-name">{c.name}</div>
                      <div className="unserv-modal-item-meta">{c.state} • {c.stations.length} Active Stations</div>
                    </div>
                  </div>
                  <span className="unserv-modal-item-arrow">➔</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnserviceableAreaView;
