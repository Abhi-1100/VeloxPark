import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { calculateDistance, formatDistance } from '../../utils/distance';
import { getParkingStations } from '../../data/parkingStations';
import { useUserLocation } from '../../hooks/useUserLocation';
import 'leaflet/dist/leaflet.css';
import './VeloxParkMap.css';

const FALLBACK_CENTER = [22.3072, 73.1812];

function markerIcon(kind, selected = false, isFocused = false) {
  const classes = [
    'vp-marker',
    `vp-marker-${kind}`,
    selected ? 'is-selected' : '',
    isFocused ? 'is-nearest-focused' : '',
  ].filter(Boolean).join(' ');
  const label = kind === 'user' ? 'You are here' : 'Parking station';
  return L.divIcon({
    className: 'vp-marker-icon',
    html: `<span class="${classes}" role="img" aria-label="${label}"><span class="vp-marker-core">${kind === 'user' ? '•' : 'P'}</span></span>`,
    iconSize: kind === 'user' ? [24, 24] : [38, 46],
    iconAnchor: kind === 'user' ? [12, 12] : [19, 42],
  });
}

function MapFocus({ position, zoom = 16, focusKey }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom, { duration: 0.9 });
    }
  }, [map, position, zoom, focusKey]);
  return null;
}

function statusLabel(station) {
  if (station.status === 'closed') return 'Closed';
  if (station.availableSlots <= 0) return 'Full';
  if (station.availableSlots / station.totalSlots <= 0.25) return 'Limited';
  return 'Open';
}

function StationCard({ station, distance, isFocused, onNavigate, onView, onConfirm }) {
  const status = statusLabel(station);
  return (
    <section
      className={`vp-station-card ${isFocused ? 'is-focused' : ''}`}
      aria-label={`${station.name} details`}
      onClick={isFocused ? onConfirm : onView}
      style={{ cursor: 'pointer' }}
    >
      <div className="vp-card-heading">
        <div>
          <span className="vp-eyebrow">
            {isFocused
              ? '📍 Nearest Station Shown · Click to Confirm'
              : (station.isNearest ? 'Nearest VeloxPark' : 'Selected station')}
          </span>
          <h2>{station.name}</h2>
        </div>
        <span className={`vp-status vp-status-${status.toLowerCase()}`}>
          <span />{status}
        </span>
      </div>

      <div className="vp-card-meta">
        <span>{distance == null ? 'Enable location for distance' : formatDistance(distance)}</span>
        <span className="vp-meta-divider" />
        <strong>{station.availableSlots} <small>/ {station.totalSlots} slots available</small></strong>
      </div>

      <div className="vp-card-actions" onClick={(e) => e.stopPropagation()}>
        {isFocused ? (
          <button
            type="button"
            className="vp-primary-button"
            onClick={onConfirm}
          >
            Confirm &amp; Book Station →
          </button>
        ) : (
          <button
            type="button"
            className="vp-secondary-button vp-view-btn"
            onClick={onView}
          >
            View station
          </button>
        )}
        <button
          type="button"
          className="vp-secondary-button"
          onClick={onNavigate}
          title="Open in Google Maps"
        >
          Navigate <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}

export default function VeloxParkMap() {
  const navigate = useNavigate();
  const { location, status: locationStatus, error: locationError, requestLocation } = useUserLocation();
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [focusPosition, setFocusPosition] = useState(null);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [stationFocused, setStationFocused] = useState(false);

  useEffect(() => {
    let active = true;
    getParkingStations().then((items) => {
      if (!active) return;
      setStations(items);
      setSelectedId(items[0]?.id || null);
      setStationsLoading(false);
    }).catch(() => {
      if (active) setStationsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const stationsWithDistance = useMemo(() => {
    if (!location) return stations;
    return stations.map((station) => ({
      ...station,
      distance: calculateDistance(location.latitude, location.longitude, station.latitude, station.longitude),
    }));
  }, [location, stations]);

  const nearestStation = useMemo(() => (
    stationsWithDistance.length
      ? [...stationsWithDistance].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))[0]
      : null
  ), [stationsWithDistance]);

  const selectedStation = stationsWithDistance.find((station) => station.id === selectedId) || nearestStation;
  const cardStation = selectedStation || nearestStation;
  const mapCenter = location ? [location.latitude, location.longitude] : FALLBACK_CENTER;

  useEffect(() => {
    if (nearestStation && !selectedId) {
      setSelectedId(nearestStation.id);
    }
  }, [nearestStation, selectedId]);

  useEffect(() => {
    if (location && !focusPosition) {
      setFocusPosition([location.latitude, location.longitude]);
    }
  }, [location, focusPosition]);

  const selectStation = (station) => {
    setSelectedId(station.id);
    setFocusPosition([station.latitude, station.longitude]);
    setFocusTrigger((k) => k + 1);
    setStationFocused(true);
  };

  const focusUser = () => {
    requestLocation();
    if (location) {
      setFocusPosition([location.latitude, location.longitude]);
      setFocusTrigger((k) => k + 1);
    }
  };

  const navigateToStation = () => {
    if (!cardStation) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${cardStation.latitude},${cardStation.longitude}`, '_blank', 'noopener,noreferrer');
  };

  // Step 1: On clicking "View station", focus on the nearest station on the map (DO NOT navigate)
  const handleViewStation = (e) => {
    if (e) e.stopPropagation();
    const target = nearestStation || selectedStation || stations[0];
    if (target) {
      setSelectedId(target.id);
      setFocusPosition([target.latitude, target.longitude]);
      setFocusTrigger((k) => k + 1);
      setStationFocused(true);
    }
  };

  const routeLocation = useLocation();
  const entryTime = routeLocation.state?.entryTime || '10:00 AM';
  const exitTime = routeLocation.state?.exitTime || '02:00 PM';
  const durationHours = routeLocation.state?.durationHours || 4;

  // Step 2: When the nearest station is shown on the map and clicked, navigate to the next page (/confirm)
  const handleConfirmStation = (station) => {
    const target = station || cardStation;
    navigate('/confirm', {
      state: {
        station: target,
        entryTime,
        exitTime,
        durationHours,
      },
    });
  };

  if (stationsLoading) {
    return (
      <div className="vp-map-state">
        <div className="vp-map-spinner" />
        <span>Loading map stations…</span>
      </div>
    );
  }

  if (!stations.length) {
    return (
      <div className="vp-map-state">
        <span>No VeloxPark stations available nearby.</span>
      </div>
    );
  }

  return (
    <div className="vp-map-page">
      <MapContainer
        center={mapCenter}
        zoom={14}
        className="vp-map"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <MapFocus position={focusPosition} focusKey={focusTrigger} />

        {location && (
          <Marker
            position={[location.latitude, location.longitude]}
            icon={markerIcon('user')}
            eventHandlers={{ click: () => setFocusPosition([location.latitude, location.longitude]) }}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {stationsWithDistance.map((station) => {
          const isSelected = station.id === cardStation?.id;
          const isTargetFocused = stationFocused && isSelected;

          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={markerIcon(statusLabel(station).toLowerCase(), isSelected, isTargetFocused)}
              eventHandlers={{
                click: () => {
                  // If nearest/selected station is already shown on the map, clicking it navigates to the next page!
                  if (stationFocused && isSelected) {
                    handleConfirmStation(station);
                  } else {
                    selectStation(station);
                  }
                },
              }}
            >
              {isTargetFocused && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -28]}
                  className="vp-station-active-tooltip"
                >
                  <div
                    className="vp-active-tooltip-inner"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmStation(station);
                    }}
                  >
                    <div className="vp-tooltip-pill">★ NEAREST STATION</div>
                    <div className="vp-tooltip-name">{station.name}</div>
                    <div className="vp-tooltip-cta">Click to book →</div>
                  </div>
                </Tooltip>
              )}

              <Popup>
                <div
                  style={{ textAlign: 'center', padding: '6px', minWidth: '135px', cursor: 'pointer' }}
                  onClick={() => handleConfirmStation(station)}
                >
                  <strong style={{ fontSize: '13px', display: 'block', color: '#111827' }}>
                    {station.name}
                  </strong>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>
                    {station.availableSlots} slots available
                  </p>
                  <button
                    type="button"
                    style={{
                      background: '#F2C230',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      marginTop: '6px',
                      color: '#111827',
                      width: '100%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmStation(station);
                    }}
                  >
                    Confirm &amp; Book →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Top Bar Capsule (Clean White Theme) */}
      <div className="vp-map-topbar">
        <div>
          <span className="vp-brand">VELOX<span>.</span>PARK</span>
          <span className="vp-map-label">LIVE MAP / NEARBY STATIONS</span>
        </div>
        <button type="button" className="vp-locate-button" onClick={focusUser} aria-label="Locate me">
          ⌾ <span>Locate me</span>
        </button>
      </div>

      {locationError && <div className="vp-location-alert" role="status">{locationError}</div>}
      {locationStatus === 'loading' && <div className="vp-location-loading">Finding your location…</div>}

      {/* Selected Station Card (Step 1: Focus nearest station on map; Step 2: Click to navigate) */}
      {cardStation && (
        <StationCard
          station={{ ...cardStation, isNearest: cardStation.id === nearestStation?.id }}
          distance={cardStation.distance}
          isFocused={stationFocused}
          onNavigate={navigateToStation}
          onView={handleViewStation}
          onConfirm={() => handleConfirmStation(cardStation)}
        />
      )}
    </div>
  );
}
