import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchLocation.css';

function SearchLocation() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // In a real app, you would pass the search params via state or URL params.
    // For now, we just navigate to the map.
    navigate('/map');
  };

  return (
    <div className="sl-page">
      <div className="sl-shell">
        
        {/* Header */}
        <div className="sl-header">
          <button className="sl-back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="sl-title">Find Parking</h1>
          <button className="sl-filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

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

        {/* Date and Time Pickers (Mocked for UI) */}
        <div className="sl-group">
          <span className="sl-label">TIME</span>
          <div className="sl-time-row">
            <div className="sl-time-box">
              <span className="sl-time-title">ENTRY</span>
              <div className="sl-time-val">
                10:00 AM
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div className="sl-time-box">
              <span className="sl-time-title">EXIT</span>
              <div className="sl-time-val">
                02:00 PM
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
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
    </div>
  );
}

export default SearchLocation;
