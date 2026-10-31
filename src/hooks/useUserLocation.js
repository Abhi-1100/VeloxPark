import { useCallback, useEffect, useRef, useState } from 'react';
import { getIPLocation } from '../services/geoapifyService';

const messages = {
  denied: 'Location permission was denied. We mapped you via network location.',
  unavailable: 'GPS signal unavailable. We mapped you via network location.',
  timeout: 'Location lookup timed out. We mapped you via network location.',
  unsupported: 'This browser does not support GPS. We mapped you via network location.',
};

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const requestLocation = useCallback(() => {
    const id = ++requestId.current;
    setStatus('loading');
    setError('');

    const fallbackToIP = async (reason) => {
      try {
        const ipLoc = await getIPLocation();
        if (ipLoc && id === requestId.current) {
          setLocation({
            latitude: ipLoc.lat,
            longitude: ipLoc.lng,
            city: ipLoc.city,
            state: ipLoc.state,
            accuracy: 2500,
            source: 'ip',
          });
          setStatus('ready');
          return;
        }
      } catch (err) {
        console.warn('IP fallback warning:', err);
      }
      if (id === requestId.current) {
        setStatus(reason || 'ready');
      }
    };

    if (!navigator.geolocation) {
      fallbackToIP('unsupported');
      return;
    }

    // Try fast WiFi / network location first
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (id === requestId.current) {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            source: 'gps',
          });
          setStatus('ready');
        }
      },
      (geoError) => {
        const type =
          geoError.code === geoError.PERMISSION_DENIED
            ? 'denied'
            : geoError.code === geoError.TIMEOUT
            ? 'timeout'
            : 'unavailable';
        setError(messages[type] || '');
        fallbackToIP(type);
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(requestLocation, 0);
    return () => clearTimeout(timer);
  }, [requestLocation]);

  return { location, status, error, requestLocation };
}
