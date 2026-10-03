import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useUserBookings } from '../../hooks/useUserBookings';
import avatarJack from '../../assets/avatar-jack.jpg';
import './SearchLocation.css';
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

function Dashboard({
  plateInput = '',
  setPlateInput,
  loading = false,
  error = '',
  vehicleData = null,
  upiConfig = null,
  onSubmit,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings } = useUserBookings(user?.uid);

  const [activeVehicleId, setActiveVehicleId] = useState('car');
  const [internalPlateInput, setInternalPlateInput] = useState('');
  const [sessionSeconds, setSessionSeconds] = useState(5055); // 01:24:15
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSession, setActiveSession] = useState(null);

  const activePlateText = plateInput !== undefined && plateInput !== '' ? plateInput : internalPlateInput;

  const handlePlateChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInternalPlateInput(val);
    if (setPlateInput) setPlateInput(val);
  };

  const handleVehicleSelect = (veh) => {
    setActiveVehicleId(veh.id);
    if (veh.plate && veh.plate.startsWith('GJ')) {
      setInternalPlateInput(veh.plate);
      if (setPlateInput) setPlateInput(veh.plate);
    }
  };

  const name = user?.profile?.name || user?.displayName || 'Parth Patel';

  // Check if user is currently inside a park station / has active session
  useEffect(() => {
    // 1. Check real bookings for active/parked session
    const parkedBooking = bookings?.find((b) =>
      ['active', 'parked', 'checked-in', 'in-station'].includes(b.status)
    );

    // 2. Check localStorage for session or simulation state
    let localSess = null;
    try {
      const stored = localStorage.getItem('velox_active_session');
      if (stored) {
        localSess = JSON.parse(stored);
      }
      if (!localSess && localStorage.getItem('velox_user_in_station') === 'true') {
        localSess = {
          lotName: 'Charusat Lot 2',
          bay: 'Bay B-14',
          plate: 'GJ 23 AB 1234',
          status: 'parked',
          isParked: true,
        };
      }
    } catch {
      // ignore JSON errors
    }

    if (parkedBooking) {
      setActiveSession({
        lotName: parkedBooking.address || 'Charusat Lot 2',
        bay: parkedBooking.slotLabel || parkedBooking.slotId || 'Bay B-14',
        plate: parkedBooking.plate || 'GJ 23 AB 1234',
        bookingId: parkedBooking.id,
        status: parkedBooking.status,
      });
    } else if (localSess && (localSess.isParked || localSess.status === 'parked')) {
      setActiveSession(localSess);
    } else {
      // Default: User is NOT in the park station -> live session box is hidden
      setActiveSession(null);
    }
  }, [bookings]);

  // Live timer for active session (only counts when user is in park station)
  useEffect(() => {
    if (!activeSession) return undefined;
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  const formatTimer = (totalSec) => {
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const handleSearchFocus = () => {
    navigate('/search', { state: { autoFocus: true, prefill: searchQuery } });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    navigate('/search', { state: { autoFocus: true, prefill: val } });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/search', { state: { autoFocus: true, prefill: searchQuery } });
    }
  };

  const handleLocateClick = (e) => {
    e.stopPropagation();
    navigate('/search', { state: { autoLocate: true } });
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

          {/* Desktop Navigation Links */}
          <nav className="stitch-desktop-nav">
            <button
              type="button"
              className="stitch-desk-nav-link active"
              onClick={() => navigate('/dashboard')}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              className="stitch-desk-nav-link"
              onClick={() => navigate('/search')}
            >
              <span className="material-symbols-outlined">explore</span>
              <span>Find Spots</span>
            </button>
            <button
              type="button"
              className="stitch-desk-nav-link"
              onClick={() => navigate('/map')}
            >
              <span className="material-symbols-outlined">map</span>
              <span>Live Map</span>
            </button>
            <button
              type="button"
              className="stitch-desk-nav-link"
              onClick={() => navigate('/history')}
            >
              <span className="material-symbols-outlined">receipt_long</span>
              <span>History</span>
            </button>
          </nav>

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
          {/* Welcome User Row + FASTag Balance + Live Network Status */}
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

            <div className="stitch-welcome-right">
              <div className="stitch-network-pill">
                <span className="stitch-pulse-dot" />
                <span>ANPR SENSOR NETWORK ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Location Search Bar - Exactly aligned with the Find page */}
          <div className="sl-search-wrap vp-dash-search-wrap">
            <div
              className="sl-search-pill vp-dash-search-pill"
              onClick={handleSearchFocus}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSearchFocus();
                }
              }}
            >
              <span className="material-symbols-outlined sl-search-icon">search</span>
              <input
                type="text"
                className="sl-search-input vp-dash-search-input"
                placeholder="Enter location (e.g. Vallabh Vidyanagar, Anand)"
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search location"
              />
              <button
                type="button"
                className="sl-my-loc-btn"
                onClick={handleLocateClick}
                aria-label="Detect Current Location"
                title="Detect current location and show nearest parking"
              >
                <span className="material-symbols-outlined filled">my_location</span>
              </button>
            </div>
          </div>

          {/* Active Live Session Card (Only visible when user is in park station) */}
          {activeSession && (
            <div className="stitch-session-card">
              <div className="stitch-session-glow" />

              <div className="stitch-session-top">
                <div className="stitch-session-badge-wrap">
                  <span className="stitch-session-live-tag">
                    <span className="stitch-ping-dot" />
                    Live Session
                  </span>
                  <span className="stitch-session-lot">
                    {activeSession.lotName || 'Charusat Lot 2'}
                  </span>
                </div>
                <span className="stitch-session-bay">
                  {activeSession.bay || 'Bay B-14'}
                </span>
              </div>

              <div className="stitch-session-middle">
                {/* Indian HSRP License Plate */}
                <div className="stitch-session-hsrp">
                  <div className="stitch-hsrp-ind-strip">
                    <div className="stitch-hsrp-chakra" />
                    <span className="stitch-hsrp-ind-text">IND</span>
                  </div>
                  <div className="stitch-session-plate-code">
                    {activeSession.plate || 'GJ 23 AB 1234'}
                  </div>
                </div>

                <div className="stitch-session-time-col">
                  <span className="stitch-session-timer">{formatTimer(sessionSeconds)}</span>
                  <span className="stitch-session-cost">
                    Accrued: ₹{activeSession.accruedCost || 45}.00
                  </span>
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
                    onClick={() =>
                      navigate(activeSession.bookingId ? `/booking/${activeSession.bookingId}` : '/booking/active')
                    }
                  >
                    <span className="material-symbols-outlined">qr_code_2</span>
                    <span>Exit Gate</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Desktop/Mobile Content Grid */}
          <div className="stitch-dash-grid">
            {/* Primary Column */}
            <div className="stitch-grid-main">
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

            {/* Sidebar Column (Desktop & Flow) */}
            <div className="stitch-grid-sidebar">
              {/* My Vehicles 3-Column Quick Selector */}
              <div className="stitch-dash-section stitch-vehicles-section">
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
                        onClick={() => handleVehicleSelect(veh)}
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

              {/* ANPR Vehicle Telemetry & Fast Checkout Card (Desktop) */}
              <div className="stitch-telemetry-card">
                <div className="stitch-telemetry-head">
                  <div className="stitch-telemetry-icon-box">
                    <span className="material-symbols-outlined">videocam</span>
                  </div>
                  <div className="stitch-telemetry-head-text">
                    <h3 className="stitch-telemetry-title">Vehicle Telemetry Lookup</h3>
                    <p className="stitch-telemetry-sub">Optical ANPR Gate Sensor Integration</p>
                  </div>
                  <span className="stitch-telemetry-pill">LIVE ANPR</span>
                </div>

                <form
                  onSubmit={onSubmit || ((e) => e.preventDefault())}
                  className="stitch-telemetry-form"
                >
                  <div className="stitch-telemetry-input-wrap">
                    <span className="material-symbols-outlined car-icon">directions_car</span>
                    <input
                      type="text"
                      className="stitch-telemetry-input"
                      placeholder="ENTER VEHICLE NUMBER (e.g. GJ 23 AB 1234)"
                      value={activePlateText}
                      onChange={handlePlateChange}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="stitch-telemetry-submit-btn"
                    >
                      {loading ? (
                        <span>Checking...</span>
                      ) : (
                        <>
                          <span>Find Vehicle</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {error && <p className="stitch-telemetry-error">{error}</p>}

                {vehicleData && (
                  <div className="stitch-telemetry-result">
                    <div className="stitch-result-status-row">
                      <span className="stitch-result-lbl">Active Telemetry</span>
                      <span
                        className={`stitch-status-badge ${
                          vehicleData.status === 'Parked' ? 'parked' : 'exited'
                        }`}
                      >
                        <span className="dot" />
                        {vehicleData.status === 'Parked'
                          ? 'Inside Facility (Parked)'
                          : 'Exited & Ready for Payment'}
                      </span>
                    </div>

                    <div className="stitch-hsrp-display">
                      <div className="stitch-hsrp-ind-strip">
                        <div className="stitch-hsrp-chakra" />
                        <span className="stitch-hsrp-ind-text">IND</span>
                      </div>
                      <span className="stitch-hsrp-number">{vehicleData.plate}</span>
                    </div>

                    <div className="stitch-result-metrics">
                      <div className="metric-box">
                        <span className="metric-lbl">Duration</span>
                        <span className="metric-val">
                          {vehicleData.duration?.totalMinutes
                            ? `${Math.floor(vehicleData.duration.totalMinutes / 60)}h ${
                                vehicleData.duration.totalMinutes % 60
                              }m`
                            : 'In Progress'}
                        </span>
                      </div>
                      <div className="metric-box">
                        <span className="metric-lbl">Accrued Amount</span>
                        <span className="metric-val highlight">
                          ₹{vehicleData.amount != null ? vehicleData.amount : 40}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '13px', fontWeight: 700, marginTop: '12px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                      <span>Exit Recorded · Session Finalized</span>
                    </div>
                  </div>
                )}

                <div className="stitch-telemetry-badges">
                  <div className="badge-item">
                    <span className="material-symbols-outlined check-icon">check_circle</span>
                    <span>Optical ANPR Camera Logs</span>
                  </div>
                  <div className="badge-item">
                    <span className="material-symbols-outlined check-icon">check_circle</span>
                    <span>First 30 Mins Free</span>
                  </div>
                  <div className="badge-item">
                    <span className="material-symbols-outlined check-icon">check_circle</span>
                    <span>Instant UPI Checkout</span>
                  </div>
                </div>
              </div>

              {/* Anand Smart Infrastructure Grid Card */}
              <div className="stitch-network-card">
                <div className="stitch-network-card-inner">
                  <div className="stitch-net-icon">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <div>
                    <h4 className="stitch-net-title">Gujarat Central Smart Grid</h4>
                    <p className="stitch-net-sub">
                      FASTag synchronized across Charusat & Anand parking network with zero gate latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
