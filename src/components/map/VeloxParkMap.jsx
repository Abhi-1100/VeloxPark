import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import { getParkingStations } from '../../data/parkingStations';
import { useUserLocation } from '../../hooks/useUserLocation';
import { geocodeAddress } from '../../services/geoapifyService';
import { checkLocationServiceability, SERVICEABLE_CITIES, getEnterpriseStationsForCity } from '../../data/serviceableCities';
import { calculateRealisticDrivingTime } from '../../utils/travelTimeUtils';
import UnserviceableAreaView from '../user/UnserviceableAreaView';
import parkingSlotThumb from '../../assets/parking-slot.jpg';
import 'maplibre-gl/dist/maplibre-gl.css';
import './VeloxParkMap.css';

// Default center: Anand, Gujarat (Central Network Hub)
const ANAND_CENTER = [72.9289, 22.5645];

const ANAND_DEFAULT = {
  lat: 22.5645,
  lng: 72.9289,
  name: 'Anand Smart Parking',
  address: 'Vallabh Vidyanagar, Anand',
  street: 'Station Rd',
};

const LIGHT_MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -0.4,
        'raster-contrast': 0.1,
        'raster-brightness-min': 0.15,
      },
    },
  ],
};

const KNOWN_LOCATIONS = {
  anand: { lat: 22.5645, lng: 72.9289, name: 'Anand Smart Parking', address: 'Vallabh Vidyanagar, Anand', street: 'Station Rd' },
  vidyanagar: { lat: 22.5539, lng: 72.9242, name: 'Central Campus Lot A', address: 'Shastri Maidan Marg, VV Nagar, Anand', street: 'Shastri Maidan Marg' },
  vallabh: { lat: 22.5539, lng: 72.9242, name: 'Central Campus Lot A', address: 'Shastri Maidan Marg, VV Nagar, Anand', street: 'Shastri Maidan Marg' },
  nadiad: { lat: 22.6916, lng: 72.8634, name: 'Nadiad Junction Smart Bay', address: 'Station Rd, Nadiad, Gujarat', street: 'Station Rd' },
  surat: { lat: 21.1702, lng: 72.8311, name: 'Surat Ring Road Parking Hub', address: 'Ring Road, Surat, Gujarat', street: 'Ring Rd' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: 'Sabarmati Riverfront Smart Bay', address: 'Sabarmati Riverfront, Ahmedabad, Gujarat', street: 'Riverfront' },
  ahmadabad: { lat: 23.0225, lng: 72.5714, name: 'Sabarmati Riverfront Smart Bay', address: 'Sabarmati Riverfront, Ahmedabad, Gujarat', street: 'Riverfront' },
  vadodara: { lat: 22.3072, lng: 73.1812, name: 'Sayaji Baug Central Deck', address: 'Sayaji Baug, Vadodara, Gujarat', street: 'Sayaji Rd' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Koramangala 80ft Road Hub', address: '80 Feet Road, Koramangala, Bengaluru', street: '80 Feet Rd' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Koramangala 80ft Road Hub', address: '80 Feet Road, Koramangala, Bengaluru', street: '80 Feet Rd' },
  benglor: { lat: 12.9716, lng: 77.5946, name: 'Koramangala 80ft Road Hub', address: '80 Feet Road, Koramangala, Bengaluru', street: '80 Feet Rd' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'BKC Corporate Plaza Bay', address: 'Bandra Kurla Complex, Mumbai', street: 'BKC Avenue' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Connaught Place Smart Underground', address: 'Connaught Place, New Delhi', street: 'Connaught Place' },
  gurgaon: { lat: 28.4950, lng: 77.0890, name: 'Cyber City DLF Smart Deck', address: 'DLF Cyber City, Gurugram', street: 'Cyber City Rd' },
};

const POPULAR_SUGGESTIONS = [
  { name: 'Vallabh Vidyanagar', address: 'Shastri Maidan Marg, VV Nagar, Anand', lat: 22.5539, lng: 72.9242, street: 'Shastri Maidan Marg' },
  { name: 'Anand Railway Station', address: 'Station Rd, Anand, Gujarat', lat: 22.5645, lng: 72.9289, street: 'Station Rd' },
  { name: 'Nadiad Junction', address: 'Station Rd, Nadiad, Gujarat', lat: 22.6916, lng: 72.8634, street: 'Station Rd' },
  { name: 'Sabarmati Riverfront', address: 'Riverfront Rd, Ahmedabad', lat: 23.0225, lng: 72.5714, street: 'Riverfront' },
  { name: 'Surat Ring Road', address: 'Ring Road, Surat, Gujarat', lat: 21.1702, lng: 72.8311, street: 'Ring Rd' },
  { name: 'Koramangala, Bengaluru', address: '80ft Road, Bengaluru, Karnataka', lat: 12.9345, lng: 77.6265, street: '80 Feet Rd' },
  { name: 'BKC, Mumbai', address: 'Bandra Kurla Complex, Mumbai', lat: 19.0657, lng: 72.8688, street: 'BKC Avenue' },
  { name: 'Connaught Place, Delhi', address: 'CP Inner Circle, New Delhi', lat: 28.6327, lng: 77.2195, street: 'Connaught Place' },
  { name: 'Sayaji Baug, Vadodara', address: 'Sayaji Rd, Vadodara', lat: 22.3072, lng: 73.1812, street: 'Sayaji Rd' },
];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function generateDynamicEnterpriseStations(centerLat, centerLng, centerName, centerAddress, centerStreet, sym = '₹') {
  const primary = {
    id: 'primary_center',
    name: centerName.toLowerCase().includes('parking') ? centerName : `${centerName} Smart Hub`,
    address: centerAddress,
    slots: 40,
    rate: 40,
    priceStr: `${sym}40.00/h`,
    pinPrice: `${sym}40`,
    lng: centerLng,
    lat: centerLat,
    street: centerStreet,
    isPrimary: true,
  };

  const offsets = [
    { dLat: 0.0035, dLng: -0.0028, name: `${centerStreet} North Lot`, pinPrice: `${sym}35`, rate: 35, slots: 24, street: `${centerStreet} North` },
    { dLat: 0.0048, dLng: 0.0032, name: `${centerStreet} Commercial Deck`, pinPrice: `${sym}45`, rate: 45, slots: 32, street: `${centerStreet} Commercial` },
    { dLat: -0.0032, dLng: -0.0038, name: `${centerStreet} West Plaza`, pinPrice: `${sym}30`, rate: 30, slots: 18, street: `${centerStreet} West` },
    { dLat: -0.0046, dLng: 0.0022, name: `${centerStreet} Central Hub`, pinPrice: `${sym}40`, rate: 40, slots: 50, street: centerStreet },
    { dLat: 0.0025, dLng: 0.0055, name: `${centerStreet} Express Bay`, pinPrice: `${sym}25`, rate: 25, slots: 22, street: `${centerStreet} Outer` },
  ];

  const nearby = offsets.map((o, idx) => ({
    id: `nearby_${idx}`,
    name: o.name,
    address: `${o.name}, ${centerAddress.split(',').slice(1).join(',') || centerAddress}`,
    slots: o.slots,
    rate: o.rate,
    priceStr: `${sym}${o.rate}.00/h`,
    pinPrice: o.pinPrice,
    lng: centerLng + o.dLng,
    lat: centerLat + o.dLat,
    street: o.street,
    isPrimary: false,
  }));

  return [primary, ...nearby];
}

export function resolveCityEnterpriseStations(queryOrCity, lat = null, lng = null, sym = '₹') {
  const check = checkLocationServiceability(typeof queryOrCity === 'string' ? queryOrCity : '', lat, lng);
  if (check.city) {
    return getEnterpriseStationsForCity(check.city, lat, lng, sym);
  }
  const qStr = typeof queryOrCity === 'string' ? queryOrCity : '';
  const street = qStr ? qStr.split(',')[0].trim() : 'Station Rd';
  const name = qStr.toLowerCase().includes('parking') ? qStr : `${street} Parking Hub`;
  return generateDynamicEnterpriseStations(lat || 22.5645, lng || 72.9289, name, qStr || 'Station Rd', street, sym);
}


function resolveInitialLocation(routeState) {
  const query = (
    routeState?.address ||
    routeState?.destination ||
    routeState?.location ||
    routeState?.city ||
    routeState?.station?.name ||
    ''
  ).trim();

  // 1. Explicit station object
  if (routeState?.station) {
    const lat = routeState.station.latitude || routeState.station.lat || routeState?.lat;
    const lng = routeState.station.longitude || routeState.station.lng || routeState?.lon;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        lat,
        lng,
        name: routeState.station.name || 'Selected Parking',
        address: routeState.station.address || 'Smart Parking Hub',
        street: (routeState.station.address || 'Station Rd').split(',')[0],
      };
    }
  }

  // 2. Explicit coordinates passed
  if (Number.isFinite(routeState?.lat) && Number.isFinite(routeState?.lon)) {
    const street = query ? query.split(',')[0].trim() : 'Station Rd';
    const lower = query.toLowerCase();
    const name = lower.includes('parking')
      ? query
      : (lower.includes('anand') || lower.includes('vidyanagar') ? 'Anand Smart Parking' : `${street} Parking`);
    return {
      lat: routeState.lat,
      lng: routeState.lon,
      name,
      address: query || 'Vallabh Vidyanagar, Anand',
      street,
    };
  }

  // 3. Known location dictionary
  const lower = query.toLowerCase();
  const matchedKey = Object.keys(KNOWN_LOCATIONS).find((key) => lower.includes(key));
  if (matchedKey) {
    const known = KNOWN_LOCATIONS[matchedKey];
    return {
      lat: known.lat,
      lng: known.lng,
      name: lower.includes('parking') ? query : known.name,
      address: query.length > 5 ? query : known.address,
      street: known.street,
    };
  }

  // 4. Default: Anand, Gujarat (Central Network Hub)
  return ANAND_DEFAULT;
}

export default function VeloxParkMap() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { location, requestLocation } = useUserLocation();

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Extract user entered location from navigation state
  const targetQuery = useMemo(() => {
    return (
      routeLocation.state?.address ||
      routeLocation.state?.destination ||
      routeLocation.state?.location ||
      routeLocation.state?.city ||
      routeLocation.state?.station?.name ||
      ''
    );
  }, [routeLocation.state]);

  const isSFMode = useMemo(() => {
    if (!targetQuery) return false;
    const lower = targetQuery.toLowerCase();
    return lower.includes('san francisco') || lower.includes('jackson st');
  }, [targetQuery]);

  const currencySymbol = isSFMode ? '$' : '₹';

  const initialResolved = useMemo(() => resolveInitialLocation(routeLocation.state), [routeLocation.state]);
  const initialPins = useMemo(() => {
    // 1. If station passed in state
    if (routeLocation.state?.station) {
      const st = routeLocation.state.station;
      const sLat = st.latitude || st.lat || routeLocation.state?.lat || initialResolved.lat;
      const sLng = st.longitude || st.lng || routeLocation.state?.lon || initialResolved.lng;
      const cityStations = resolveCityEnterpriseStations(
        routeLocation.state?.city || targetQuery || st.address || 'anand',
        sLat,
        sLng,
        currencySymbol
      );

      const existingIdx = cityStations.findIndex(
        (cs) => cs.id === st.id || cs.name.toLowerCase() === (st.name || '').toLowerCase()
      );

      if (existingIdx >= 0) {
        const matched = cityStations[existingIdx];
        const rest = cityStations.filter((_, idx) => idx !== existingIdx);
        return [matched, ...rest];
      }

      const formatted = {
        id: st.id || 'selected_station',
        name: st.name || 'Selected Parking',
        address: st.address || 'Smart Parking Hub',
        street: (st.address || st.name || 'Station Rd').split(',')[0],
        lat: sLat,
        lng: sLng,
        slots: st.availableSlots || st.slots || 30,
        totalSlots: st.totalSlots || 50,
        rate: st.pricePerHour || st.rate || 35,
        priceStr: `${currencySymbol}${st.pricePerHour || st.rate || 35}.00/h`,
        pinPrice: `${currencySymbol}${st.pricePerHour || st.rate || 35}`,
        tag: st.tag || 'ANPR',
        feature: st.feature || 'Fast Gate',
        isPrimary: true,
      };

      return [formatted, ...cityStations.slice(0, 5)];
    }

    return resolveCityEnterpriseStations(
      targetQuery || routeLocation.state?.city || 'anand',
      initialResolved.lat,
      initialResolved.lng,
      currencySymbol
    );
  }, [routeLocation.state, targetQuery, initialResolved, currencySymbol]);

  const serviceCheck = useMemo(() => {
    if (routeLocation.state?.isServiceable === false) {
      return {
        isServiceable: false,
        formattedLocation: targetQuery || routeLocation.state?.address || routeLocation.state?.location || 'Changa, Gujarat, 388421, India',
      };
    }
    const query = targetQuery || routeLocation.state?.address || routeLocation.state?.location || '';
    const lat = routeLocation.state?.lat ?? initialResolved.lat;
    const lng = routeLocation.state?.lon ?? routeLocation.state?.lng ?? initialResolved.lng;
    return checkLocationServiceability(query, lat, lng);
  }, [targetQuery, routeLocation.state, initialResolved]);

  const [activeServiceCheck, setActiveServiceCheck] = useState(serviceCheck);

  useEffect(() => {
    setActiveServiceCheck(serviceCheck);
  }, [serviceCheck]);

  const [stations, setStations] = useState(initialPins);
  const [selectedStation, setSelectedStation] = useState(initialPins[0]);

  useEffect(() => {
    setStations(initialPins);
    setSelectedStation(initialPins[0]);
  }, [initialPins]);
  const [isPopupOpen, setIsPopupOpen] = useState(Boolean(routeLocation.state?.openPopup));
  const [durationHours, setDurationHours] = useState(routeLocation.state?.durationHours || 2);
  const [entryTime, setEntryTime] = useState(routeLocation.state?.entryTime || '10:00 AM');
  const [exitTime, setExitTime] = useState(routeLocation.state?.exitTime || '12:00 PM');
  const [slotNumber] = useState('B1');
  const [searchQuery, setSearchQuery] = useState(targetQuery || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const userLocationMarkerRef = useRef(null);

  const miniMapContainer = useRef(null);
  const miniMapRef = useRef(null);
  const [miniRouteInfo, setMiniRouteInfo] = useState(null);

  const updateUserLocationMarker = useCallback((lat, lng) => {
    const map = mapRef.current;
    if (!map) return;

    if (!userLocationMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'cal-user-loc-dot';
      el.innerHTML = `
        <div class="cal-user-loc-pulse"></div>
        <div class="cal-user-loc-core"></div>
      `;
      userLocationMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      userLocationMarkerRef.current.setLngLat([lng, lat]);
    }
  }, []);

  // Filter suggestions dynamically
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return POPULAR_SUGGESTIONS;
    const q = searchQuery.toLowerCase().trim();
    const matches = POPULAR_SUGGESTIONS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
    return matches.length > 0 ? matches : POPULAR_SUGGESTIONS;
  }, [searchQuery]);

  // Helper to fly to coordinates reliably
  const flyToCoords = useCallback((lng, lat) => {
    const map = mapRef.current;
    if (!map) return;
    if (map.loaded()) {
      map.flyTo({ center: [lng, lat], zoom: 15, speed: 1.2 });
    } else {
      map.once('load', () => {
        map.flyTo({ center: [lng, lat], zoom: 15, speed: 1.2 });
      });
    }
  }, []);

  // Change location directly from the map page
  const handleApplyNewLocation = (locationText) => {
    const cleanText = (locationText || '').trim();
    if (!cleanText) return;

    setShowSuggestions(false);
    setIsSearchFocused(false);
    setSearchQuery(cleanText);

    // Validate location serviceability
    const check = checkLocationServiceability(cleanText);
    if (!check.isServiceable) {
      setActiveServiceCheck(check);
      return;
    }
    setActiveServiceCheck(check);

    // 1. If matched city from check
    if (check.city) {
      const newStations = resolveCityEnterpriseStations(check.city, check.city.center.lat, check.city.center.lng, currencySymbol);
      setStations(newStations);
      setSelectedStation(newStations[0]);
      flyToCoords(newStations[0].lng, newStations[0].lat);
      return;
    }

    // 2. Geocode custom text using Geoapify
    geocodeAddress(cleanText)
      .then((geo) => {
        if (!geo) return;
        const subCheck = checkLocationServiceability(cleanText, geo.lat, geo.lon);
        if (!subCheck.isServiceable) {
          setActiveServiceCheck(subCheck);
          return;
        }
        setActiveServiceCheck(subCheck);
        const newStations = resolveCityEnterpriseStations(subCheck.city || cleanText, geo.lat, geo.lon, currencySymbol);
        setStations(newStations);
        setSelectedStation(newStations[0]);
        flyToCoords(geo.lon, geo.lat);
      })
      .catch(() => {
        const fallback = resolveCityEnterpriseStations('anand', 22.5645, 72.9289, currencySymbol);
        setStations(fallback);
        setSelectedStation(fallback[0]);
        flyToCoords(fallback[0].lng, fallback[0].lat);
      });
  };

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setIsSearchFocused(false);

    const check = checkLocationServiceability(item.name, item.lat, item.lng);
    if (!check.isServiceable) {
      setActiveServiceCheck(check);
      return;
    }
    setActiveServiceCheck(check);

    const newStations = resolveCityEnterpriseStations(check.city || item.name, item.lat, item.lng, currencySymbol);
    setStations(newStations);
    setSelectedStation(newStations[0]);
    flyToCoords(item.lng, item.lat);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return undefined;

    const initialCenter = [initialResolved.lng, initialResolved.lat];

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAP_STYLE_URL || LIGHT_MAP_STYLE,
      center: initialCenter,
      zoom: 14.8,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.resize();
      if (initialResolved.lng && initialResolved.lat) {
        map.jumpTo({ center: [initialResolved.lng, initialResolved.lat], zoom: 14.8 });
      }
    });

    return () => {
      userLocationMarkerRef.current?.remove();
      userLocationMarkerRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [initialResolved]);

  // Render Map Markers (whichever location hook is selected turns into bright yellow P marker)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const renderMarkers = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      stations.forEach((st) => {
        const isSelected = Boolean(
          selectedStation && (
            (st.id && selectedStation.id && String(st.id) === String(selectedStation.id)) ||
            (st.name && selectedStation.name && st.name === selectedStation.name) ||
            (Number.isFinite(st.lat) && Number.isFinite(selectedStation.lat) &&
             Math.abs(st.lat - selectedStation.lat) < 0.0008 &&
             Math.abs(st.lng - selectedStation.lng) < 0.0008)
          )
        );

        const el = document.createElement('div');
        el.className = `cal-pin-anchor ${isSelected ? 'active-p-pin' : 'dark-price-pin'}`;
        el.style.cursor = 'pointer';

        if (isSelected) {
          el.innerHTML = `
            <div class="cal-yellow-p-marker big">
              <span class="cal-p-letter">P</span>
              <div class="cal-p-tail big"></div>
            </div>
            <span class="cal-pin-street-label">${st.street || st.name}</span>
          `;
        } else {
          el.innerHTML = `
            <div class="cal-black-price-bubble">
              <span>${st.pinPrice || `${currencySymbol}${st.rate}`}</span>
              <div class="cal-black-tail"></div>
            </div>
          `;
        }

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedStation(st);
          map.flyTo({
            center: [st.lng, st.lat],
            zoom: 15,
            speed: 1.1,
          });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([st.lng, st.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    if (map.isStyleLoaded() || map.loaded()) {
      renderMarkers();
    } else {
      map.once('load', renderMarkers);
    }

    return () => {
      // Clean up previous markers if needed
    };
  }, [stations, selectedStation, currencySymbol]);


  // Mini Map inside Popup Sheet: renders live route from Current Location to Selected Station
  useEffect(() => {
    if (!isPopupOpen || !selectedStation) {
      if (miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
      }
      return undefined;
    }

    let isCancelled = false;

    const timer = setTimeout(() => {
      if (isCancelled || !miniMapContainer.current) return;

      if (miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
      }

      // Determine origin: use user's GPS location if available or passed state, otherwise fallback to local relative origin
      let originLngLat = null;
      if (location?.longitude && location?.latitude) {
        originLngLat = [location.longitude, location.latitude];
      } else if (routeLocation.state?.userOriginLng && routeLocation.state?.userOriginLat) {
        originLngLat = [routeLocation.state.userOriginLng, routeLocation.state.userOriginLat];
      } else if (routeLocation.state?.lat && routeLocation.state?.lon) {
        originLngLat = [routeLocation.state.lon, routeLocation.state.lat];
      }

      if (!originLngLat) {
        originLngLat = [
          Number((selectedStation.lng - 0.012).toFixed(6)),
          Number((selectedStation.lat - 0.008).toFixed(6)),
        ];
      }

      const destLngLat = [selectedStation.lng, selectedStation.lat];

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLngLat[0]},${originLngLat[1]};${destLngLat[0]},${destLngLat[1]}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (isCancelled || !miniMapContainer.current) return;
          const route = data.routes?.[0];
          let coordinates = route?.geometry?.coordinates;

          if (!Array.isArray(coordinates) || coordinates.length < 2) {
            coordinates = [
              originLngLat,
              [originLngLat[0] + (destLngLat[0] - originLngLat[0]) * 0.45 + 0.001, originLngLat[1] + (destLngLat[1] - originLngLat[1]) * 0.35],
              [originLngLat[0] + (destLngLat[0] - originLngLat[0]) * 0.7 - 0.001, originLngLat[1] + (destLngLat[1] - originLngLat[1]) * 0.75],
              destLngLat,
            ];
          }

          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLngLat[1]},${originLngLat[0]}&destination=${destLngLat[1]},${destLngLat[0]}&travelmode=driving`;

          if (route) {
            const distKm = parseFloat((route.distance / 1000).toFixed(1));
            const durationText = calculateRealisticDrivingTime(distKm, route.duration);
            setMiniRouteInfo({
              distance: `${distKm.toFixed(1)} km`,
              duration: durationText,
              googleMapsUrl,
            });
          } else {
            const distKm = parseFloat((getDistanceFromLatLonInKm(originLngLat[1], originLngLat[0], destLngLat[1], destLngLat[0]) * 1.3).toFixed(1));
            const durationText = calculateRealisticDrivingTime(distKm);
            setMiniRouteInfo({
              distance: `${distKm.toFixed(1)} km`,
              duration: durationText,
              googleMapsUrl,
            });
          }

          renderMiniMap(originLngLat, destLngLat, coordinates);
        })
        .catch(() => {
          if (isCancelled || !miniMapContainer.current) return;
          const fallbackCoords = [
            originLngLat,
            [originLngLat[0] + (destLngLat[0] - originLngLat[0]) * 0.45 + 0.001, originLngLat[1] + (destLngLat[1] - originLngLat[1]) * 0.35],
            [originLngLat[0] + (destLngLat[0] - originLngLat[0]) * 0.7 - 0.001, originLngLat[1] + (destLngLat[1] - originLngLat[1]) * 0.75],
            destLngLat,
          ];
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLngLat[1]},${originLngLat[0]}&destination=${destLngLat[1]},${destLngLat[0]}&travelmode=driving`;
          const distKm = parseFloat((getDistanceFromLatLonInKm(originLngLat[1], originLngLat[0], destLngLat[1], destLngLat[0]) * 1.3).toFixed(1));
          const durationText = calculateRealisticDrivingTime(distKm);
          setMiniRouteInfo({
            distance: `${distKm.toFixed(1)} km`,
            duration: durationText,
            googleMapsUrl,
          });
          renderMiniMap(originLngLat, destLngLat, fallbackCoords);
        });

      function renderMiniMap(origin, dest, routeCoords) {
        if (!miniMapContainer.current) return;

        const miniMap = new maplibregl.Map({
          container: miniMapContainer.current,
          style: import.meta.env.VITE_MAP_STYLE_URL || LIGHT_MAP_STYLE,
          center: [(origin[0] + dest[0]) / 2, (origin[1] + dest[1]) / 2],
          zoom: 14,
          interactive: true,
          attributionControl: false,
        });

        miniMapRef.current = miniMap;

        miniMap.on('load', () => {
          if (isCancelled) return;

          miniMap.addSource('mini-route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoords,
              },
            },
          });

          // Outer route casing
          miniMap.addLayer({
            id: 'mini-route-casing',
            type: 'line',
            source: 'mini-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#bfdbfe',
              'line-width': 7,
              'line-opacity': 0.7,
            },
          });

          // Inner route line
          miniMap.addLayer({
            id: 'mini-route-line',
            type: 'line',
            source: 'mini-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#2563eb',
              'line-width': 4.5,
              'line-opacity': 0.95,
            },
          });

          // Origin marker (blue pulse)
          const originEl = document.createElement('div');
          originEl.className = 'cal-mini-origin-pulse-marker';
          originEl.innerHTML = `
            <div class="cal-pulse-ring"></div>
            <div class="cal-origin-inner-dot"></div>
          `;
          new maplibregl.Marker({ element: originEl })
            .setLngLat(origin)
            .addTo(miniMap);

          // Destination marker (Yellow P Pin matching Image 2)
          const destEl = document.createElement('div');
          destEl.className = 'cal-pin-anchor active-p-pin';
          destEl.innerHTML = `
            <div class="cal-yellow-p-marker">
              <span class="cal-p-letter">P</span>
              <div class="cal-p-tail"></div>
            </div>
            <span class="cal-pin-street-label">${selectedStation?.street || 'Station Rd'}</span>
          `;
          new maplibregl.Marker({ element: destEl })
            .setLngLat(dest)
            .addTo(miniMap);

          // Fit bounds
          const bounds = new maplibregl.LngLatBounds();
          routeCoords.forEach((pt) => bounds.extend(pt));
          bounds.extend(origin);
          bounds.extend(dest);
          miniMap.fitBounds(bounds, {
            padding: { top: 40, bottom: 40, left: 40, right: 40 },
            maxZoom: 15.5,
            duration: 0,
          });
        });
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
      }
    };
  }, [isPopupOpen, selectedStation, location]);

  // Total price calculation
  const totalAmount = useMemo(() => {
    const rate = selectedStation?.rate || 6;
    return (durationHours * rate).toFixed(2);
  }, [durationHours, selectedStation]);

  const displayPriceFormatted = useMemo(() => {
    return totalAmount.replace('.', ',');
  }, [totalAmount]);

  const durationLabel = useMemo(() => {
    const hours = Math.floor(durationHours);
    const mins = Math.round((durationHours - hours) * 60);
    if (mins === 0) return `${hours} h`;
    return `${hours} h ${mins} m`;
  }, [durationHours]);

  const handleLocateMe = () => {
    if (isLocating) return;
    setIsLocating(true);

    const onLocated = (lat, lng) => {
      setIsLocating(false);

      // 1. Show the user's exact current location with a live pulsing blue marker on map
      updateUserLocationMarker(lat, lng);

      // 2. Center and fly the map right to the user's current location
      const map = mapRef.current;
      if (map) {
        map.flyTo({
          center: [lng, lat],
          zoom: 15.5,
          speed: 1.2,
        });
      }

      // 3. Find the nearest parking station to the user's location
      let nearest = null;
      let minDistance = Infinity;
      stations.forEach((st) => {
        const d = getDistanceFromLatLonInKm(lat, lng, st.lat, st.lng);
        if (d < minDistance) {
          minDistance = d;
          nearest = st;
        }
      });

      if (nearest) {
        setSelectedStation(nearest);
        setSearchQuery(`Near ${nearest.name}`);
      } else {
        setSearchQuery('My Location');
      }
    };

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => onLocated(pos.coords.latitude, pos.coords.longitude),
        () => {
          if (location?.latitude && location?.longitude) {
            onLocated(location.latitude, location.longitude);
          } else {
            onLocated(22.5645, 72.9289);
          }
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else if (location?.longitude && location?.latitude) {
      onLocated(location.latitude, location.longitude);
    } else {
      setIsLocating(false);
    }
  };

  // Payment / Proceed to checkout existing flow
  const handleProceedPay = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      navigate('/book', {
        state: {
          station: selectedStation,
          slot: slotNumber,
          durationHours,
          amount: parseFloat(totalAmount),
          entryTime: entryTime,
          exitTime: exitTime,
        },
      });
    }, 300);
  };

  const handleAdjustDuration = () => {
    // Cycle duration between 2, 4, 5.5, 8 hours
    const opts = [2, 4, 5.5, 8];
    const currIdx = opts.indexOf(durationHours);
    const nextIdx = (currIdx + 1) % opts.length;
    const nextHours = opts[nextIdx];
    setDurationHours(nextHours);

    // Synchronize exitTime if entryTime exists
    try {
      const parts = entryTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (parts) {
        let h = parseInt(parts[1], 10);
        const m = parseInt(parts[2], 10);
        const ampm = parts[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const totalMins = h * 60 + m + Math.round(nextHours * 60);
        let endH = Math.floor((totalMins / 60) % 24);
        const endM = String(totalMins % 60).padStart(2, '0');
        const endAmpm = endH >= 12 ? 'PM' : 'AM';
        endH = endH % 12 || 12;
        setExitTime(`${endH}:${endM} ${endAmpm}`);
      }
    } catch {}
  };

  // If the location is outside our service area, render the UnserviceableAreaView (Matching Image 3)
  if (!activeServiceCheck?.isServiceable) {
    return (
      <UnserviceableAreaView
        locationName={activeServiceCheck?.formattedLocation || 'Changa, Gujarat, 388421, India'}
        onSelectCity={(city) => {
          setActiveServiceCheck({ isServiceable: true, city, formattedLocation: city.name });
          const primaryStation = city.stations[0];
          setSelectedStation(primaryStation);
          const cityPins = generatePinsForLocation(
            primaryStation.lat,
            primaryStation.lng,
            primaryStation.name,
            primaryStation.address,
            primaryStation.street,
            currencySymbol
          );
          setStations(cityPins);
          setSearchQuery(city.name);
          setTimeout(() => {
            flyToCoords(primaryStation.lng, primaryStation.lat);
          }, 100);
        }}
      />
    );
  }

  return (
    <div className="cal-map-screen-wrapper">
      {/* ── Main Map Canvas ────────────────────────────────────────────── */}
      <div ref={mapContainer} className="cal-maplibregl-canvas" />

      {/* ── SVG Decorative Labels Over Map (matching street layout in image for SF) ── */}
      {isSFMode && (
        <div className="cal-map-static-overlays" pointerEvents="none">
          <span className="cal-street-label north-beach">NORTH<br />BEACH</span>
          <span className="cal-street-label telegraph-hill">TELEGRAPH<br />HILL</span>
          <span className="cal-street-label chinatown">CHINATOWN</span>
          <span className="cal-street-name coit-tower">Coit Tower</span>
          <span className="cal-street-name union-st">Union St</span>
          <span className="cal-street-name green-st">Green St</span>
          <span className="cal-street-name vallejo-st">Vallejo St</span>
          <span className="cal-street-name pacific-ave">Pacific Ave</span>
          <span className="cal-street-name city-lights">City Lights Booksellers</span>
          <span className="cal-street-name transamerica">Transamerica Pyramid</span>
          <span className="cal-street-name sansome-st">Sansome St</span>
        </div>
      )}

      {/* ── Top Left Floating Back Button ('<-') ──────────────────────── */}
      <button
        type="button"
        className="cal-top-back-btn"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/search');
          }
        }}
        aria-label="Back"
        title="Go Back"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* ── Top Right Floating "My car" Pill ──────────────────────────── */}
      <div className="cal-top-car-pill" onClick={() => navigate('/profile')}>
        <div className="cal-car-icon-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="9" rx="2" fill="#fff" />
            <path d="M5 11L7 5h10l2 6" stroke="#fff" strokeWidth="2" />
            <circle cx="7.5" cy="16.5" r="2" fill="#1c1d21" />
            <circle cx="16.5" cy="16.5" r="2" fill="#1c1d21" />
          </svg>
        </div>
        <div className="cal-car-pill-text">
          <span className="cal-car-sub">My car</span>
          <span className="cal-car-plate">A16591</span>
        </div>
      </div>

      {/* ── Floating Locate / Compass Button on Right ──────────────────── */}
      <button
        type="button"
        className={`cal-locate-compass-btn ${isLocating ? 'locating' : ''}`}
        onClick={handleLocateMe}
        aria-label="Locate me"
        title={isLocating ? 'Locating your position...' : 'Locate my current position'}
        disabled={isLocating}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </button>

      {/* ── Bottom Floating Card (Station Info Box) ───────────────────── */}
      {/* On click, triggers popup from bottom to top! */}
      <div
        className="cal-bottom-card"
        onClick={() => setIsPopupOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open Parking Details"
      >
        <div className="cal-card-info-left">
          <h2 className="cal-card-title">{selectedStation?.name || 'California Parking'}</h2>
          <p className="cal-card-addr">{selectedStation?.address || '555 Jackson St, SF'}</p>
          <div className="cal-card-meta-row">
            <div className="cal-meta-item">
              <svg width="15" height="13" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.2">
                <rect x="2" y="8" width="20" height="10" rx="3" />
                <path d="M5 8l2-4h10l2 4" />
                <circle cx="7" cy="14" r="1.5" fill="#222" />
                <circle cx="17" cy="14" r="1.5" fill="#222" />
              </svg>
              <span>{selectedStation?.slots || 40}</span>
            </div>
            <div className="cal-meta-item">
              <span className="cal-currency-symbol">{currencySymbol}</span>
              <span>{selectedStation?.rate ? `${Number(selectedStation.rate).toFixed(2)}/h` : '6.00/h'}</span>
            </div>
          </div>
        </div>

        <div className="cal-card-thumb-wrap">
          <img src={parkingSlotThumb} alt="Parking Bay" className="cal-card-thumb-img" />
        </div>
      </div>

      {/* ── Suggestions Dropdown (Pops UP above the bottom bar) ────────── */}
      {showSuggestions && (
        <div className="cal-map-suggestions-dropdown">
          <div className="cal-suggestions-header">
            <span className="cal-suggestions-title">Change Location</span>
            <button
              type="button"
              className="cal-suggestions-close"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowSuggestions(false);
              }}
            >
              Done
            </button>
          </div>
          <div className="cal-suggestions-list">
            {filteredSuggestions.map((item) => (
              <div
                key={item.name}
                className="cal-suggestion-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectSuggestion(item);
                }}
              >
                <div className="cal-sugg-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fecb35" strokeWidth="2.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div className="cal-sugg-text">
                  <span className="cal-sugg-name">{item.name}</span>
                  <span className="cal-sugg-addr">{item.address}</span>
                </div>
                <span className="cal-sugg-arrow">➔</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Workable Interactive Bottom Location Search Bar ─────────── */}
      <div className={`cal-bottom-search-pill ${isSearchFocused ? 'focused' : ''}`}>
        <div className="cal-search-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="cal-map-search-input"
            value={searchQuery}
            placeholder="Change location or search area..."
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsSearchFocused(false);
                setShowSuggestions(false);
              }, 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyNewLocation(searchQuery);
              }
            }}
          />
        </div>

        <div className="cal-search-actions">
          {searchQuery && (
            <button
              type="button"
              className="cal-search-clear-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear input"
              title="Clear"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            className="cal-search-submit-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleApplyNewLocation(searchQuery);
            }}
            aria-label="Change location"
            title="Change Location"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── EXACT IMAGE 2 POPUP SHEET (Clean, Uncluttered, Pure) ────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isPopupOpen && (
        <div className="cal-popup-backdrop" onClick={() => setIsPopupOpen(false)}>
          <div
            className="cal-popup-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="cal-sheet-drag-handle" onClick={() => setIsPopupOpen(false)} />

            {/* Upper Card: Mini Map Card with Real Route (Matching Image 2) */}
            <div className="cal-popup-mini-map-box">
              <div ref={miniMapContainer} className="cal-popup-mini-map-canvas" />
              {miniRouteInfo && (
                <button
                  type="button"
                  className="cal-mini-route-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (miniRouteInfo.googleMapsUrl) {
                      window.open(miniRouteInfo.googleMapsUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  title="Open driving route in Google Maps (opens in new tab)"
                  aria-label="Open route in Google Maps"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                  <span>{miniRouteInfo.duration} • {miniRouteInfo.distance}</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cal-external-link-icon"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Station Title & Meta */}
            <div className="cal-popup-details-header">
              <h2 className="cal-popup-title">
                {selectedStation?.name || (isSFMode ? 'California Parking' : 'Anand Smart Parking')}
              </h2>
              <p className="cal-popup-address">
                {selectedStation?.address || (isSFMode ? '555 Jackson St, SF' : 'Vallabh Vidyanagar, Anand')}
              </p>

              <div className="cal-popup-meta-row">
                <div className="cal-meta-item">
                  <svg width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.2">
                    <rect x="2" y="8" width="20" height="10" rx="3" />
                    <path d="M5 8l2-4h10l2 4" />
                    <circle cx="7" cy="14" r="1.5" fill="#222" />
                    <circle cx="17" cy="14" r="1.5" fill="#222" />
                  </svg>
                  <span className="cal-popup-meta-val">{selectedStation?.slots || 40}</span>
                </div>
                <div className="cal-meta-item">
                  <span className="cal-currency-symbol">{currencySymbol}</span>
                  <span className="cal-popup-meta-val">
                    {selectedStation?.rate ? `${Number(selectedStation.rate).toFixed(2)}/h` : '6.00/h'}
                  </span>
                </div>
              </div>
            </div>

            {/* Side-by-side Configuration Cards (Matching Image 2) */}
            <div className="cal-popup-tiles-grid">
              {/* Card 1: Parking Place */}
              <div className="cal-popup-tile">
                <div className="cal-tile-black-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                    <rect x="3" y="4" width="8" height="16" rx="2" fill="none" />
                    <rect x="13" y="4" width="8" height="16" rx="2" fill="none" />
                    <circle cx="7" cy="8" r="1.5" fill="#fff" />
                    <circle cx="17" cy="16" r="1.5" fill="#fff" />
                  </svg>
                </div>
                <div className="cal-tile-center-val">B1</div>
                <div className="cal-tile-sub-label">Parking Place</div>
              </div>

              {/* Card 2: Time Duration (Clickable to adjust time) */}
              <div
                className="cal-popup-tile clickable"
                onClick={handleAdjustDuration}
                title="Tap to adjust duration"
              >
                <div className="cal-tile-black-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 14" />
                  </svg>
                </div>
                <div className="cal-tile-center-val">{durationLabel}</div>
                <div className="cal-tile-sub-label">Time</div>
              </div>
            </div>

            {/* Bottom Row: Total Price + Bright Yellow Pay CTA (Matching Image 2) */}
            <div className="cal-popup-action-row">
              <div className="cal-popup-price-display">
                <span className="cal-price-currency">{currencySymbol}</span>
                <span className="cal-price-number">{displayPriceFormatted}</span>
              </div>

              <button
                type="button"
                className="cal-popup-pay-btn"
                onClick={handleProceedPay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing…' : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
