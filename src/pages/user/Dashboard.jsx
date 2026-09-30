import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import avatarJack from '../../assets/avatar-jack.jpg';
import './Dashboard.css';

const QUICK_ACTIONS = [
  { id: 'find', label: 'Find Spot Nearby', icon: 'explore', iconClass: 'text-secondary', path: '/search' },
  { id: 'book', label: 'Pre-book Slot', icon: 'event_available', iconClass: 'text-success', path: '/search' },
  { id: 'ev', label: 'EV Charging', icon: 'electric_bolt', iconClass: 'text-secondary', path: '/map' },
  { id: 'passes', label: 'My Passes', icon: 'confirmation_number', iconClass: 'text-muted', path: '/history' },
];

const INITIAL_VEHICLES = [
  { id: 'car', type: 'Car (SUV)', plate: 'GJ 23 AB 1234', icon: 'directions_car', tag: 'Active' },
  { id: 'bike', type: 'Activa 6G', plate: 'GJ 23 BK 9920', icon: 'two_wheeler', tag: 'Saved' },
  { id: 'ev', type: 'Nexon EV', plate: 'Fast-charge ready', icon: 'ev_station', tag: 'EV' },
];

const NEARBY_HUBS = [
  {
    id: 'hub_1',
    name: 'Amul Dairy Road Hub',
    dist: '0.8 km',
    slots: '8 slots left',
    rate: 40,
    tags: ['Fast Gate', 'ANPR'],
    icon: 'local_parking',
    address: 'Amul Dairy Rd, Anand, Gujarat',
  },
  {
    id: 'hub_2',
    name: 'Bhaikaka Statue Ground',
    dist: '1.4 km',
    slots: '18 slots left',
    rate: 30,
    tags: ['Covered', '60kW EV'],
    icon: 'ev_station',
    address: 'Bhaikaka Marg, Vallabh Vidyanagar',
  },
  {
    id: 'hub_3',
    name: 'Vallabh Vidyanagar Central',
    dist: '2.1 km',
    slots: '25 slots left',
    rate: 25,
    tags: ['Multi-level', 'CCTV'],
    icon: 'apartment',
    address: 'Station Rd, VV Nagar, Anand',
  },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeVehicleId, setActiveVehicleId] = useState('car');
  const [sessionSeconds, setSessionSeconds] = useState(5055); // 01:24:15
  const [toast, setToast] = useState('');

  const name = user?.profile?.name || user?.displayName || 'Parth Patel';

  // Live timer for active session
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const handleReserveHub = (hub) => {
    navigate('/map', {
      state: {
        station: {
          name: hub.name,
          address: hub.address,
          pricePerHour: hub.rate,
          distance: parseFloat(hub.dist),
        },
        destination: hub.name,
        address: hub.address,
        durationHours: 2,
        amount: hub.rate * 2,
        openPopup: true,
      },
    });
  };

  return (
    <div className="stitch-dash-root">
      {/* Top Fixed Header */}
      <header className="stitch-dash-header">
        <div className="stitch-dash-header-inner">
          <div className="stitch-dash-brand" onClick={() => navigate('/dashboard')}>
            <div className="stitch-brand-logo-icon">P</div>
            <div className="stitch-brand-titles">
              <span className="stitch-brand-heading">
                Velox<span className="gold-text">Park</span>
              </span>
              <span className="stitch-brand-tagline">Smart Anand</span>
            </div>
          </div>

          <div className="stitch-dash-actions">
            <button
              type="button"
              className="stitch-bell-btn"
              onClick={() => alert('FASTag auto-verification synced across Anand Network')}
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="stitch-bell-dot" />
            </button>
            <button
              type="button"
              className="stitch-dash-avatar-btn"
              onClick={() => navigate('/profile')}
              aria-label="Profile"
            >
              <img src={avatarJack} alt={name} className="stitch-dash-avatar-img" />
              <span className="stitch-online-dot" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="stitch-dash-main">
        <div className="stitch-dash-container">
          {/* Welcome User Row + FASTag Balance */}
          <div className="stitch-welcome-row">
            <div className="stitch-welcome-left">
              <div className="stitch-welcome-greeting">
                <h1 className="stitch-welcome-name">Hi, {name}</h1>
                <span className="stitch-wave">👋</span>
              </div>
              <div className="stitch-welcome-location">
                <span className="material-symbols-outlined loc-arrow">near_me</span>
                <span>Anand, Gujarat • Charusat Hub</span>
              </div>
            </div>

            <div className="stitch-fastag-pill">
              <span className="material-symbols-outlined wallet-icon">account_balance_wallet</span>
              <div className="stitch-fastag-text">
                <span className="stitch-fastag-lbl">FASTag</span>
                <span className="stitch-fastag-amt">₹420</span>
              </div>
            </div>
          </div>

          {/* Active Live Session Card (Prominent Dark Gradient) */}
          <div className="stitch-session-card">
            <div className="stitch-session-glow" />

            <div className="stitch-session-top">
              <div className="stitch-session-badge-wrap">
                <span className="stitch-session-live-tag">
                  <span className="stitch-ping-dot" />
                  Live Session
                </span>
                <span className="stitch-session-lot">Charusat Lot 2</span>
              </div>
              <span className="stitch-session-bay">Bay B-14</span>
            </div>

            <div className="stitch-session-middle">
              {/* Indian HSRP License Plate */}
              <div className="stitch-session-hsrp">
                <div className="stitch-hsrp-ind-strip">
                  <div className="stitch-hsrp-chakra" />
                  <span className="stitch-hsrp-ind-text">IND</span>
                </div>
                <div className="stitch-session-plate-code">GJ 23 AB 1234</div>
              </div>

              <div className="stitch-session-time-col">
                <span className="stitch-session-timer">{formatTimer(sessionSeconds)}</span>
                <span className="stitch-session-cost">Accrued: ₹45.00</span>
              </div>
            </div>

            <div className="stitch-session-bottom">
              <div className="stitch-session-anpr">
                <span className="material-symbols-outlined verified-icon">verified</span>
                <span>ANPR Auto-Exit Active</span>
              </div>

              <div className="stitch-session-btns">
                <button
                  type="button"
                  className="stitch-session-extend-btn"
                  onClick={() => alert('Session extended by 1 hour')}
                >
                  Extend
                </button>
                <button
                  type="button"
                  className="stitch-session-exit-btn"
                  onClick={() => navigate('/booking/active')}
                >
                  <span className="material-symbols-outlined">qr_code_2</span>
                  <span>Exit Gate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Carousel */}
          <div className="stitch-actions-carousel">
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="stitch-action-chip"
                onClick={() => navigate(item.path)}
              >
                <span className={`material-symbols-outlined ${item.iconClass}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* My Vehicles 3-Column Quick Selector */}
          <div className="stitch-dash-section">
            <div className="stitch-dash-sec-head">
              <span className="stitch-dash-sec-title">My Vehicles</span>
              <button
                type="button"
                className="stitch-add-veh-link"
                onClick={() => navigate('/profile')}
              >
                + Add New
              </button>
            </div>

            <div className="stitch-vehicles-grid">
              {INITIAL_VEHICLES.map((veh) => {
                const isActive = activeVehicleId === veh.id;
                return (
                  <button
                    key={veh.id}
                    type="button"
                    className={`stitch-veh-box ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveVehicleId(veh.id)}
                  >
                    <div className="stitch-veh-box-top">
                      <div className="stitch-veh-icon-bg">
                        <span className="material-symbols-outlined filled">{veh.icon}</span>
                      </div>
                      <span className={`stitch-veh-tag ${isActive ? 'active' : ''}`}>
                        {veh.tag}
                      </span>
                    </div>
                    <div className="stitch-veh-box-info">
                      <span className="stitch-veh-box-type">{veh.type}</span>
                      <span className="stitch-veh-box-plate">{veh.plate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Radar Map Teaser Card */}
          <div className="stitch-radar-card">
            <div className="stitch-radar-map-area" onClick={() => navigate('/map')}>
              <svg className="stitch-radar-svg" viewBox="0 0 390 180" fill="none">
                <rect width="390" height="180" fill="#E9EEF4" />
                <path
                  d="M-10 10 C30 20, 60 5, 110 30 C130 40, 120 85, 80 95 C40 105, -5 70, -10 10 Z"
                  fill="#D9E9DA"
                />
                <path
                  d="M290 110 C330 90, 380 115, 410 100 L410 190 L270 190 C265 150, 275 120, 290 110 Z"
                  fill="#DCE8DA"
                />
                <path d="M-20 45 L410 45" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M-20 135 L410 135" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
                <path d="M90 -10 L140 190" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
                <path d="M250 -10 L230 190" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M140 45 L320 170" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                <path d="M-10 90 Q120 80, 200 110 T410 85" stroke="#FFFFFF" strokeWidth="12" />
                <path
                  d="M-10 90 Q120 80, 200 110 T410 85"
                  stroke="#F5C32C"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                />
                <text fill="#77767B" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="700" x="18" y="30">
                  CHARUSAT HIGHWAY
                </text>
                <text fill="#77767B" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="700" x="240" y="165">
                  V.V. NAGAR CIRCLE
                </text>
              </svg>

              {/* Floating Explore Live Map Pill */}
              <div className="stitch-radar-explore-pill">
                <span>Explore Live Map</span>
                <span className="material-symbols-outlined">north_east</span>
              </div>

              {/* Price Badges */}
              <div className="stitch-radar-price-pin p1">
                <span>₹60</span>
              </div>
              <div className="stitch-radar-price-pin p2">
                <span>₹30</span>
              </div>
              <div className="stitch-radar-price-pin p3">
                <span>₹45</span>
              </div>

              {/* Central Pulsing Parking Marker */}
              <div className="stitch-radar-center-marker">
                <span className="stitch-radar-ping-halo" />
                <div className="stitch-radar-marker-circle">
                  <span className="material-symbols-outlined filled">local_parking</span>
                </div>
              </div>
            </div>

            {/* Radar Footer Status */}
            <div className="stitch-radar-footer">
              <div className="stitch-radar-slots-left">
                <span className="stitch-radar-green-dot" />
                <div>
                  <span className="stitch-radar-slot-title">12 free slots nearby</span>
                  <span className="stitch-radar-slot-sub">84% capacity reached in area</span>
                </div>
              </div>

              <span className="stitch-radar-live-tag">
                <span className="material-symbols-outlined">update</span>
                Live Radar
              </span>
            </div>
          </div>

          {/* Nearby Parking Hubs List */}
          <div className="stitch-dash-section">
            <div className="stitch-dash-sec-head">
              <div className="stitch-sec-title-left">
                <h2 className="stitch-dash-sec-title">Nearby Parking Hubs</h2>
                <span className="stitch-hubs-count-pill">3 Anand Lots</span>
              </div>
              <button
                type="button"
                className="stitch-view-all-link"
                onClick={() => navigate('/search')}
              >
                <span>View all</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="stitch-hubs-list">
              {NEARBY_HUBS.map((hub) => (
                <div key={hub.id} className="stitch-hub-card">
                  <div className="stitch-hub-left">
                    <div className="stitch-hub-icon-wrap">
                      <span className="material-symbols-outlined">{hub.icon}</span>
                    </div>
                    <div className="stitch-hub-info">
                      <h3 className="stitch-hub-name">{hub.name}</h3>
                      <div className="stitch-hub-meta">
                        <span>{hub.dist}</span>
                        <span>•</span>
                        <span className="stitch-hub-slots-highlight">{hub.slots}</span>
                      </div>
                      <div className="stitch-hub-tags">
                        {hub.tags.map((tag, tIdx) => (
                          <span
                            key={tag}
                            className={`stitch-hub-tag ${tIdx === 1 ? 'accent' : ''}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="stitch-hub-right">
                    <span className="stitch-hub-rate">
                      ₹{hub.rate}
                      <small>/hr</small>
                    </span>
                    <button
                      type="button"
                      className="stitch-hub-reserve-btn"
                      onClick={() => handleReserveHub(hub)}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
