// Temporary local provider. Replace the returned array with a Firestore/API
// adapter once station coordinates are available in the backend.
export const DEMO_PARKING_STATIONS = [
  {
    id: 'station-001',
    name: 'VeloxPark Station 01',
    latitude: 22.3072,
    longitude: 73.1812,
    totalSlots: 40,
    availableSlots: 24,
    status: 'open',
  },
  {
    id: 'station-002',
    name: 'VeloxPark Station 02',
    latitude: 22.3155,
    longitude: 73.175,
    totalSlots: 30,
    availableSlots: 12,
    status: 'open',
  },
  {
    id: 'station-003',
    name: 'VeloxPark Station 03',
    latitude: 22.2985,
    longitude: 73.19,
    totalSlots: 50,
    availableSlots: 31,
    status: 'open',
  },
];

export async function getParkingStations() {
  return DEMO_PARKING_STATIONS;
}
