import { get, ref } from 'firebase/database';
import { database } from '../config/firebase';

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidCoordinate(latitude, longitude) {
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function normalizeStation(id, raw = {}) {
  const latitude = number(raw.latitude ?? raw.lat);
  const longitude = number(raw.longitude ?? raw.lng ?? raw.lon);
  const totalSlots = Math.max(0, number(raw.totalSlots ?? raw.capacity) ?? 0);
  const availableSlots = Math.max(0, number(raw.availableSlots ?? raw.available) ?? 0);
  if (!id || !isValidCoordinate(latitude, longitude)) return null;
  return {
    id: String(id), name: String(raw.name || raw.stationName || 'VeloxPark station'),
    latitude, longitude, address: raw.address || raw.location || '', totalSlots,
    availableSlots: Math.min(availableSlots, totalSlots || availableSlots),
    pricePerHour: number(raw.pricePerHour ?? raw.rate ?? raw.hourlyRate),
    status: String(raw.status || 'open').toLowerCase(),
  };
}

/** Read the existing public station node. No demo records are created here. */
export async function getParkingStations() {
  const snapshot = await get(ref(database, 'stations'));
  const value = snapshot.val();
  if (!value) return [];
  const records = Array.isArray(value) ? value.map((item, index) => [item?.id || index, item]) : Object.entries(value);
  return records.map(([id, raw]) => normalizeStation(id, raw)).filter(Boolean);
}
