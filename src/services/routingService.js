import { isValidCoordinate } from '../data/parkingStations';

const DEFAULT_ROUTING_URL = 'https://router.project-osrm.org/route/v1';

export async function getDrivingRoute(origin, destination, signal) {
  if (!origin || !destination || !isValidCoordinate(origin.latitude, origin.longitude) || !isValidCoordinate(destination.latitude, destination.longitude)) throw new Error('A valid origin and destination are required.');
  const baseUrl = (import.meta.env.VITE_ROUTING_URL || DEFAULT_ROUTING_URL).replace(/\/$/, '');
  const url = `${baseUrl}/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('The routing service could not be reached.');
  const payload = await response.json();
  const route = payload.routes?.[0];
  if (payload.code !== 'Ok' || !route?.geometry?.coordinates?.length) throw new Error('No drivable route was found to this station.');
  return { type: 'Feature', properties: {}, geometry: route.geometry, distanceMetres: route.distance, durationSeconds: route.duration };
}
