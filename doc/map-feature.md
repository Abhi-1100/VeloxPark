# Interactive Map Feature

## Purpose

The user map at `/map` shows nearby VeloxPark parking stations on a MapLibre/OpenStreetMap-compatible map. It is integrated into the existing dashboard/search flow.

## User flow

```text
/dashboard -> /search -> /map
```

## Implementation files

| File | Responsibility |
| --- | --- |
| `src/pages/user/MapView.jsx` | Existing route integration and dashboard navigation |
| `src/components/map/VeloxParkMap.jsx` | MapLibre map, markers, selection, station list, route, and state |
| `src/components/map/VeloxParkMap.css` | Responsive map overlays and marker styles |
| `src/hooks/useUserLocation.js` | One-shot browser geolocation and error states |
| `src/utils/distance.js` | Haversine distance and formatting |
| `src/data/parkingStations.js` | Validated Firebase Realtime Database `stations` provider |

## Behavior

- MapLibre renders OpenStreetMap raster tiles with attribution. Set `VITE_MAP_STYLE_URL` for another compatible provider and follow its key and attribution requirements.
- Custom VeloxPark markers show open, limited, full, and closed states.
- The user marker opens a `You are here` popup.
- Clicking a station highlights it, focuses the map, and updates the bottom card.
- The nearest station is calculated when location and stations are available.
- Locate Me requests location and focuses the map on the detected coordinates.
- Continue requests a real road route and displays provider distance/ETA; it does not create a booking.

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

There are no fallback/demo stations in production code. Invalid-coordinate records are ignored. Add real records under Firebase `stations/{stationId}` with `name`, `latitude`, `longitude`, `address`, `totalSlots`, `availableSlots`, `status`, and optional `pricePerHour`.

## Nearest-station calculation

`calculateDistance()` uses the Haversine formula with an Earth radius of 6,371 km. Station distances are memoized and sorted to select the nearest station. Latitude/longitude subtraction is not used.

## Routing configuration

`VITE_ROUTING_URL` defaults to the OSRM demo endpoint. OSRM coordinates are sent as `longitude,latitude`; the full GeoJSON route geometry, distance, and duration are used directly. The public demo server has no production SLA or guaranteed limits. For production, point this variable at an appropriately hosted or contracted OSRM-compatible service.

## Firebase/API replacement

The map reads the existing Firebase Realtime Database `stations` node through `getParkingStations()`. Existing `parkingLogs` records are parking sessions, not station records, and are not treated as station locations. Do not initialize Firebase again; use `src/config/firebase.js`.

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
