import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchLocation.css';

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

const POPULAR_HUBS = [
  { name: 'California Parking', addr: '1484 Nostrand Ave, Brooklyn', dist: '12 km', rate: '₹60/hr', spots: '5 slots' },
  { name: 'South Bay Terminal', addr: '320 Atlantic Ave, Brooklyn', dist: '15 km', rate: '₹45/hr', spots: '14 slots' },
  { name: 'Metro Central Hub', addr: '710 Fulton St, Brooklyn', dist: '5 km', rate: '₹50/hr', spots: '3 slots' },
];

function parseTimeToMinutes(t) {
  if (!t) return 0;
  const [time, period] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + (m || 0);
}

function calculateDurationHours(entry, exit) {
  const start = parseTimeToMinutes(entry);
  let end = parseTimeToMinutes(exit);
  if (end <= start) end += 24 * 60;
  const diffMins = end - start;
  const hrs = Math.round(diffMins / 60);
  return Math.max(1, hrs);
}

function SearchLocation() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [entryTime, setEntryTime] = useState('10:00 AM');
  const [exitTime, setExitTime] = useState('02:00 PM');

  const durationHours = useMemo(() => {
    return calculateDurationHours(entryTime, exitTime);
  }, [entryTime, exitTime]);

  const handleSearch = () => {
    navigate('/map', {
      state: {
        destination: location,
        entryTime,
        exitTime,
        durationHours,
      },
    });
  };

  return (
    <div className="sl-page">
      <div className="sl-shell">
        
        {/* Header */}
        <div className="sl-header">
          <div className="sl-header-left">
            <button className="sl-back-btn" onClick={() => navigate('/dashboard')} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="sl-title-group">
              <h1 className="sl-title">Find Parking</h1>
              <span className="sl-desktop-subtitle">Search guaranteed parking bays & live rates</span>
            </div>
          </div>
          
          <button className="sl-filter-btn" aria-label="Filter options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* Content Container (Column on mobile, 2-column on desktop) */}
        <div className="sl-content-layout">
          
          {/* Main Search Panel */}
          <div className="sl-search-pane">
            
            {/* Location Input */}
            <div className="sl-group">
              <span className="sl-label">DESTINATION</span>
              <div className="sl-input-wrap">
                <div className="sl-input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="sl-input" 
                  placeholder="Where are you going?" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Date and Time Pickers (Interactive Selectors) */}
            <div className="sl-group">
              <div className="sl-label-row">
                <span className="sl-label">TIME</span>
                <span className="sl-duration-tag">
                  {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'} Window
                </span>
              </div>
              <div className="sl-time-row">
                <div className="sl-time-box">
                  <label htmlFor="sl-entry-time" className="sl-time-title">ENTRY</label>
                  <div className="sl-time-val">
                    <select
                      id="sl-entry-time"
                      className="sl-time-select"
                      value={entryTime}
                      onChange={(e) => setEntryTime(e.target.value)}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`entry-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <svg className="sl-time-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                <div className="sl-time-box">
                  <label htmlFor="sl-exit-time" className="sl-time-title">EXIT</label>
                  <div className="sl-time-val">
                    <select
                      id="sl-exit-time"
                      className="sl-time-select"
                      value={exitTime}
                      onChange={(e) => setExitTime(e.target.value)}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`exit-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <svg className="sl-time-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Locations */}
            <div className="sl-group">
              <span className="sl-label">RECENT SEARCHES</span>
              <div className="sl-chips">
                <div className="sl-chip" onClick={() => setLocation('Brooklyn Museum')}>Brooklyn Museum</div>
                <div className="sl-chip" onClick={() => setLocation('Barclays Center')}>Barclays Center</div>
                <div className="sl-chip" onClick={() => setLocation('JFK Airport')}>JFK Airport</div>
                <div className="sl-chip" onClick={() => setLocation('Central Park')}>Central Park</div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="sl-bottom">
              <button className="sl-btn" onClick={handleSearch}>
                Show on Map
              </button>
            </div>

          </div>

          {/* Desktop Right Side Panel (Visible only on Desktop) */}
          <div className="sl-desktop-side">
            
            {/* Live Map Preview Teaser */}
            <div className="sl-map-teaser-card" onClick={handleSearch}>
              <div className="sl-map-teaser-overlay">
                <div className="sl-map-teaser-badge">Interactive Map</div>
                <h3 className="sl-map-teaser-title">Explore Brooklyn Parking Hubs</h3>
                <p className="sl-map-teaser-sub">View live rates, bay availability & 24/7 barrier access</p>
                <button type="button" className="sl-map-teaser-btn">
                  Launch Map View →
                </button>
              </div>
            </div>

            {/* Popular Parking Lots */}
            <div className="sl-popular-sec">
              <span className="sl-label">FEATURED PARKING HUBS</span>
              <div className="sl-popular-list">
                {POPULAR_HUBS.map((hub) => (
                  <div
                    key={hub.name}
                    className="sl-popular-item"
                    onClick={() => {
                      setLocation(hub.name);
                      navigate('/map', {
                        state: {
                          destination: hub.name,
                          entryTime,
                          exitTime,
                          durationHours,
                        },
                      });
                    }}
                  >
                    <div className="sl-popular-left">
                      <div className="sl-popular-name">{hub.name}</div>
                      <div className="sl-popular-addr">{hub.addr}</div>
                      <div className="sl-popular-meta">
                        <span>📍 {hub.dist}</span>
                        <span>•</span>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>🚗 {hub.spots}</span>
                      </div>
                    </div>
                    <div className="sl-popular-right">
                      <span className="sl-popular-price">{hub.rate}</span>
                      <span className="sl-popular-action">Select</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SearchLocation;
