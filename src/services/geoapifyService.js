const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_KEY || '31cddbdb87b646a38a8525f91fe2d718';
const GEOAPIFY_API_BASE = 'https://api.geoapify.com';

function apiUrl(path, params = {}) {
  const searchParams = new URLSearchParams({ ...params, apiKey: GEOAPIFY_API_KEY || '' });
  return `${GEOAPIFY_API_BASE}${path}?${searchParams.toString()}`;
}

async function request(path, params, signal) {
  if (!GEOAPIFY_API_KEY) throw new Error('Geoapify API key is missing. Add VITE_GEOAPIFY_KEY to your .env file.');
  const response = await fetch(apiUrl(path, params), { signal });
  if (!response.ok) throw new Error('The Geoapify service could not be reached.');
  return response.json();
}

export function getGeoapifyApiKey() {
  return GEOAPIFY_API_KEY;
}

export async function getDrivingRoute(origin, destination, signal) {
  const payload = await request('/v1/routing', {
    waypoints: `${origin.latitude},${origin.longitude}|${destination.lat},${destination.lon}`,
    mode: 'drive',
  }, signal);
  const route = payload.features?.[0]?.properties;
  if (!route) throw new Error('No drivable route was found to this location.');
  return { distanceMetres: route.distance, durationSeconds: route.time };
}

export async function getNearbyPlaces(latitude, longitude, signal) {
  const payload = await request('/v2/places', {
    categories: 'accommodation.hotel,accommodation.motel,service.vehicle.fuel',
    filter: `circle:${longitude},${latitude},3000`,
    limit: 30,
  }, signal);

  return (payload.features || []).map((feature) => {
    const [lon, lat] = feature.geometry?.coordinates || [];
    const properties = feature.properties || {};
    return {
      id: properties.place_id || `${lat}-${lon}-${properties.name}`,
      name: properties.name || properties.address_line1 || 'Unnamed place',
      category: properties.categories?.[0] || properties.category || 'Nearby place',
      address: properties.address_line2 || properties.address_line1 || '',
      lat,
      lon,
    };
  }).filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lon));
}

export async function geocodeAddress(text, signal) {
  if (!text || !GEOAPIFY_API_KEY) return null;
  try {
    const payload = await request('/v1/geocode/search', { text, limit: 1 }, signal);
    const feature = payload.features?.[0];
    if (!feature) return null;
    const [lon, lat] = feature.geometry?.coordinates || [];
    const props = feature.properties || {};
    return {
      lat,
      lon,
      formatted: props.formatted || text,
      city: props.city || props.county || props.state || text.split(',')[0],
      street: props.street || props.address_line1 || props.city || text.split(',')[0],
    };
  } catch {
    return null;
  }
}

/**
 * Returns the user's approximate real geographic coordinates and city via IP lookup.
 * Essential fallback when browser GPS/Windows Location Service times out or is unavailable.
 */
export async function getIPLocation(signal) {
  try {
    const payload = await request('/v1/ipinfo', {}, signal);
    const lat = payload?.location?.latitude;
    const lng = payload?.location?.longitude;
    const cityName =
      payload?.city?.name ||
      payload?.subdivisions?.[1]?.names?.en ||
      payload?.subdivisions?.[0]?.names?.en ||
      'Surat';

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        lat,
        lng,
        city: cityName,
        state: payload?.state?.name || 'Gujarat',
        country: payload?.country?.name || 'India',
        ip: payload?.ip,
      };
    }
  } catch (err) {
    console.warn('Geoapify IP lookup failed, trying backup...', err);
  }

  // Backup fallback IP service
  try {
    const res = await fetch('https://ipapi.co/json/', { signal });
    if (res.ok) {
      const data = await res.json();
      if (Number.isFinite(data.latitude) && Number.isFinite(data.longitude)) {
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || 'Surat',
          state: data.region || 'Gujarat',
          country: data.country_name || 'India',
        };
      }
    }
  } catch (err) {
    console.warn('Backup IP lookup failed:', err);
  }

  // Default to Surat if geolocation cannot be determined
  return { lat: 21.2333, lng: 72.8667, city: 'Surat', state: 'Gujarat' };
}


