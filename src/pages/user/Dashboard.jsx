import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Dashboard.css';

/* ─── Vehicle Icons ──────────────────────────────────────────────────────── */
function VanSVG({ dark }) {
  const body = dark ? '#e0e5eb' : '#a2b1c2';
  const wheels = dark ? '#fff' : '#6b7b8c';
  return (
    <svg width="72" height="44" viewBox="0 0 90 56" fill="none">
      <rect x="8" y="16" width="66" height="28" rx="6" fill={body} />
      <rect x="8" y="22" width="22" height="16" rx="3" fill="#6b7b8c" opacity="0.4" />
      <rect x="46" y="16" width="28" height="28" rx="4" fill={body} opacity="0.8" />
      <circle cx="20" cy="46" r="7" fill={wheels} stroke="#222" strokeWidth="3" />
      <circle cx="68" cy="46" r="7" fill={wheels} stroke="#222" strokeWidth="3" />
    </svg>
  );
}

function CarSVG({ dark }) {
  const body = dark ? '#e0e5eb' : '#a2b1c2';
  const roof = dark ? '#cdd6e0' : '#8c9ead';
  const wheels = dark ? '#fff' : '#6b7b8c';
  return (
    <svg width="72" height="44" viewBox="0 0 90 56" fill="none">
      <rect x="12" y="20" width="66" height="22" rx="5" fill={body} />
      <rect x="18" y="10" width="54" height="20" rx="5" fill={roof} />
      <rect x="22" y="12" width="20" height="13" rx="3" fill="#6b7b8c" opacity="0.4" />
      <rect x="48" y="12" width="20" height="13" rx="3" fill="#6b7b8c" opacity="0.4" />
      <circle cx="22" cy="44" r="8" fill={wheels} stroke="#222" strokeWidth="3" />
      <circle cx="68" cy="44" r="8" fill={wheels} stroke="#222" strokeWidth="3" />
    </svg>
  );
}

function BikeSVG({ dark }) {
  const stroke = dark ? '#e0e5eb' : '#8c9ead';
  return (
    <svg width="72" height="44" viewBox="0 0 90 58" fill="none">
      <circle cx="20" cy="38" r="14" stroke={stroke} strokeWidth="4" fill="none" />
      <circle cx="70" cy="38" r="14" stroke={stroke} strokeWidth="4" fill="none" />
      <circle cx="20" cy="38" r="4" fill={stroke} />
      <circle cx="70" cy="38" r="4" fill={stroke} />
      <polyline points="20,38 45,18 70,38" stroke={stroke} strokeWidth="4" fill="none" />
      <rect x="40" y="12" width="10" height="8" rx="2" fill={stroke} />
    </svg>
  );
}

const VEHICLES = [
  { id: 'others', label: 'Others', Icon: VanSVG },
  { id: 'car', label: 'Car', Icon: CarSVG },
  { id: 'bike', label: 'Bike', Icon: BikeSVG },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeVehicle, setActiveVehicle] = useState('car');

  const name = user?.profile?.name || user?.displayName || 'Test User';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TU';

  return (
    <div className="dash-page">
      <div className="dash-shell">

        {/* Header */}
        <div className="dash-header">
          <div className="dash-user-info">
            <h2 className="dash-user-name">{name}</h2>
            <div className="dash-zone">
              <svg width="10" height="12" viewBox="0 0 24 24" fill="#F2C230">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              VeloxPark Zone
            </div>
          </div>

          <button className="dash-profile-btn" onClick={() => navigate('/profile')}>
            {initials}
          </button>
        </div>

        {/* Hero Title */}
        <h1 className="dash-title">
          Choose<br />a parking place
        </h1>

        {/* Dark Map Card Preview */}
        <div
          className="dash-map-card"
          onClick={() => navigate('/search')}
        >
          <svg className="dash-map-svg" viewBox="0 0 340 190" preserveAspectRatio="none">
            <rect width="340" height="190" fill="#1c1d21" />
            {/* Dark city blocks layout */}
            <rect x="8" y="10" width="85" height="50" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="105" y="10" width="105" height="50" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="222" y="10" width="110" height="50" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />

            <rect x="8" y="70" width="85" height="48" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="105" y="70" width="105" height="48" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="222" y="70" width="110" height="48" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />

            <rect x="8" y="128" width="85" height="52" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="105" y="128" width="105" height="52" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />
            <rect x="222" y="128" width="110" height="52" rx="6" fill="#25262a" stroke="#2c2d31" strokeWidth="0.8" />

            {/* Dashed roads */}
            <line x1="99" y1="0" x2="99" y2="190" stroke="#33353b" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="216" y1="0" x2="216" y2="190" stroke="#33353b" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="64" x2="340" y2="64" stroke="#33353b" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="122" x2="340" y2="122" stroke="#33353b" strokeWidth="2" strokeDasharray="6 6" />
          </svg>

          {/* Yellow Lot Badges */}
          <div className="dash-map-pin" style={{ top: '15%', left: '22%' }}>
            <span className="dash-map-pin-num">3</span>
            <span>₹60</span>
          </div>

          <div className="dash-map-pin" style={{ top: '12%', right: '15%' }}>
            <span className="dash-map-pin-num">1</span>
            <span>₹55</span>
          </div>

          <div className="dash-map-pin" style={{ top: '56%', right: '18%' }}>
            <span className="dash-map-pin-num">10</span>
            <span>₹45</span>
          </div>

          <div className="dash-map-pin" style={{ bottom: '12%', left: '18%' }}>
            <span className="dash-map-pin-num">12</span>
            <span>₹50</span>
          </div>

          {/* "You are here" marker with white pill badge */}
          <div className="dash-here-wrap" style={{ top: '44%', left: '36%' }}>
            <div className="dash-here-marker">
              <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 20 14 20s14-9.5 14-20C28 6.27 21.73 0 14 0z" fill="#F2C230" />
                <circle cx="14" cy="14" r="5" fill="#1c1d21" />
              </svg>
            </div>
            <div className="dash-here-pill">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <circle cx="5" cy="5" r="3" fill="#ec4899" />
                <path d="M5 12L5 8" stroke="#ec4899" strokeWidth="2" />
              </svg>
              You are here
            </div>
          </div>
        </div>

        {/* Search Map View Pill Button */}
        <button className="dash-search-bar" onClick={() => navigate('/search')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search map view
        </button>

        {/* Vehicle Carousel */}
        <div className="dash-v-track">
          {VEHICLES.map(({ id, label, Icon }) => {
            const isActive = activeVehicle === id;
            return (
              <div
                key={id}
                className={`dash-v-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveVehicle(id)}
              >
                <div className="dash-v-icon">
                  <Icon dark={isActive} />
                </div>
                <div className="dash-v-name">{label}</div>
                <button
                  className="dash-v-btn"
                  onClick={(e) => { e.stopPropagation(); navigate('/search'); }}
                >
                  »
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
