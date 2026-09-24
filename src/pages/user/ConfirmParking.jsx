import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './ConfirmParking.css';

// Fix leaflet default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cpPinIcon = L.divIcon({
  html: `
    <div class="cp-pin-wrap">
      <div class="cp-pin-circle">P</div>
      <div class="cp-pin-tail"></div>
    </div>
  `,
  className: '',
  iconSize: [44, 56],
  iconAnchor: [22, 56],
});

function Recenter({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 15, { animate: false });
  // Offset the map center upwards so the pin is visible above the bottom sheet
  map.panBy([0, 100], { animate: false });
  return null;
}

function ConfirmParking() {
  const navigate = useNavigate();
  const location = useLocation();
  const station = location.state?.station;
  const entryTime = location.state?.entryTime || '10:00 AM';
  const exitTime = location.state?.exitTime || '02:00 PM';
  const durationHours = location.state?.durationHours || 4;
  const ratePerHour = 60;
  const totalAmount = location.state?.amount || durationHours * ratePerHour;

  const lat = station?.latitude || 40.6782;
  const lng = station?.longitude || -73.9442;
  const name = station?.name || 'California Parking';
  const address = station?.address || (station ? `${station.city || 'Vadodara'} Station Area` : '1484 Nostrand Ave, Brooklyn, NY 11226');
  const distance = station?.distance != null ? `${station.distance.toFixed(1)} km` : '12 km';
  const slots = station?.availableSlots != null ? `${station.availableSlots} slots` : '5 slots';

  return (
    <div className="cp-page">
      <div className="cp-shell">
        
        {/* Background mini map */}
        <div className="cp-map-bg">
          <MapContainer 
            center={[lat, lng]} 
            zoom={15} 
            className="cp-map"
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Recenter lat={lat} lng={lng} />
            <Marker position={[lat, lng]} icon={cpPinIcon} />
          </MapContainer>
        </div>

        {/* Top Navbar Actions (Matches the Old Way: Left Back Arrow, Right Car Pill) */}
        <div className="cp-top-actions">
          <button className="cp-back-btn" onClick={() => navigate('/map')} aria-label="Go back to map">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="cp-car-pill" role="button" tabIndex={0} aria-label="Vehicle type: Car">
            <svg width="22" height="14" viewBox="0 0 90 56" fill="none">
              <rect x="12" y="20" width="66" height="22" rx="5" fill="#a2b1c2" />
              <rect x="18" y="10" width="54" height="20" rx="5" fill="#8c9ead" />
              <circle cx="22" cy="44" r="8" fill="#fff" stroke="#222" strokeWidth="3" />
              <circle cx="68" cy="44" r="8" fill="#fff" stroke="#222" strokeWidth="3" />
            </svg>
            <span>Car</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Bottom Sheet Details */}
        <div className="cp-sheet">
          <div className="cp-header">
            <h2 className="cp-title">{name}</h2>
            <p className="cp-addr">{address}</p>
          </div>

          <div className="cp-details-row">
            <div className="cp-detail-box">
              <div className="cp-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                  <line x1="9" y1="1" x2="9" y2="4"/>
                  <line x1="15" y1="1" x2="15" y2="4"/>
                  <line x1="9" y1="20" x2="9" y2="23"/>
                  <line x1="15" y1="20" x2="15" y2="23"/>
                  <line x1="20" y1="9" x2="23" y2="9"/>
                  <line x1="20" y1="14" x2="23" y2="14"/>
                  <line x1="1" y1="9" x2="4" y2="9"/>
                  <line x1="1" y1="14" x2="4" y2="14"/>
                </svg>
              </div>
              <div className="cp-detail-text">
                <span className="cp-detail-lbl">Floor</span>
                <span className="cp-detail-val">B1</span>
              </div>
            </div>

            <div className="cp-detail-box">
              <div className="cp-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="cp-detail-text">
                <span className="cp-detail-lbl">Distance</span>
                <span className="cp-detail-val">{distance}</span>
              </div>
            </div>
          </div>

          <div className="cp-time-wrap">
            <div className="cp-time-box">
              <span className="cp-time-lbl">ENTRY</span>
              <span className="cp-time-val">Today, {entryTime}</span>
            </div>
            <div className="cp-time-dur">{durationHours}h</div>
            <div className="cp-time-box end">
              <span className="cp-time-lbl">EXIT</span>
              <span className="cp-time-val">Today, {exitTime}</span>
            </div>
          </div>

          <div className="cp-action-row">
            <div className="cp-price-box">
              <span className="cp-price-lbl">Total</span>
              <span className="cp-price-val">₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              className="cp-book-btn"
              onClick={() =>
                navigate('/book', {
                  state: {
                    station,
                    entryTime,
                    exitTime,
                    durationHours,
                    amount: totalAmount,
                  },
                })
              }
            >
              Pay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConfirmParking;
