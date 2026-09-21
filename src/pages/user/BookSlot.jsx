import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import './BookSlot.css';

const SLOTS_LEFT = [
  { id: 'H1 237', status: 'available', price: 6 },
  { id: 'H1 236', status: 'occupied' },
  { id: 'H1 235', status: 'occupied' },
  { id: 'H1 234', status: 'occupied' },
  { id: 'H1 233', status: 'available', price: 6 },
];

const SLOTS_RIGHT = [
  { id: 'H1 223', status: 'occupied' },
  { id: 'H1 222', status: 'occupied' },
  { id: 'H1 221', status: 'available', price: 6 },
  { id: 'H1 220', status: 'occupied' },
  { id: 'H1 219', status: 'locked' },
];

function CarSVG() {
  return (
    <svg className="bs-car-svg" viewBox="0 0 100 44" fill="none">
      <rect x="12" y="6" width="76" height="32" rx="12" fill="#fff" />
      <rect x="24" y="8" width="52" height="28" rx="8" fill="#e6e6e6" />
      <rect x="32" y="10" width="10" height="24" rx="2" fill="#222" />
      <rect x="62" y="10" width="10" height="24" rx="2" fill="#222" />
      <rect x="44" y="8" width="16" height="28" fill="#f4f4f4" />
      <circle cx="20" cy="8" r="4" fill="#ff4d4d" />
      <circle cx="20" cy="36" r="4" fill="#ff4d4d" />
      <path d="M84 10 L88 12 L88 32 L84 34 Z" fill="#ffea00" opacity="0.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BookSlot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState('H1 237');

  const handleBook = () => {
    if (!selectedSlot) return;

    const slotData = [...SLOTS_LEFT, ...SLOTS_RIGHT].find((s) => s.id === selectedSlot);
    const rate = slotData?.price || 6;
    const amount = rate * 4;
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const uid = user?.uid || 'driver_user';

    // Synchronously generate document reference and ID with 0 network latency
    const newDocRef = doc(collection(db, 'bookings'));
    const bookingId = newDocRef.id;

    // Asynchronously save to Firestore in the background without blocking the UI
    setDoc(newDocRef, {
      userId: uid,
      slotId: selectedSlot,
      slotLabel: `Slot ${selectedSlot}`,
      address: 'California Parking',
      date: today,
      entryTime: '10:00 AM',
      exitTime: '02:00 PM',
      duration: 4 * 60,
      rate,
      amount,
      status: 'reserved',
      reservedAt: Timestamp.fromDate(now),
      entryDeadline: Timestamp.fromDate(new Date(now.getTime() + 15 * 60 * 1000)),
      createdAt: Timestamp.fromDate(now),
    }).catch((err) => console.warn('Background sync note:', err));

    // Instantly navigate to the payment section
    navigate(`/booking/${bookingId}/pay`);
  };

  const renderSlot = (slot) => {
    const isSelected = selectedSlot === slot.id;
    let content;
    
    if (slot.status === 'occupied') {
      content = <CarSVG />;
    } else if (slot.status === 'locked') {
      content = <LockIcon />;
    } else {
      content = <span>{slot.id}</span>;
    }

    let cls = `bs-slot-content ${slot.status}`;
    if (isSelected) cls += ' selected';

    return (
      <div 
        key={slot.id} 
        className="bs-slot-wrapper"
        onClick={() => slot.status === 'available' && setSelectedSlot(slot.id)}
      >
        <div className={cls}>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="bs-page">
      <div className="bs-shell">
        
        {/* White Header Card */}
        <div className="bs-header-card">
          <div className="bs-top-row">
            <button className="bs-icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="bs-title">Choose Spot</h1>
            <button className="bs-icon-btn" aria-label="Map search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
          
          <div className="bs-filters">
            <div className="bs-filter-col">
              <span className="bs-filter-lbl">PARKING LOT</span>
              <div className="bs-filter-val">
                {selectedSlot || 'H1 237'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
            
            <div className="bs-filter-col">
              <span className="bs-filter-lbl">FLOOR</span>
              <div className="bs-filter-val">
                Floor 2
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
            
            <div className="bs-filter-col">
              <span className="bs-filter-lbl">STATUS</span>
              <div className="bs-filter-val blue-text">
                Available
              </div>
            </div>
          </div>
        </div>

        {/* Dark Parking Area */}
        <div className="bs-lot-area">
          <div className="bs-lot-container">
            
            <div className="bs-lot-road"></div>
            <div className="bs-lot-entry">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              ENTRY
            </div>

            <div className="bs-curve-tl"></div>
            <div className="bs-curve-bl"></div>

            <div className="bs-col left">
              {SLOTS_LEFT.map((slot, i) => (
                <div key={slot.id} className={i === 0 ? 'first' : ''} style={{width:'100%'}}>
                  {renderSlot(slot)}
                </div>
              ))}
            </div>

            <div className="bs-col right">
              {SLOTS_RIGHT.map((slot, i) => (
                <div key={slot.id} className={i === 0 ? 'first' : ''} style={{width:'100%'}}>
                  {renderSlot(slot)}
                </div>
              ))}
            </div>

            <div className="bs-curve-tr"></div>
            <div className="bs-curve-br"></div>
            
          </div>
        </div>

        {/* Floating Book Button */}
        <div className="bs-bottom-action">
          <button 
            className="bs-book-btn"
            disabled={!selectedSlot}
            onClick={handleBook}
          >
            {`Book ${selectedSlot || 'Spot'} · Continue to Pay`}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BookSlot;
