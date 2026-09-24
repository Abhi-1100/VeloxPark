import { useCallback, useEffect, useState } from 'react';

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      setError('Unable to determine your location.');
      return;
    }

    setStatus('loading');
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setStatus('ready');
      },
      (geolocationError) => {
        const message = geolocationError.code === geolocationError.PERMISSION_DENIED
          ? 'Location access is disabled. Enable location permission to find nearby VeloxPark stations.'
          : 'Unable to determine your location.';
        setStatus(geolocationError.code === geolocationError.PERMISSION_DENIED ? 'denied' : 'error');
        setError(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, status, error, requestLocation };
}
