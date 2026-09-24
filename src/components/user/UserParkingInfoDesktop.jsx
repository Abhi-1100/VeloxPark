import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { formatDateTime, formatDuration } from '../../utils/parkingUtils';

/* ─── Vehicle SVG Icons (Matching Mobile Dashboard) ─────────────────────────── */
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

/* ─── Mock Parking Lots Data (matching MapView & Dashboard) ─────────────────── */
const MAP_LOTS = [
  {
    id: '3',
    num: '3',
    price: '₹60',
    top: '18%',
    left: '22%',
    name: 'California Parking',
    zone: 'Zone A - Level 1',
    available: 5,
    distance: '0.8 km',
    rateNum: 60,
  },
  {
    id: '1',
    num: '1',
    price: '₹55',
    top: '14%',
    right: '15%',
    name: 'East Plaza Deck',
    zone: 'Zone B - Level 2',
    available: 8,
    distance: '1.2 km',
    rateNum: 55,
  },
  {
    id: '10',
    num: '10',
    price: '₹45',
    top: '56%',
    right: '18%',
    name: 'South Bay Terminal',
    zone: 'Zone C - Surface Lot',
    available: 14,
    distance: '2.1 km',
    rateNum: 45,
  },
  {
    id: '12',
    num: '12',
    price: '₹50',
    bottom: '14%',
    left: '18%',
    name: 'Metro Central Hub',
    zone: 'Zone D - Underground',
    available: 3,
    distance: '0.4 km',
    rateNum: 50,
  },
];

const UserParkingInfoDesktop = ({
  plateInput,
  setPlateInput,
  loading,
  error,
  vehicleData,
  onSubmit,
  onPayNow,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeVehicle, setActiveVehicle] = useState('car');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [selectedLot, setSelectedLot] = useState(MAP_LOTS[0]);
  const [showRatesModal, setShowRatesModal] = useState(false);

  const name = user?.profile?.name || user?.displayName || 'Test User';
  const initials =
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'TU';

  const isParked = vehicleData?.status === 'Parked';
  const isExited = vehicleData?.status === 'Exited';

  const handleMapSearchSubmit = (e) => {
    e.preventDefault();
    if (mapSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mapSearchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fa',
        color: '#111827',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ─── Floating Landing-Page Style Navbar ───────────────────────────── */}
      {/* ─── Floating Desktop Navbar (Top-Left Logo, Top-Center Nav, Top-Right Profile Circle) ─── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 36px 14px',
          background: 'transparent',
          pointerEvents: 'none',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        {/* Top-Left: Brand Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <div
            onClick={() => navigate('/dashboard')}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(20, 20, 20, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '30px',
              padding: '10px 22px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25)';
            }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '3px',
                color: '#FFFFFF',
              }}
            >
              VELOX<span style={{ color: '#F2C230' }}>.</span>PARK
            </span>
          </div>
        </div>

        {/* Top-Center: Nav Links Capsule */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(20, 20, 20, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            padding: '8px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          }}
        >
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {[
              { label: 'DASHBOARD', path: '/dashboard', active: true },
              { label: 'FIND SPOTS', path: '/search' },
              { label: 'BOOK SLOT', path: '/book' },
              { label: 'LIVE MAP', path: '/map' },
              { label: 'RATES', onClick: () => setShowRatesModal(true) },
              { label: 'HISTORY', path: '/history' },
            ].map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={item.onClick || (() => navigate(item.path))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: item.active ? '#FFD700' : 'rgba(255, 255, 255, 0.65)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    fontFamily: "'Barlow', sans-serif",
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '12px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = item.active
                      ? '#FFD700'
                      : 'rgba(255, 255, 255, 0.65)')
                  }
                >
                  {item.active && (
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#FFD700',
                        boxShadow: '0 0 8px #FFD700',
                      }}
                    />
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Top-Right: Profile Button Circle */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            title={`Logged in as ${name} · Profile Settings`}
            aria-label="User Profile"
            style={{
              pointerEvents: 'auto',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 20, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.borderColor = '#F2C230';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(242, 194, 48, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
            }}
          >
            {user?.profile?.avatar || user?.photoURL ? (
              <img
                src={user?.profile?.avatar || user?.photoURL}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '1px',
                  color: '#F2C230',
                }}
              >
                {initials}
              </span>
            )}
            <span
              style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #141414',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.7)',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ─── Main Content Container ──────────────────────────────────────── */}
      <main
        className="px-4 sm:px-6 lg:px-8"
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          paddingTop: '24px',
          paddingBottom: '48px',
        }}
      >
        {/* ─── Top Banner Section (Hero Title & Live ANPR Indicator) ────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '38px',
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.15,
                margin: '0 0 8px',
                letterSpacing: '-0.025em',
              }}
            >
              Choose a parking place
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '15px', fontWeight: 500 }}>
              Live lot availability, interactive spot reservation & high-speed optical ANPR gate checkout.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '50px',
                color: '#111827',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
              />
              ANPR SENSOR NETWORK ACTIVE
            </div>

            <button
              type="button"
              onClick={() => navigate('/map')}
              style={{
                background: '#F2C230',
                color: '#111827',
                border: 'none',
                borderRadius: '50px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(242, 194, 48, 0.3)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e5b626')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F2C230')}
            >
              <span>Explore All Lots</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ─── Responsive Grid Layout (Single Column on mobile, Two-Column on desktop) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 items-start">
          {/* ══════════════ LEFT COLUMN: Map Card & Vehicle Track ══════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Search Map View Bar (Pill style matching mobile) */}
            <form onSubmit={handleMapSearchSubmit} style={{ margin: 0 }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '50px',
                  padding: '6px 8px 6px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search map view, street, or parking zone..."
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#1c1d21',
                    color: '#F2C230',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Dark Map Card Preview (Enlarged & Interactive for Desktop) */}
            <div
              style={{
                width: '100%',
                height: '340px',
                background: '#1c1d21',
                borderRadius: '28px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(28, 29, 33, 0.2)',
                border: '1px solid #2a2c33',
              }}
            >
              {/* Map SVG Grid */}
              <svg
                viewBox="0 0 540 340"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              >
                <rect width="540" height="340" fill="#1c1d21" />

                {/* City Blocks Layout */}
                <rect x="16" y="16" width="140" height="85" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="180" y="16" width="180" height="85" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="384" y="16" width="140" height="85" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />

                <rect x="16" y="125" width="140" height="90" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="180" y="125" width="180" height="90" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="384" y="125" width="140" height="90" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />

                <rect x="16" y="238" width="140" height="86" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="180" y="238" width="180" height="86" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />
                <rect x="384" y="238" width="140" height="86" rx="8" fill="#25262a" stroke="#2c2d31" strokeWidth="1" />

                {/* Dashed Road Markings */}
                <line x1="168" y1="0" x2="168" y2="340" stroke="#33353b" strokeWidth="3" strokeDasharray="8 8" />
                <line x1="372" y1="0" x2="372" y2="340" stroke="#33353b" strokeWidth="3" strokeDasharray="8 8" />
                <line x1="0" y1="113" x2="540" y2="113" stroke="#33353b" strokeWidth="3" strokeDasharray="8 8" />
                <line x1="0" y1="226" x2="540" y2="226" stroke="#33353b" strokeWidth="3" strokeDasharray="8 8" />
              </svg>

              {/* Interactive Lot Badges */}
              {MAP_LOTS.map((lot) => {
                const isSelected = selectedLot?.id === lot.id;
                const posStyle = {
                  top: lot.top,
                  bottom: lot.bottom,
                  left: lot.left,
                  right: lot.right,
                };
                return (
                  <div
                    key={lot.id}
                    onClick={() => setSelectedLot(lot)}
                    style={{
                      position: 'absolute',
                      ...posStyle,
                      background: isSelected ? '#ffffff' : '#F2C230',
                      color: '#111827',
                      borderRadius: '14px',
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      boxShadow: isSelected
                        ? '0 0 0 3px #F2C230, 0 8px 18px rgba(0,0,0,0.5)'
                        : '0 4px 12px rgba(0,0,0,0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      zIndex: isSelected ? 20 : 10,
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    }}
                  >
                    <span
                      style={{
                        background: isSelected ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.45)',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 900,
                      }}
                    >
                      {lot.num}
                    </span>
                    <span>{lot.price}</span>
                  </div>
                );
              })}

              {/* "You are here" marker with white pill badge (exact mobile design) */}
              <div
                style={{
                  position: 'absolute',
                  top: '46%',
                  left: '36%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              >
                <div style={{ width: '32px', height: '40px', display: 'flex', justifyContent: 'center' }}>
                  <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                    <path
                      d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 20 14 20s14-9.5 14-20C28 6.27 21.73 0 14 0z"
                      fill="#F2C230"
                    />
                    <circle cx="14" cy="14" r="5" fill="#1c1d21" />
                  </svg>
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <circle cx="5" cy="5" r="3" fill="#ec4899" />
                    <path d="M5 12L5 8" stroke="#ec4899" strokeWidth="2" />
                  </svg>
                  You are here
                </div>
              </div>

              {/* Bottom Interactive Quick-Drawer for Selected Lot */}
              {selectedLot && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(28, 29, 33, 0.92)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 25,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        background: '#F2C230',
                        color: '#111827',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontWeight: 900,
                        fontSize: '13px',
                      }}
                    >
                      Lot #{selectedLot.num}
                    </div>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 800 }}>
                        {selectedLot.name}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 500 }}>
                        {selectedLot.zone} • {selectedLot.available} spots available • {selectedLot.distance}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right', marginRight: '6px' }}>
                      <div style={{ color: '#F2C230', fontSize: '16px', fontWeight: 900 }}>
                        {selectedLot.price}
                        <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>/hr</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/book')}
                      style={{
                        background: '#F2C230',
                        color: '#111827',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      Reserve Bay »
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Category Selector Track (Matches Mobile Dashboard) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>
                  Select Vehicle Category
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                  Active filter applied to reservation rates
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}
              >
                {VEHICLES.map(({ id, label, Icon }) => {
                  const isActive = activeVehicle === id;
                  return (
                    <div
                      key={id}
                      onClick={() => setActiveVehicle(id)}
                      style={{
                        background: isActive ? '#1c1d21' : '#ffffff',
                        border: `1.5px solid ${isActive ? '#1c1d21' : '#e5e7eb'}`,
                        borderRadius: '24px',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isActive
                          ? '0 12px 28px rgba(28, 29, 33, 0.2)'
                          : '0 4px 14px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div
                        style={{
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <Icon dark={isActive} />
                      </div>

                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: isActive ? '#ffffff' : '#111827',
                          marginBottom: '16px',
                        }}
                      >
                        {label}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/search');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '16px',
                          background: isActive ? '#F2C230' : '#f4f6fa',
                          color: isActive ? '#111827' : '#6b7280',
                          border: 'none',
                          fontSize: '18px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        »
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════ RIGHT COLUMN: ANPR Telemetry & Checkout ══════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ANPR Vehicle Lookup Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: '#1c1d21',
                      color: '#F2C230',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      search_check
                    </span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Vehicle Telemetry Lookup
                    </h2>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
                      ANPR Camera Sensor Integration
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    background: 'rgba(242, 194, 48, 0.15)',
                    color: '#92400e',
                    border: '1px solid rgba(242, 194, 48, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  LIVE ANPR
                </span>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  lineHeight: 1.5,
                  margin: '0 0 20px',
                }}
              >
                Enter your license plate number to inspect live entry logs, calculate real-time duration, or complete your digital checkout.
              </p>

              {/* Plate Search Form */}
              <form onSubmit={onSubmit} style={{ margin: '0 0 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f9fafb',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '18px',
                    padding: '6px 6px 6px 16px',
                    gap: '10px',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: '#9ca3af', fontSize: '22px' }}
                  >
                    directions_car
                  </span>
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: "'Space Mono', monospace",
                      letterSpacing: '1px',
                    }}
                    placeholder="ENTER VEHICLE NUMBER (e.g. TS15EL5671)"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: '#F2C230',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '12px 24px',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '0.5px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(242, 194, 48, 0.3)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.background = '#e5b626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F2C230';
                    }}
                  >
                    {loading ? 'LOOKING UP...' : 'FIND VEHICLE'}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>

              {/* Status Tags */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  color: '#6b7280',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '0 4px',
                }}
              >
                <span>✓ Optical ANPR Camera Logs</span>
                <span>✓ First 30 Mins Free</span>
                <span>✓ Instant UPI QR</span>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '14px 18px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '16px',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    error
                  </span>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* If Vehicle Data Loaded: Show Session Telemetry & Pay Now */}
            {vehicleData && (
              <div
                style={{
                  background: '#1c1d21',
                  color: '#ffffff',
                  borderRadius: '28px',
                  padding: '28px',
                  boxShadow: '0 16px 40px rgba(28, 29, 33, 0.25)',
                  border: '1px solid #2e3038',
                }}
              >
                {/* Header with Session Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: '#F2C230',
                        marginBottom: '4px',
                      }}
                    >
                      SESSION TELEMETRY
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>
                      {isParked ? 'Active Inside Facility' : 'Exited & Completed'}
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: isParked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(242, 194, 48, 0.18)',
                      color: isParked ? '#10b981' : '#F2C230',
                      border: `1px solid ${
                        isParked ? 'rgba(16, 185, 129, 0.4)' : 'rgba(242, 194, 48, 0.4)'
                      }`,
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isParked ? '#10b981' : '#F2C230',
                      }}
                    />
                    {vehicleData.status.toUpperCase()}
                  </span>
                </div>

                {/* Big Yellow License Plate Display */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      background: '#F2C230',
                      color: '#111827',
                      padding: '12px 32px',
                      borderRadius: '14px',
                      fontSize: '26px',
                      fontWeight: 900,
                      letterSpacing: '3px',
                      boxShadow: '0 8px 24px rgba(242, 194, 48, 0.35)',
                      fontFamily: "'Space Mono', monospace",
                      border: '2px solid #e5b626',
                    }}
                  >
                    {vehicleData.plate}
                  </div>
                </div>

                {/* Session Timestamps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { label: 'Entry Time', value: formatDateTime(vehicleData.entry) },
                    {
                      label: 'Exit Time',
                      value: vehicleData.exit ? formatDateTime(vehicleData.exit) : 'Active Session',
                    },
                    {
                      label: 'Total Duration',
                      value: formatDuration(vehicleData.duration) || 'In Progress',
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                    >
                      <span style={{ color: '#9ca3af' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: '#f3f4f6' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Amount Due or Parked Notification */}
                {isExited ? (
                  <div
                    style={{
                      background: '#25262a',
                      borderRadius: '20px',
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid rgba(242, 194, 48, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: '#9ca3af',
                        marginBottom: '6px',
                      }}
                    >
                      TOTAL AMOUNT DUE
                    </div>
                    <div
                      style={{
                        fontSize: '44px',
                        fontWeight: 900,
                        color: '#F2C230',
                        lineHeight: 1,
                        marginBottom: '16px',
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      ₹{vehicleData.amount || 0}
                    </div>

                    <button
                      type="button"
                      onClick={onPayNow}
                      style={{
                        width: '100%',
                        background: '#F2C230',
                        color: '#111827',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '14px',
                        fontSize: '15px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 20px rgba(242, 194, 48, 0.4)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#e5b626')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#F2C230')}
                    >
                      <span>PROCEED TO PAYMENT</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        arrow_forward
                      </span>
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(242, 194, 48, 0.08)',
                      border: '1px solid rgba(242, 194, 48, 0.25)',
                      borderRadius: '16px',
                      padding: '18px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#F2C230', fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
                      Currently Parked Inside Facility
                    </div>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', lineHeight: 1.5 }}>
                      Vehicle session active. Standard tariff begins after 30 minutes free grace period.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* If No Vehicle Data Loaded: Show Features Grid */}
            {!vehicleData && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}
              >
                {[
                  {
                    icon: 'videocam',
                    title: 'Optical ANPR',
                    desc: 'Real-time vehicle capture at barrier gates.',
                  },
                  {
                    icon: 'timer',
                    title: 'Fair Tariff',
                    desc: 'First 30 minutes free, then ₹20 per hour.',
                  },
                  {
                    icon: 'qr_code_scanner',
                    title: 'Touchless UPI',
                    desc: 'Scan dynamic UPI QR code on your phone.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      padding: '20px 16px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#fef3c7',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {icon}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.4 }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#9ca3af',
                  marginBottom: '14px',
                }}
              >
                QUICK FACILITY SERVICES
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                {[
                  {
                    icon: 'receipt_long',
                    label: 'Parking History',
                    action: () => navigate('/history'),
                  },
                  {
                    icon: 'payments',
                    label: 'Tariff & Rates',
                    action: () => setShowRatesModal(true),
                  },
                  {
                    icon: 'local_parking',
                    label: 'Reserve Slot',
                    action: () => navigate('/book'),
                  },
                  {
                    icon: 'manage_accounts',
                    label: 'Profile & Car',
                    action: () => navigate('/profile'),
                  },
                ].map(({ icon, label, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #f3f4f6',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#f3f4f6';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#F2C230' }}>
                      {icon}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Rates Modal ─────────────────────────────────────────────────── */}
      {showRatesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowRatesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    background: '#1c1d21',
                    color: '#F2C230',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    payments
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>
                  Parking Tariff Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRatesModal(false)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4b5563',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: '#f9fafb',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontWeight: 600, color: '#4b5563' }}>Grace Period (All Vehicles)</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>FREE (First 30 Mins)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontWeight: 600, color: '#4b5563' }}>Two-Wheeler (Bike)</span>
                <span style={{ fontWeight: 800, color: '#111827' }}>₹10 / hr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontWeight: 600, color: '#4b5563' }}>Four-Wheeler (Car)</span>
                <span style={{ fontWeight: 800, color: '#111827' }}>₹20 / hr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontWeight: 600, color: '#4b5563' }}>Heavy Vehicle / Others</span>
                <span style={{ fontWeight: 800, color: '#111827' }}>₹40 / hr</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.5 }}>
              Standard hourly billing applies from the 31st minute onwards. UPI payment receipts are generated automatically upon exit.
            </p>

            <button
              type="button"
              onClick={() => setShowRatesModal(false)}
              style={{
                width: '100%',
                background: '#1c1d21',
                color: '#F2C230',
                border: 'none',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* ─── Clean Desktop Footer ────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid #e5e7eb',
          padding: '24px 32px',
          background: '#ffffff',
          color: '#6b7280',
          fontSize: '13px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            © 2026 <strong>VeloxPark Operating Systems Inc.</strong> All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <span
              onClick={() => setShowRatesModal(true)}
              style={{ cursor: 'pointer', color: '#111827' }}
            >
              Tariff Schedule
            </span>
            <span
              onClick={() => navigate('/history')}
              style={{ cursor: 'pointer', color: '#111827' }}
            >
              Session History
            </span>
            <span
              onClick={() => navigate('/map')}
              style={{ cursor: 'pointer', color: '#111827' }}
            >
              Live Map
            </span>
            <span style={{ color: '#10b981' }}>● Optical ANPR Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserParkingInfoDesktop;
