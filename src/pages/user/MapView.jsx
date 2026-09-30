import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import { getDrivingRoute, getGeoapifyApiKey, getNearbyPlaces } from '../../services/geoapifyService';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapView.css';

const GEOAPIFY_STYLE = `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${getGeoapifyApiKey() || ''}`;

function formatDistance(metres) { return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${Math.round(metres)} m`; }
function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
}

function MapView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(() => Boolean(navigator.geolocation));
  const [routeError, setRouteError] = useState(() => navigator.geolocation ? '' : 'Your browser does not support location access.');
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState('');

  const destination = useMemo(() => (
    state && Number.isFinite(Number(state.lat)) && Number.isFinite(Number(state.lon))
      ? { lat: Number(state.lat), lon: Number(state.lon) } : null
  ), [state]);

  useEffect(() => {
    if (!destination || !mapContainer.current) return undefined;
    const map = new maplibregl.Map({ container: mapContainer.current, style: GEOAPIFY_STYLE, center: [destination.lon, destination.lat], zoom: 14 });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    new maplibregl.Marker({ color: '#e4572e' }).setLngLat([destination.lon, destination.lat])
      .setPopup(new maplibregl.Popup().setText(state.address || 'Selected location')).addTo(map);
    mapRef.current = map;
    return () => { markersRef.current.forEach((marker) => marker.remove()); map.remove(); mapRef.current = null; };
  }, [destination, state?.address]);

  useEffect(() => {
    if (!destination) return undefined;
    const controller = new AbortController();
    getNearbyPlaces(destination.lat, destination.lon, controller.signal).then(setPlaces).catch((error) => {
      if (error.name !== 'AbortError') setPlacesError(error.message || 'Nearby places could not be loaded.');
    }).finally(() => { if (!controller.signal.aborted) setPlacesLoading(false); });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => getDrivingRoute(
        { latitude: coords.latitude, longitude: coords.longitude }, destination, controller.signal
      ).then(setRoute).catch((error) => {
        if (error.name !== 'AbortError') setRouteError(error.message || 'Driving time could not be calculated.');
      }).finally(() => { if (!controller.signal.aborted) setRouteLoading(false); }), () => {
        setRouteError('Location permission was denied. Allow location access to see driving distance and time.'); setRouteLoading(false);
      }, { enableHighAccuracy: true, timeout: 10000 });
    }
    return () => controller.abort();
  }, [destination]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !places.length) return undefined;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = places.map((place) => new maplibregl.Marker({ color: '#2a9d8f' })
      .setLngLat([place.lon, place.lat]).setPopup(new maplibregl.Popup().setText(place.name)).addTo(map));
    return undefined;
  }, [places]);

  if (!destination) return <Navigate to="/search" replace />;

  return (
    <main className="geo-map-page">
      <header className="geo-map-header">
        <button type="button" onClick={() => navigate('/search')}>← New search</button>
        <div><h1>{state.address || 'Selected location'}</h1><p>Nearby places within 3 km</p></div>
      </header>
      <div className="geo-map-layout">
        <div ref={mapContainer} className="geo-map-canvas" aria-label="Map of selected location" />
        <aside className="geo-map-details">
          <section className="geo-info-card"><h2>Driving information</h2>
            {routeLoading && <p>Calculating distance and driving time…</p>}
            {!routeLoading && route && <p>{formatDistance(route.distanceMetres)} · {formatDuration(route.durationSeconds)}</p>}
            {!routeLoading && routeError && <p className="geo-error">{routeError}</p>}
          </section>
          <section><h2>Nearby places</h2>
            {placesLoading && <p>Loading nearby hotels and fuel stations…</p>}
            {!placesLoading && placesError && <p className="geo-error">{placesError}</p>}
            {!placesLoading && !placesError && !places.length && <p>No hotels, motels, or gas stations were found nearby.</p>}
            <div className="geo-place-list">{places.map((place) => <article className="geo-place-card" key={place.id}>
              <h3>{place.name}</h3><p>{place.category}</p>{place.address && <small>{place.address}</small>}
            </article>)}</div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default MapView;
