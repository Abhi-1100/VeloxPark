# Interactive Map Feature

## Purpose

The user map at `/map` shows nearby VeloxPark parking stations on a real OpenStreetMap map. It is integrated into the existing dashboard/search flow.

## User flow

```text
/dashboard -> /search -> /map
```

## Implementation files

| File | Responsibility |
| --- | --- |
| `src/pages/user/MapView.jsx` | Existing route integration and dashboard navigation |
| `src/components/map/VeloxParkMap.jsx` | Leaflet map, markers, selection, card, navigation, and state |
| `src/components/map/VeloxParkMap.css` | Responsive map overlays and marker styles |
| `src/hooks/useUserLocation.js` | One-shot browser geolocation and error states |
| `src/utils/distance.js` | Haversine distance and formatting |
| `src/data/parkingStations.js` | Station provider and temporary demo data |

## Behavior

- React Leaflet renders OpenStreetMap tiles with attribution.
- Custom VeloxPark markers show open, limited, full, and closed states.
- The user marker opens a `You are here` popup.
- Clicking a station highlights it, focuses the map, and updates the bottom card.
- The nearest station is calculated when location and stations are available.
- Locate Me requests location and focuses the map on the detected coordinates.
- Navigate opens an external Google Maps directions URL.

## Station data contract

```js
{
  id: 'station-001',
  name: 'VeloxPark Station 01',
  latitude: 22.3072,
  longitude: 73.1812,
  totalSlots: 40,
  availableSlots: 24,
  status: 'open'
}
```

The current coordinates are temporary fallback/demo values and are not real VeloxPark locations.

## Nearest-station calculation

`calculateDistance()` uses the Haversine formula with an Earth radius of 6,371 km. Station distances are memoized and sorted to select the nearest station. Latitude/longitude subtraction is not used.

## Firebase/API replacement

Keep the UI contract unchanged and replace `getParkingStations()` in `src/data/parkingStations.js` with a provider backed by Firebase or an API. Do not initialize Firebase again; use `src/config/firebase.js`.

Example Firestore adapter:

```js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getParkingStations() {
  const snapshot = await getDocs(collection(db, 'stations'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
```

Validate coordinates and slot counts at the provider boundary.

## Production checklist

- Replace demo station coordinates.
- Add station read rules and trusted write rules.
- Confirm HTTPS for production geolocation.
- Confirm OpenStreetMap tile usage and attribution requirements.
- Test permission denied, no stations, tile failure, mobile layout, and navigation.
