import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { useBooking } from '../../hooks/useUserBookings';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusPill from '../../components/ui/StatusPill';

function BookingDetails() {
  const { id } = useParams();
  const { booking, loading } = useBooking(id);
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState('—');

  useEffect(() => {
    if (!booking?.entryDeadline) return undefined;
    const tick = () => {
      const ms = (booking.entryDeadline.toDate ? booking.entryDeadline.toDate() : new Date(booking.entryDeadline)).getTime() - Date.now();
      setRemaining(ms > 0 ? `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}` : 'Expired');
      if (ms <= 0 && booking.status === 'reserved') {
        updateDoc(doc(db, 'bookings', id), { status: 'expired' });
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [booking, id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-muted">
        <p className="font-sans text-body">Loading booking telemetry…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <Card className="text-center">
          <h2 className="font-display text-display-md text-paper">Booking Not Found</h2>
          <p className="mt-2 text-body-sm text-muted">The requested reservation record does not exist or has been removed.</p>
          <div className="mt-6">
            <Link to="/"><Button variant="primary">Return to Dashboard</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const cancel = async () => {
    await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
    navigate('/');
  };

  const isExpired = remaining === 'Expired';

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top navigation breadcrumb */}
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xs text-gold hover:underline uppercase font-bold tracking-wider">
          ← Back to Dashboard
        </Link>
        <span className="text-muted">/</span>
        <span className="font-sans text-label font-bold uppercase text-muted">GATE PASS LEDGER</span>
      </div>

      {/* Header Banner */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-sans text-label font-bold uppercase text-gold">RESERVATION RECORD #{id.slice(0, 8)}</span>
          <h1 className="mt-1 font-display text-display-xl font-extrabold uppercase text-paper">
            Bay {booking.slotLabel || booking.slotId}
          </h1>
          <p className="text-body-sm text-muted mt-1">
            Scheduled for {booking.date || 'Today'} · Zone {booking.section || 'A1'}
          </p>
        </div>
        <StatusPill status={booking.status} />
      </header>

      {/* Main 2-Column Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gate Access Pass */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="relative overflow-hidden border-2 border-line">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-label text-gold font-bold uppercase">VELOXPARK DIGITAL GATE PASS</span>
                <div className="text-xs text-muted mt-0.5">Barrier Access Authorization</div>
              </div>
              <span className="text-xs font-mono bg-surface-raised px-2.5 py-1 rounded border border-line text-paper">
                LPR ENABLED
              </span>
            </div>

            {/* Time windows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="bg-surface-raised p-3 rounded-md border border-line">
                <p className="text-label font-bold uppercase text-muted">Entry Window</p>
                <p className="mt-1 font-display text-base font-extrabold text-paper">{booking.entryTime}</p>
              </div>
              <div className="bg-surface-raised p-3 rounded-md border border-line">
                <p className="text-label font-bold uppercase text-muted">Exit Window</p>
                <p className="mt-1 font-display text-base font-extrabold text-paper">{booking.exitTime}</p>
              </div>
              <div className="bg-surface-raised p-3 rounded-md border border-line">
                <p className="text-label font-bold uppercase text-muted">Entry Countdown</p>
                <p className={`mt-1 font-display text-display-md font-black ${isExpired ? 'text-danger' : 'text-gold'}`}>
                  {remaining}
                </p>
              </div>
            </div>

            {/* Facility note */}
            <div className="text-xs text-muted space-y-1.5 border-t border-line pt-4">
              <p><strong className="text-paper">Facility:</strong> {booking.address || 'California Parking (555 Jackson St, SF)'}</p>
              <p><strong className="text-paper">Billed Duration:</strong> {booking.duration || 0} minutes (₹{booking.rate || 60}/hr)</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions & Financial Ledger */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <div className="border-b border-line pb-3">
              <span className="text-label text-gold font-bold uppercase">PAYMENT LEDGER</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-sm text-muted">Estimated Amount</span>
                <span className="font-display text-display-lg font-black text-paper">
                  ₹{booking.amount || '0.00'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-muted">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="uppercase font-bold text-paper font-mono">{booking.paymentStatus || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span>Free Cancellation Grace</span>
                <span className="text-available">15 Minutes Window</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-line">
              {booking.status === 'reserved' && (
                <Button variant="secondary" className="w-full py-2.5 text-xs font-bold uppercase" onClick={cancel}>
                  Cancel Reservation
                </Button>
              )}

              {booking.status === 'active' && (
                <Link to={`/booking/${id}/pay`} className="block">
                  <Button variant="primary" className="w-full py-3 text-xs font-extrabold uppercase tracking-wider">
                    Proceed to Exit Payment →
                  </Button>
                </Link>
              )}

              <Link to="/" className="block">
                <Button variant="ghost" className="w-full py-2 text-xs font-bold uppercase">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
