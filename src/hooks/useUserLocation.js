import { useCallback, useEffect, useRef, useState } from 'react';

const messages = {
  denied: 'Location permission was denied. You can still explore stations manually.',
  unavailable: 'Your location is currently unavailable. Check your device settings and retry.',
  timeout: 'Location lookup timed out. Retry when you have a clearer signal.',
  unsupported: 'This browser does not support location. You can still explore stations manually.',
};

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const requestLocation = useCallback(() => {
    const id = ++requestId.current;
    if (!navigator.geolocation) { setStatus('unsupported'); setError(messages.unsupported); return; }
    setStatus('loading'); setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { if (id === requestId.current) { setLocation({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy }); setStatus('ready'); } },
      (geoError) => {
        if (id !== requestId.current) return;
        const type = geoError.code === geoError.PERMISSION_DENIED ? 'denied' : geoError.code === geoError.TIMEOUT ? 'timeout' : 'unavailable';
        setStatus(type); setError(messages[type]);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);
  useEffect(() => {
    const timer = setTimeout(requestLocation, 0);
    return () => clearTimeout(timer);
  }, [requestLocation]);
  return { location, status, error, requestLocation };
}
