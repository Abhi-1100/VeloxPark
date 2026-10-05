import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import { loadLocalVehicle, subscribeToVehicle } from '../../services/userParkingService';
import { validateLicensePlate } from '../../utils/validation';
import { calculateAmount, calculateDuration } from '../../utils/parkingUtils';

const RECENTS_KEY = 'velox_recent_plate_searches';
const getRecent = () => { try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); } catch { return []; } };
const saveRecent = (plate) => { const next = [plate, ...getRecent().filter((item) => item !== plate)].slice(0, 5); localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); return next; };

export default function UserParkingInfo() {
  const location = useLocation(); const requestRef = useRef(0); const [plateInput, setPlateInput] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [vehicleData, setVehicleData] = useState(null); const [offline, setOffline] = useState(false); const [recents, setRecents] = useState(getRecent);
  const mapResult = (data) => { const item = data?.current; if (!item) return null; const duration = item.status === 'parked' ? calculateDuration(item.entry, new Date().toISOString()) : item.duration; return { ...item, status: item.status === 'parked' ? 'Parked' : 'Exited', entry: item.entry, exit: item.exit, duration, amount: item.status === 'parked' ? calculateAmount(duration, item.rateAtEntry) : item.amount, vehicle_type: item.vehicleType, zone: item.zone }; };
  function search(raw = plateInput) { const check = validateLicensePlate(raw); if (!check.valid) { setError(check.message); return; } const plate = check.cleaned; const id = ++requestRef.current; setPlateInput(plate); setLoading(true); setError(''); setOffline(false); setVehicleData(null); setRecents(saveRecent(plate)); const unsubscribe = subscribeToVehicle(plate, (data) => { if (id !== requestRef.current) return; const mapped = mapResult(data); setVehicleData(mapped); setLoading(false); if (!mapped) setError('Vehicle not found. Check the plate and try again.'); }, async (firebaseError) => { if (id !== requestRef.current) return; try { const cached = await loadLocalVehicle(plate); setOffline(true); setVehicleData(mapResult(cached)); setLoading(false); if (!cached.current) setError('Vehicle not found in cached records.'); } catch { setLoading(false); setError(firebaseError.code === 'PERMISSION_DENIED' ? 'Parking records are not available for public lookup.' : 'Could not load parking records. Please retry.'); } }); window.__veloxUserUnsubscribe?.(); window.__veloxUserUnsubscribe = unsubscribe; }
  useEffect(() => { const deepPlate = new URLSearchParams(location.search).get('plate'); if (deepPlate) setTimeout(() => search(deepPlate), 0); }, [location.search]);
  useEffect(() => () => { window.__veloxUserUnsubscribe?.(); delete window.__veloxUserUnsubscribe; }, []);
  return <><Dashboard plateInput={plateInput} setPlateInput={(value) => setPlateInput(typeof value === 'string' ? value : value.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))} loading={loading} error={error} vehicleData={vehicleData} onSubmit={(event) => { event.preventDefault(); search(); }} /><div aria-live="polite" style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 200, maxWidth: '90%', pointerEvents: 'none' }}>{offline && <div style={{ background: '#483d0b', color: '#ffe874', padding: '10px 16px', borderRadius: 10 }}>Offline — showing cached data</div>}{recents.length > 0 && !loading && <span style={{ display: 'none' }}>Recent searches: {recents.join(', ')}</span>}</div></>;
}
