import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix leafet default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createPriceIcon = (price, isSelected) => {
  return L.divIcon({
    html: `<div class="mv-price-pill ${isSelected ? 'selected' : ''}">${price}</div>`,
    className: '',
    iconSize: [60, 32],
    iconAnchor: [30, 16],
  });
};

const mainPinIcon = L.divIcon({
  html: `
    <div class="mv-p-wrap">
      <div class="mv-p-circle">P</div>
      <div class="mv-p-tail"></div>
    </div>
  `,
  className: '',
  iconSize: [52, 66],
  iconAnchor: [26, 66],
});

const LOTS = [
  { id: '1', lat: 40.6782, lng: -73.9442, price: '$6', name: 'California Parking', distance: '12 km', spots: '5 slots' },
  { id: '2', lat: 40.6795, lng: -73.9410, price: '$4.50' },
  { id: '3', lat: 40.6760, lng: -73.9480, price: '$5' },
  { id: '4', lat: 40.6800, lng: -73.9460, price: '$5.50' },
];

function Recenter({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 15, { animate: true });
  return null;
}

function MapView() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('1');
  const [center, setCenter] = useState([40.6782, -73.9442]);

  const handleSelect = (lot) => {
    if (!lot.name) return; // Only main one has details in this demo
    setSelectedId(lot.id);
    setCenter([lot.lat, lot.lng]);
  };

  return (
    <div className="mv-page">
      <div className="mv-shell">
        
        <MapContainer 
          center={center} 
          zoom={15} 
          className="mv-map"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter lat={center[0]} lng={center[1]} />

          {LOTS.map((lot) => {
            const isSelected = lot.id === selectedId;
            return (
              <Marker 
                key={lot.id} 
                position={[lot.lat, lot.lng]}
                icon={isSelected ? mainPinIcon : createPriceIcon(lot.price, false)}
                eventHandlers={{ click: () => handleSelect(lot) }}
              />
            );
          })}
        </MapContainer>

        {/* Top UI */}
        <div className="mv-topbar">
          <button className="mv-hamburger" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="mv-car-pill">
            <svg width="22" height="14" viewBox="0 0 90 56" fill="none">
              <rect x="12" y="20" width="66" height="22" rx="5" fill="#a2b1c2" />
              <rect x="18" y="10" width="54" height="20" rx="5" fill="#8c9ead" />
              <circle cx="22" cy="44" r="8" fill="#fff" stroke="#222" strokeWidth="3" />
              <circle cx="68" cy="44" r="8" fill="#fff" stroke="#222" strokeWidth="3" />
            </svg>
            Car
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <button className="mv-compass-fab" onClick={() => setCenter([40.6782, -73.9442])}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        </button>

        {/* Bottom UI */}
        <div className="mv-bottom">
          <div className="mv-info-card" onClick={() => navigate('/confirm')}>
            <div className="mv-card-text">
              <h3 className="mv-card-name">California Parking</h3>
              <p className="mv-card-addr">1484 Nostrand Ave, Brooklyn</p>
              <div className="mv-card-meta">
                <div className="mv-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  12 km
                </div>
                <span className="mv-meta-sep">•</span>
                <div className="mv-meta-item" style={{color: '#d69f12'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  5 slots
                </div>
              </div>
            </div>
            <div className="mv-card-thumb">
              <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                <rect width="70" height="70" rx="16" fill="#F2C230" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="800" fill="#d69f12">$6</text>
              </svg>
            </div>
          </div>
          
          <div className="mv-search-bar">
            <button className="mv-search-back" onClick={() => navigate('/dashboard')}>
              ×
            </button>
            <input type="text" className="mv-search-input" placeholder="Search map view" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default MapView;
