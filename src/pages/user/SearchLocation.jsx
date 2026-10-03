import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { getParkingStations } from '../../data/parkingStations';
import { getGeoapifyApiKey } from '../../services/geoapifyService';
import { checkLocationServiceability, SERVICEABLE_CITIES } from '../../data/serviceableCities';
import avatarJack from '../../assets/avatar-jack.jpg';
import WheelTimePickerModal from '../../components/user/WheelTimePickerModal';
import './SearchLocation.css';

const DEFAULT_RECENTS = [
  { id: '1', title: 'Central Campus Lot A', subtitle: 'Shastri Maidan Marg, VV Nagar • 1.2 km' },
  { id: '2', title: 'Anand Railway Station Parking', subtitle: 'Station Rd, Anand • 4.1 km' },
  { id: '3', title: 'Nadiad Junction Smart Bay', subtitle: 'Station Rd, Nadiad • Active Hub' },
];

const FILTER_TAGS = [
  { id: 'near_me', label: 'Near me', icon: 'near_me' },
  { id: 'cheapest', label: 'Cheapest (₹)' },
  { id: 'covered', label: 'Covered roof', icon: 'roofing' },
  { id: 'ev', label: 'EV charging ⚡' },
  { id: 'open_now', label: 'Open now', dot: true },
  { id: 'anpr', label: 'ANPR Express', icon: 'bolt' },
];

const KNOWN_GEO = {
  anand: { lat: 22.5645, lon: 72.9289, city: 'Anand' },
  vidyanagar: { lat: 22.5539, lon: 72.9242, city: 'Vallabh Vidyanagar' },
  vallabh: { lat: 22.5539, lon: 72.9242, city: 'Vallabh Vidyanagar' },
  changa: { lat: 22.5996, lon: 72.8205, city: 'Changa' },
  charusat: { lat: 22.5996, lon: 72.8205, city: 'Changa' },
  ahmedabad: { lat: 23.0225, lon: 72.5714, city: 'Ahmedabad' },
  vadodara: { lat: 22.3072, lon: 73.1812, city: 'Vadodara' },
  surat: { lat: 21.1702, lon: 72.8311, city: 'Surat' },
  rajkot: { lat: 22.3039, lon: 70.8022, city: 'Rajkot' },
  gandhinagar: { lat: 23.2156, lon: 72.6369, city: 'Gandhinagar' },
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
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

function getNowTimeString() {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMin = Math.ceil(minutes / 15) * 15;
  now.setMinutes(roundedMin, 0, 0);

  const entryH = String(now.getHours()).padStart(2, '0');
  const entryM = String(now.getMinutes()).padStart(2, '0');
  return `${entryH}:${entryM}`;
}

function addHoursToTime(timeStr, hours) {
  if (!timeStr) return '12:00';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10) || 0;
  let m = parseInt(mStr, 10) || 0;
  const totalMin = h * 60 + m + Math.round(hours * 60);
  const newH = Math.floor((totalMin / 60) % 24);
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

function formatTime12(timeStr) {
  if (!timeStr) return '12:00 PM';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return timeStr;
  const m = mStr ? mStr.slice(0, 2) : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function calcHoursDifference(entryStr, exitStr) {
  if (!entryStr || !exitStr) return 2;
  const [eh, em] = entryStr.split(':').map((v) => parseInt(v, 10) || 0);
  const [xh, xm] = exitStr.split(':').map((v) => parseInt(v, 10) || 0);
  let diffMinutes = (xh * 60 + xm) - (eh * 60 + em);
  if (diffMinutes <= 0) {
    diffMinutes += 24 * 60; // wraps into next day
  }
  const hours = Math.round((diffMinutes / 60) * 10) / 10;
  return Math.max(1, Math.min(12, Math.round(hours)));
}

function SearchLocation() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const searchContainerRef = useRef(null);
  const [location, setLocation] = useState(routeLocation.state?.prefill || '');
  const [isLocating, setIsLocating] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['near_me']);
  const [scheduleMode, setScheduleMode] = useState('now'); // 'now' | 'later'
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [durationHours, setDurationHours] = useState(2);
  const [entryTime, setEntryTime] = useState(() => getNowTimeString());
  const [exitTime, setExitTime] = useState(() => addHoursToTime(getNowTimeString(), 2));
  const [recentSearches, setRecentSearches] = useState(DEFAULT_RECENTS);
  const [stations, setStations] = useState([]);

  // Drum Roller Wheel Time Picker modal state (Reference Image match)
  const [wheelPickerState, setWheelPickerState] = useState({
    isOpen: false,
    type: 'entry',
    heading: 'Entry Set Time',
  });

  const openEntryPicker = () => {
    setWheelPickerState({
      isOpen: true,
      type: 'entry',
      heading: 'Entry Set Time',
    });
  };

  const openExitPicker = () => {
    setWheelPickerState({
      isOpen: true,
      type: 'exit',
      heading: 'Exit Set Time',
    });
  };

  const closeWheelPicker = () => {
    setWheelPickerState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleWheelTimeConfirm = (newTimeStr) => {
    if (wheelPickerState.type === 'entry') {
      handleEntryTimeChange(newTimeStr);
    } else {
      handleExitTimeChange(newTimeStr);
    }
  };

  const autocompleteRef = useRef(null);
  const durationHoursRef = useRef(durationHours);
  durationHoursRef.current = durationHours;
  const entryTimeRef = useRef(entryTime);
  entryTimeRef.current = entryTime;
  const exitTimeRef = useRef(exitTime);
  exitTimeRef.current = exitTime;
  const scheduleModeRef = useRef(scheduleMode);
  scheduleModeRef.current = scheduleMode;
  const selectedDayIndexRef = useRef(selectedDayIndex);
  selectedDayIndexRef.current = selectedDayIndex;
  const locationRef = useRef(location);
  locationRef.current = location;
  const selectedGeoRef = useRef(null);
  const handleSearchRef = useRef(null);

  // Fetch real parking stations
  useEffect(() => {
    getParkingStations()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStations(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const searchContainer = searchContainerRef.current;
    if (!searchContainer) return undefined;

    searchContainer.replaceChildren();

    const autocomplete = new GeocoderAutocomplete(searchContainer, getGeoapifyApiKey(), {
      placeholder: 'Enter location (e.g. Vallabh Vidyanagar, Anand)',
      skipIcons: true,
      clearButton: false,
    });
    autocompleteRef.current = autocomplete;

    // Set initial value if prefilled
    if (locationRef.current) {
      autocomplete.setValue(locationRef.current);
    }

    // Auto-focus if navigated from Dashboard
    if (routeLocation.state?.autoFocus) {
      setTimeout(() => {
        const inputEl = searchContainer.querySelector('input');
        if (inputEl) {
          inputEl.focus();
          if (locationRef.current) {
            const len = inputEl.value.length;
            inputEl.setSelectionRange(len, len);
          }
        }
      }, 50);
    }

    // Auto-locate if GPS clicked from Dashboard
    if (routeLocation.state?.autoLocate) {
      setTimeout(() => {
        handleSetCurrentLocation();
      }, 100);
    }

    // Capture typing in the input in real-time
    const handleInput = (e) => {
      if (e.target && e.target.value !== undefined) {
        setLocation(e.target.value);
        locationRef.current = e.target.value;
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const val = e.target?.value || locationRef.current;
        if (val && handleSearchRef.current) {
          handleSearchRef.current(val);
        }
      }
    };

    searchContainer.addEventListener('input', handleInput);
    searchContainer.addEventListener('change', handleInput);
    searchContainer.addEventListener('keydown', handleKeyDown);

    autocomplete.on('clear', () => {
      setLocation('');
      locationRef.current = '';
    });

    autocomplete.on('select', (feature) => {
      const properties = feature?.properties;
      if (!properties) return;

      const formatted = properties.formatted || properties.address_line1 || properties.city || 'Selected location';
      setLocation(formatted);
      locationRef.current = formatted;
      selectedGeoRef.current = {
        lat: properties.lat,
        lon: properties.lon,
        address: formatted,
        city: properties.city || properties.state || formatted.split(',')[0],
      };

      // Add to recent searches
      setRecentSearches((prev) => {
        if (prev.some((item) => item.title.toLowerCase() === formatted.toLowerCase())) return prev;
        return [{ id: String(Date.now()), title: formatted, subtitle: `${properties.city || 'Gujarat'} • Nearby` }, ...prev.slice(0, 4)];
      });
    });

    return () => {
      searchContainer.removeEventListener('input', handleInput);
      searchContainer.removeEventListener('keydown', handleKeyDown);
      autocomplete.destroy?.();
      autocompleteRef.current = null;
      searchContainer.replaceChildren();
    };
  }, [navigate]);

  // Day chips dynamically computed for Next 3 days
  const dayOptions = useMemo(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMonth = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      options.push(`${dayName}, ${dayMonth}`);
    }
    return options;
  }, []);

  // Compute valid until string based on exitTime
  const validUntilLabel = useMemo(() => {
    return `Valid until ${formatTime12(exitTime)}`;
  }, [exitTime]);

  const toggleFilter = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleStepDuration = (delta) => {
    setDurationHours((prev) => {
      const nextDuration = Math.min(12, Math.max(1, prev + delta));
      setExitTime(addHoursToTime(entryTimeRef.current, nextDuration));
      return nextDuration;
    });
  };

  const handleEntryTimeChange = (newVal) => {
    if (!newVal) return;
    setEntryTime(newVal);
    setExitTime(addHoursToTime(newVal, durationHours));
  };

  const handleExitTimeChange = (newVal) => {
    if (!newVal) return;
    setExitTime(newVal);
    const calculatedHours = calcHoursDifference(entryTime, newVal);
    setDurationHours(calculatedHours);
  };

  const handleToggleScheduleMode = (mode) => {
    setScheduleMode(mode);
    if (mode === 'now') {
      const nowVal = getNowTimeString();
      setEntryTime(nowVal);
      setExitTime(addHoursToTime(nowVal, durationHours));
    }
  };

  const handleSearch = (customLoc) => {
    let targetLoc = typeof customLoc === 'string' && customLoc.trim() ? customLoc.trim() : (locationRef.current || location || '').trim();
    const inputEl = searchContainerRef.current?.querySelector('input');
    if (inputEl && inputEl.value && !customLoc) {
      targetLoc = inputEl.value.trim();
    }
    if (!targetLoc) {
      targetLoc = 'Vallabh Vidyanagar, Anand';
    }

    // Save to recents
    setRecentSearches((prev) => {
      if (prev.some((item) => item.title.toLowerCase() === targetLoc.toLowerCase())) return prev;
      return [{ id: String(Date.now()), title: targetLoc, subtitle: 'Recent search' }, ...prev.slice(0, 4)];
    });

    let geo = selectedGeoRef.current?.address === targetLoc ? selectedGeoRef.current : null;
    if (!geo) {
      const lower = targetLoc.toLowerCase();
      const matchedKey = Object.keys(KNOWN_GEO).find((key) => lower.includes(key));
      if (matchedKey) {
        geo = KNOWN_GEO[matchedKey];
      } else if (!customLoc && !locationRef.current) {
        geo = KNOWN_GEO.anand;
      }
    }

    // Check if the searched location is within supported service areas
    const serviceCheck = checkLocationServiceability(targetLoc, geo?.lat, geo?.lon);
    if (!serviceCheck.isServiceable) {
      navigate('/map', {
        state: {
          destination: targetLoc,
          address: targetLoc,
          location: targetLoc,
          isServiceable: false,
        },
      });
      return;
    }

    navigate('/map', {
      state: {
        destination: targetLoc,
        address: targetLoc,
        location: targetLoc,
        city: geo?.city || targetLoc.split(',')[0].trim(),
        lat: geo?.lat,
        lon: geo?.lon,
        durationHours: durationHoursRef.current,
        entryTime: formatTime12(entryTimeRef.current),
        exitTime: formatTime12(exitTimeRef.current),
        scheduleMode: scheduleModeRef.current,
        targetDay: dayOptions[selectedDayIndexRef.current],
        openPopup: false,
        isServiceable: true,
      },
    });
  };
  handleSearchRef.current = handleSearch;

  const handleClear = () => {
    setLocation('');
    locationRef.current = '';
    autocompleteRef.current?.setValue('');
    const inputEl = searchContainerRef.current?.querySelector('input');
    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
    }
  };

  const handleSetCurrentLocation = () => {
    setIsLocating(true);

    const onLocationFound = (lat, lon) => {
      setIsLocating(false);

      // Check if user's current GPS location is serviceable
      const serviceCheck = checkLocationServiceability('', lat, lon);
      if (!serviceCheck.isServiceable) {
        const unservLoc = 'Changa, Gujarat, 388421, India';
        setLocation(unservLoc);
        locationRef.current = unservLoc;
        navigate('/map', {
          state: {
            destination: unservLoc,
            address: unservLoc,
            location: unservLoc,
            isServiceable: false,
            lat,
            lon,
          },
        });
        return;
      }

      const candidates = stations.length > 0 ? stations : [
        {
          id: 'station_1',
          name: 'Central Campus Lot A',
          address: 'Shastri Maidan Marg, VV Nagar',
          latitude: 22.5539,
          longitude: 72.9242,
          pricePerHour: 40,
          availableSlots: 24,
          totalSlots: 50,
          tag: 'ANPR',
          feature: 'Fast Gate',
        },
        {
          id: 'station_2',
          name: 'Station Road Covered',
          address: 'Near Amul Dairy, Anand',
          latitude: 22.5645,
          longitude: 72.9289,
          pricePerHour: 35,
          availableSlots: 8,
          totalSlots: 30,
          tag: 'CCTV',
          feature: 'Shaded Roof',
        },
        {
          id: 'station_3',
          name: 'Anand Smart Parking Hub',
          address: 'Station Rd, Anand',
          latitude: 22.5610,
          longitude: 72.9320,
          pricePerHour: 30,
          availableSlots: 40,
          totalSlots: 60,
          tag: 'ANPR',
          feature: 'Live Gate',
        },
      ];

      let nearest = null;
      let minDistance = Infinity;

      candidates.forEach((st) => {
        const sLat = st.latitude ?? st.lat;
        const sLng = st.longitude ?? st.lng ?? st.lon;
        if (Number.isFinite(sLat) && Number.isFinite(sLng)) {
          const d = getDistanceFromLatLonInKm(lat, lon, sLat, sLng);
          if (d < minDistance) {
            minDistance = d;
            nearest = { ...st, distance: parseFloat(d.toFixed(1)) };
          }
        }
      });

      if (!nearest || minDistance > 60) {
        nearest = {
          id: 'nearest_local',
          name: 'Anand Smart Parking',
          address: 'Vallabh Vidyanagar, Anand',
          latitude: lat,
          longitude: lon,
          distance: 0.2,
          pricePerHour: 30,
          availableSlots: 40,
          totalSlots: 50,
          tag: 'ANPR',
          feature: 'Closest to you',
        };
      }

      const locName = `Near ${nearest.name}`;
      setLocation(locName);
      locationRef.current = locName;
      autocompleteRef.current?.setValue(locName);
      selectedGeoRef.current = { lat, lon, address: locName, city: 'Anand' };
      const inputEl = searchContainerRef.current?.querySelector('input');
      if (inputEl) inputEl.value = locName;

      // Automatically navigate to map centered on detected location with the nearest station selected
      navigate('/map', {
        state: {
          destination: nearest.name,
          address: nearest.address,
          location: locName,
          station: nearest,
          lat,
          lon,
          isCurrentLocation: true,
          durationHours: durationHoursRef.current,
          entryTime: formatTime12(entryTimeRef.current),
          exitTime: formatTime12(exitTimeRef.current),
          openPopup: false,
        },
      });
    };

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationFound(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          onLocationFound(22.5645, 72.9289);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      onLocationFound(22.5645, 72.9289);
    }
  };

  const handleSelectRecent = (itemTitle) => {
    setLocation(itemTitle);
    locationRef.current = itemTitle;
    autocompleteRef.current?.setValue(itemTitle);
    const inputEl = searchContainerRef.current?.querySelector('input');
    if (inputEl) {
      inputEl.value = itemTitle;
    }
    handleSearch(itemTitle);
  };

  const handleSelectStation = (station) => {
    navigate('/map', {
      state: {
        station,
        address: station.address || station.name,
        destination: station.name,
        durationHours,
        amount: (station.pricePerHour || 30) * durationHours,
        entryTime: formatTime12(entryTime),
        exitTime: formatTime12(exitTime),
        scheduleMode,
        targetDay: scheduleMode === 'later' ? dayOptions[selectedDayIndex] : 'Today',
        openPopup: true,
      },
    });
  };

  // Filter or fallback station display cards
  const displayStations = useMemo(() => {
    const locLower = (location || '').toLowerCase().trim();
    const matchedCity = SERVICEABLE_CITIES.find((c) =>
      c.aliases.some((alias) => locLower.includes(alias)) ||
      locLower.includes(c.shortName.toLowerCase()) ||
      locLower.includes(c.name.toLowerCase())
    ) || (stations.length === 0 ? SERVICEABLE_CITIES[0] : null);

    if (matchedCity && matchedCity.stations?.length > 0) {
      return matchedCity.stations.map((st, idx) => ({
        id: st.id,
        name: st.name,
        address: st.address,
        street: st.street,
        latitude: st.lat,
        longitude: st.lng,
        lat: st.lat,
        lng: st.lng,
        distance: idx === 0 ? 0.6 : idx === 1 ? 1.4 : idx === 2 ? 2.1 : 3.2,
        pricePerHour: st.rate,
        availableSlots: st.slots,
        totalSlots: st.totalSlots,
        tag: st.tag,
        feature: st.feature,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiXTEhe1qZRY7qEOIb4SGgVFFocxzL1SNgLwL7WUt2SvmNC3uw0AmEkmnJeBVIrOW7NdiEXITYwsmiLHGi2R3CcWVIXlqCj976VnnSWOoXfUk4VJesiNOkjWoOnOZbD2P4aR0nEPOEcAhAlLb4aC1NSRCeVfeCFrWDz3K9vMsobgmV2We6Ds_WlRVUaD558Y8pACdaudHPs-3hJ4fH-CHSMfKX19Y1SUK4qYryyXo6yHcGNcMbTnNm',
      }));
    }

    if (stations.length > 0) {
      return stations.slice(0, 6);
    }

    return SERVICEABLE_CITIES[0].stations;
  }, [location, stations]);

  // Dynamically calculate current available slots for the active location/city
  const availableSlotsCount = useMemo(() => {
    const locLower = (location || '').toLowerCase().trim();
    if (!locLower) return 0;

    // 1. If user typed/selected a known city or alias
    const matchedCity = SERVICEABLE_CITIES.find((c) =>
      c.aliases.some((alias) => locLower.includes(alias)) ||
      locLower.includes(c.shortName.toLowerCase()) ||
      locLower.includes(c.name.toLowerCase())
    );

    if (matchedCity && matchedCity.stations?.length > 0) {
      return matchedCity.stations.reduce((sum, s) => sum + (s.slots || 0), 0);
    }

    // 2. If stations from database exist
    if (stations.length > 0) {
      const sum = stations.reduce((acc, s) => acc + (Number(s.availableSlots || s.slots) || 0), 0);
      if (sum > 0) return sum;
    }

    // 3. Fallback to display stations sum (24 + 8 = 32 slots)
    return displayStations.reduce((acc, s) => acc + (Number(s.availableSlots || s.slots) || 0), 0);
  }, [location, stations, displayStations]);

  return (
    <div className="sl-page-root">
      {/* Top Fixed App Bar */}
      <header className="sl-top-bar">
        <div className="sl-top-bar-inner">
          <div className="sl-logo-group" onClick={() => navigate('/dashboard')}>
            <div className="sl-brand-circle">P</div>
            <div className="sl-brand-text">
              <span className="sl-brand-name">VeloxPark</span>
              <span className="sl-brand-sub">Smart Anand</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="sl-desktop-nav">
            <button
              type="button"
              className="sl-desk-nav-link"
              onClick={() => navigate('/dashboard')}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              className="sl-desk-nav-link active"
              onClick={() => navigate('/search')}
            >
              <span className="material-symbols-outlined">explore</span>
              <span>Find Spots</span>
            </button>
            <button
              type="button"
              className="sl-desk-nav-link"
              onClick={() => navigate('/map')}
            >
              <span className="material-symbols-outlined">map</span>
              <span>Live Map</span>
            </button>
            <button
              type="button"
              className="sl-desk-nav-link"
              onClick={() => navigate('/history')}
            >
              <span className="material-symbols-outlined">receipt_long</span>
              <span>History</span>
            </button>
          </nav>

          <div className="sl-top-actions">
            <button
              type="button"
              className="sl-icon-btn"
              aria-label="Notifications"
              onClick={() => alert('All regional smart barriers operational')}
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="sl-avatar-link"
              onClick={() => navigate('/profile')}
              aria-label="Profile"
            >
              <img src={avatarJack} alt="Profile" className="sl-avatar-img" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="sl-main-scroll">
        <div className="sl-content-wrapper">
          {/* Subheader / Page Title */}
          <div className="sl-page-head">
            <button
              type="button"
              className="sl-round-btn"
              onClick={() => navigate('/dashboard')}
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="sl-head-title-col">
              <h1 className="sl-headline">Find parking</h1>
              <span className="sl-network-status">
                <span className="sl-pulse-dot" /> Gujarat Central Network
              </span>
            </div>
            <button
              type="button"
              className="sl-round-btn filter-trigger"
              aria-label="Filters"
            >
              <span className="material-symbols-outlined">tune</span>
              <span className="sl-btn-badge" />
            </button>
          </div>

          {/* Big Rounded Search Input Bar */}
          <div className="sl-search-wrap">
            <div className="sl-search-pill">
              <span className="material-symbols-outlined sl-search-icon">search</span>
              <div ref={searchContainerRef} className="sl-search-input sl-geo-autocomplete" />
              {location && (
                <button
                  type="button"
                  className="sl-clear-input-btn"
                  onClick={handleClear}
                  aria-label="Clear input"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
              <button
                type="button"
                className={`sl-my-loc-btn ${isLocating ? 'locating' : ''}`}
                onClick={handleSetCurrentLocation}
                aria-label="Detect Current Location"
                title="Detect current location and show nearest parking"
                disabled={isLocating}
              >
                <span className="material-symbols-outlined filled">
                  {isLocating ? 'progress_activity' : 'my_location'}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop 2-Column Grid / Mobile Flow Layout */}
          <div className="sl-grid-layout">
            {/* Left Column: Filter ribbon, Schedule, Recents, Action */}
            <div className="sl-grid-controls">
              {/* Quick Filter Chips Ribbon */}
              <div className="sl-filter-ribbon">
                {FILTER_TAGS.map((chip) => {
                  const active = activeFilters.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      className={`sl-filter-chip ${active ? 'active' : ''}`}
                      onClick={() => toggleFilter(chip.id)}
                    >
                      {chip.icon && (
                        <span className="material-symbols-outlined chip-icon">
                          {chip.icon}
                        </span>
                      )}
                      {chip.dot && <span className="chip-dot" />}
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Parking Schedule ("When") Card */}
              <div className="sl-schedule-card">
                <div className="sl-card-header">
                  <span className="sl-card-title">
                    <span className="material-symbols-outlined schedule-icon">schedule</span>
                    Parking Schedule
                  </span>
                  <div className="sl-toggle-pill">
                    <button
                      type="button"
                      className={`sl-toggle-opt ${scheduleMode === 'now' ? 'active' : ''}`}
                      onClick={() => handleToggleScheduleMode('now')}
                    >
                      Now
                    </button>
                    <button
                      type="button"
                      className={`sl-toggle-opt ${scheduleMode === 'later' ? 'active' : ''}`}
                      onClick={() => handleToggleScheduleMode('later')}
                    >
                      Later
                    </button>
                  </div>
                </div>

                {/* Target Day Strip if 'later' */}
                {scheduleMode === 'later' && (
                  <div className="sl-day-selector">
                    <span className="sl-day-label">Select target arrival day</span>
                    <div className="sl-day-chips">
                      {dayOptions.map((day, idx) => (
                        <button
                          key={day}
                          type="button"
                          className={`sl-day-chip ${selectedDayIndex === idx ? 'active' : ''}`}
                          onClick={() => setSelectedDayIndex(idx)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slot Row (Entry & Exit Times) */}
                <div className="sl-time-slot-section">
                  <span className="sl-time-slot-heading">Time Window</span>
                  <div className="sl-time-slot-row">
                    {/* Entry Time Tile */}
                    <div
                      className="sl-time-field"
                      onClick={openEntryPicker}
                      role="button"
                      tabIndex={0}
                      title="Tap to set Entry Time"
                    >
                      <div className="sl-time-field-header">
                        <span className="material-symbols-outlined sl-time-field-icon entry">login</span>
                        <span className="sl-time-field-label">Entry Time</span>
                      </div>
                      <div className="sl-time-field-value">
                        <span className="sl-time-text">{formatTime12(entryTime)}</span>
                        <span className="material-symbols-outlined sl-time-dropdown-icon">schedule</span>
                      </div>
                    </div>

                    <div className="sl-time-arrow-circle" aria-hidden="true">
                      <span className="material-symbols-outlined">east</span>
                    </div>

                    {/* Exit Time Tile */}
                    <div
                      className="sl-time-field"
                      onClick={openExitPicker}
                      role="button"
                      tabIndex={0}
                      title="Tap to set Exit Time"
                    >
                      <div className="sl-time-field-header">
                        <span className="material-symbols-outlined sl-time-field-icon exit">logout</span>
                        <span className="sl-time-field-label">Exit Time</span>
                      </div>
                      <div className="sl-time-field-value">
                        <span className="sl-time-text">{formatTime12(exitTime)}</span>
                        <span className="material-symbols-outlined sl-time-dropdown-icon">schedule</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration Stepper Module */}
                <div className="sl-duration-module">
                  <div className="sl-duration-info">
                    <span className="sl-duration-sub">Total Duration</span>
                    <div className="sl-duration-val-row">
                      <span className="sl-duration-big">
                        {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                      </span>
                      <span className="sl-dot-divider" />
                      <span className="sl-valid-label">{validUntilLabel}</span>
                    </div>
                  </div>

                  <div className="sl-stepper-ctrls">
                    <button
                      type="button"
                      className="sl-stepper-btn"
                      onClick={() => handleStepDuration(-1)}
                      disabled={durationHours <= 1}
                      aria-label="Decrease hours"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <button
                      type="button"
                      className="sl-stepper-btn plus"
                      onClick={() => handleStepDuration(1)}
                      disabled={durationHours >= 12}
                      aria-label="Increase hours"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="sl-recent-section">
                  <div className="sl-section-head">
                    <h2 className="sl-section-title">Recent Searches</h2>
                    <button
                      type="button"
                      className="sl-clear-recent-btn"
                      onClick={() => setRecentSearches([])}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="sl-recent-list">
                    {recentSearches.map((item) => (
                      <div
                        key={item.id}
                        className="sl-recent-item"
                        onClick={() => handleSelectRecent(item.title)}
                      >
                        <div className="sl-recent-left">
                          <div className="sl-recent-icon-wrap">
                            <span className="material-symbols-outlined">history</span>
                          </div>
                          <div className="sl-recent-text">
                            <span className="sl-recent-title">{item.title}</span>
                            <span className="sl-recent-sub">{item.subtitle}</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined sl-recent-arrow">
                          north_west
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky / Inline Map Launch Button - only shown when location is entered */}
              {Boolean((location || '').trim()) && (
                <div className="sl-sticky-bottom-action">
                  <button
                    type="button"
                    className="sl-launch-map-btn"
                    onClick={() => handleSearch()}
                  >
                    <span className="material-symbols-outlined filled">map</span>
                    <span>
                      Show on map ({availableSlotsCount > 0 ? `${availableSlotsCount} slots available` : 'Explore spots'})
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Available Parking Stations */}
            <div className="sl-grid-results">
              {/* Popular Nearby Section */}
              <div className="sl-popular-section">
                <div className="sl-section-head">
                  <div className="sl-head-with-badge">
                    <h2 className="sl-section-title">Popular Nearby</h2>
                    <span className="sl-live-badge">Live</span>
                  </div>
                  <span className="sl-auto-update">Auto-updating</span>
                </div>

                <div className="sl-station-grid">
                  {displayStations.map((station) => (
                    <div
                      key={station.id}
                      className="sl-station-card"
                      onClick={() => handleSelectStation(station)}
                    >
                      <div className="sl-card-body">
                        <div className="sl-thumb-wrap">
                          <img
                            src={
                              station.image ||
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDiXTEhe1qZRY7qEOIb4SGgVFFocxzL1SNgLwL7WUt2SvmNC3uw0AmEkmnJeBVIrOW7NdiEXITYwsmiLHGi2R3CcWVIXlqCj976VnnSWOoXfUk4VJesiNOkjWoOnOZbD2P4aR0nEPOEcAhAlLb4aC1NSRCeVfeCFrWDz3K9vMsobgmV2We6Ds_WlRVUaD558Y8pACdaudHPs-3hJ4fH-CHSMfKX19Y1SUK4qYryyXo6yHcGNcMbTnNm'
                            }
                            alt={station.name}
                            className="sl-station-img"
                          />
                          <div className="sl-img-badge">
                            <span className="material-symbols-outlined badge-icon">
                              {station.tag === 'CCTV' ? 'shield' : 'bolt'}
                            </span>
                            <span>{station.tag || 'ANPR'}</span>
                          </div>
                        </div>

                        <div className="sl-card-info">
                          <div className="sl-name-price-row">
                            <h3 className="sl-station-name">{station.name}</h3>
                            <span className="sl-station-rate">
                              ₹{station.pricePerHour || 30}
                              <small>/hr</small>
                            </span>
                          </div>

                          <p className="sl-station-loc">
                            <span className="material-symbols-outlined loc-pin">near_me</span>
                            {station.distance != null ? `${station.distance} km away` : '0.8 km'} •{' '}
                            {station.address}
                          </p>

                          <div className="sl-badges-row">
                            <span className="sl-avail-tag">
                              <span className="avail-pulse" />
                              {station.availableSlots || 15} Available
                            </span>
                            {station.feature && (
                              <span className="sl-feat-tag">{station.feature}</span>
                            )}
                            <button
                              type="button"
                              className="sl-desktop-reserve-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectStation(station);
                              }}
                            >
                              Reserve
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Drum Roller Time Picker Sheet Modal (Matches Reference Image) */}
      <WheelTimePickerModal
        isOpen={wheelPickerState.isOpen}
        onClose={closeWheelPicker}
        initialTime={wheelPickerState.type === 'entry' ? entryTime : exitTime}
        type={wheelPickerState.type}
        heading={wheelPickerState.heading}
        pairedTime={wheelPickerState.type === 'exit' ? entryTime : null}
        onConfirm={handleWheelTimeConfirm}
      />
    </div>
  );
}

export default SearchLocation;
