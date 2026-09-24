import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useUserBookings } from '../../hooks/useUserBookings';
import './History.css';

/* ─── Vector SVG Icons ─────────────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.8 2 11v5c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, loading } = useUserBookings(user?.uid);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const matchFrom = !from || (booking.date && booking.date >= from);
      const matchTo = !to || (booking.date && booking.date <= to);
      return matchFrom && matchTo && !['reserved', 'active'].includes(booking.status);
    });
  }, [bookings, from, to]);

  const totalSpent = useMemo(() => {
    return filtered.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  }, [filtered]);

  const hasActiveFilters = Boolean(from || to);

  return (
    <div className="hist-page">
      <div className="hist-shell">
        
        {/* Top Bar Header */}
        <header className="hist-top-bar">
          <button
            type="button"
            className="hist-nav-btn"
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
          >
            <IconArrowLeft />
          </button>

          <h1 className="hist-top-title">Parking History</h1>

          <button
            type="button"
            className="hist-nav-btn"
            onClick={() => {
              if (hasActiveFilters) {
                setFrom('');
                setTo('');
              } else {
                setShowFilters((prev) => !prev);
              }
            }}
            title={hasActiveFilters ? 'Clear Filters' : 'Toggle Date Filters'}
            aria-label={hasActiveFilters ? 'Clear Filters' : 'Toggle Date Filters'}
          >
            {hasActiveFilters ? <IconClose /> : <IconFilter />}
          </button>
        </header>

        {/* Total Spend Summary Card */}
        <div className="hist-spend-card">
          <div className="hist-spend-left">
            <div className="hist-spend-icon">
              <IconWallet />
            </div>
            <div className="hist-spend-meta">
              <span className="hist-spend-label">Total Past Spend</span>
              <span className="hist-spend-amount">₹{totalSpent.toFixed(2)}</span>
            </div>
          </div>
          <div className="hist-spend-badge">
            {filtered.length} {filtered.length === 1 ? 'Session' : 'Sessions'}
          </div>
        </div>

        {/* Date Filter Card (Shown on toggle or when active filters exist) */}
        {(showFilters || hasActiveFilters) && (
          <div className="hist-filter-card">
            <div className="hist-filter-header">
              <span className="hist-filter-title">Filter by Date</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="hist-reset-btn"
                  onClick={() => {
                    setFrom('');
                    setTo('');
                  }}
                >
                  Reset ✕
                </button>
              )}
            </div>

            <div className="hist-dates-grid">
              <div className="hist-date-box">
                <label htmlFor="hist-from" className="hist-date-label">From Date</label>
                <input
                  id="hist-from"
                  type="date"
                  className="hist-date-input"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              <div className="hist-date-box">
                <label htmlFor="hist-to" className="hist-date-label">To Date</label>
                <input
                  id="hist-to"
                  type="date"
                  className="hist-date-input"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="hist-section-header">
          <span className="hist-section-title">Past Sessions</span>
          <span className="hist-count-text">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* History Booking List */}
        {loading ? (
          <div className="hist-loading-wrap">
            <div className="hist-spinner" />
            <span>Loading history...</span>
          </div>
        ) : filtered.length ? (
          <div className="hist-list">
            {filtered.map((booking) => {
              const statusClass = (booking.status || 'completed').toLowerCase();
              return (
                <div key={booking.id} className="hist-card">
                  <div className="hist-card-top">
                    <div className="hist-card-title-wrap">
                      <h3 className="hist-slot-name">
                        <IconCar />
                        {booking.lotName || (booking.slotLabel ? `Slot ${booking.slotLabel}` : booking.slotId ? `Slot ${booking.slotId}` : 'Parking Slot')}
                      </h3>
                      <p className="hist-session-date">
                        {booking.date || 'Past Session'} • {booking.duration || 0} mins
                      </p>
                    </div>
                    <span className={`hist-status-pill ${statusClass}`}>
                      {booking.status || 'Completed'}
                    </span>
                  </div>

                  <div className="hist-time-strip">
                    <div className="hist-time-col">
                      <span className="hist-time-sub">Entry Time</span>
                      <span className="hist-time-val">{booking.entryTime || '—'}</span>
                    </div>
                    <span className="hist-time-arrow">→</span>
                    <div className="hist-time-col" style={{ textAlign: 'right' }}>
                      <span className="hist-time-sub">Exit Time</span>
                      <span className="hist-time-val">{booking.exitTime || '—'}</span>
                    </div>
                  </div>

                  <div className="hist-card-bottom">
                    <span className="hist-amount-label">Settled Amount</span>
                    <span className="hist-amount-val">
                      ₹{Number(booking.amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="hist-empty-card">
            <div className="hist-empty-icon">
              <IconCalendar />
            </div>
            <h3 className="hist-empty-title">No Past Sessions</h3>
            <p className="hist-empty-desc">
              {hasActiveFilters
                ? 'No past bookings found matching the selected dates.'
                : 'All your completed and past parking sessions will appear here.'}
            </p>
            <button
              type="button"
              className="hist-empty-btn"
              onClick={() => navigate('/search')}
            >
              Find Parking
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default History;
