import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useUserBookings(uid) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(Boolean(uid));
  useEffect(() => {
    if (!uid) return undefined;
    const ref = query(collection(db, 'bookings'), where('userId', '==', uid));
    return onSnapshot(ref, (snapshot) => {
      setBookings(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))));
      setLoading(false);
    }, () => setLoading(false));
  }, [uid]);
  return { bookings, loading };
}

export function useBooking(id) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return undefined;
    return onSnapshot(doc(db, 'bookings', id), (snapshot) => {
      setBooking(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    }, () => setLoading(false));
  }, [id]);
  return { booking, loading };
}

export function useSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => onSnapshot(collection(db, 'slots'), (snapshot) => {
    setSlots(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    setLoading(false);
  }, () => setLoading(false)), []);
  return { slots, loading };
}
