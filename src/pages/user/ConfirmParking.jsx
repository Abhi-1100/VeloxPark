import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './ConfirmParking.css';

// Fix leafet default icon path issues
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
  const lat = 40.6782;
  const lng = -73.9442;

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
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <Recenter lat={lat} lng={lng} />
            <Marker position={[lat, lng]} icon={cpPinIcon} />
          </MapContainer>
        </div>

        {/* Top actions */}
        <div className="cp-top-actions">
          <button className="cp-back-btn" onClick={() => navigate('/map')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="cp-compass-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </button>
        </div>

        {/* Bottom Sheet Details */}
        <div className="cp-sheet">
          <div className="cp-header">
            <h2 className="cp-title">California Parking</h2>
            <p className="cp-addr">1484 Nostrand Ave, Brooklyn, NY 11226</p>
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
                <span className="cp-detail-val">12 km</span>
              </div>
            </div>
          </div>

          <div className="cp-time-wrap">
            <div className="cp-time-box">
              <span className="cp-time-lbl">ENTRY</span>
              <span className="cp-time-val">Today, 10:00 AM</span>
            </div>
            <div className="cp-time-dur">4h</div>
            <div className="cp-time-box end">
              <span className="cp-time-lbl">EXIT</span>
              <span className="cp-time-val">Today, 02:00 PM</span>
            </div>
          </div>

          <div className="cp-action-row">
            <div className="cp-price-box">
              <span className="cp-price-lbl">Total</span>
              <span className="cp-price-val">$24.00</span>
            </div>
            <button className="cp-book-btn" onClick={() => navigate('/book')}>
              Pay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConfirmParking;
