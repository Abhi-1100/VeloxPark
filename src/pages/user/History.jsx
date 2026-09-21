import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useUserBookings } from '../../hooks/useUserBookings';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import StatusPill from '../../components/ui/StatusPill';

function History() {
  const { user } = useAuth();
  const { bookings, loading } = useUserBookings(user?.uid);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const matchFrom = !from || (booking.date && booking.date >= from);
      const matchTo   = !to   || (booking.date && booking.date <= to);
      return matchFrom && matchTo && !['reserved', 'active'].includes(booking.status);
    });
  }, [bookings, from, to]);

  const totalSpent = useMemo(() => {
    return filtered.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-sans text-label font-bold uppercase text-gold">DRIVER AUDIT TRAIL</span>
          <h1 className="mt-1 font-display text-display-xl font-extrabold uppercase text-paper">
            Parking History
          </h1>
          <p className="text-body-sm text-muted">
            All completed, expired, and past barrier access sessions recorded under your account.
          </p>
        </div>

        {/* Total Summary */}
        <div className="bg-surface border border-line rounded-md px-4 py-2 text-right">
          <span className="text-label text-muted font-bold uppercase block">Past Spend</span>
          <span className="font-display text-display-md font-extrabold text-gold">${totalSpent.toFixed(2)}</span>
        </div>
      </header>

      {/* Filter Bar Card */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-end">
          <Input
            id="from"
            label="From Date"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            id="to"
            label="To Date"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {(from || to) && (
            <button
              type="button"
              className="text-xs text-gold hover:underline font-bold uppercase pb-2"
              onClick={() => { setFrom(''); setTo(''); }}
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </Card>

      {/* Records List */}
      {loading ? (
        <p className="text-body text-muted py-8 text-center">Loading parking telemetry…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((booking) => (
            <Card key={booking.id} className="flex flex-col justify-between hover:border-gold-soft transition-colors">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-display text-display-md font-extrabold uppercase text-paper">
                      Slot {booking.slotLabel || booking.slotId}
                    </span>
                    <p className="mt-1 text-xs text-muted">
                      {booking.date || 'Past Session'} · {booking.duration || 0} mins
                    </p>
                  </div>
                  <StatusPill status={booking.status} />
                </div>

                <div className="mt-4 text-xs text-muted space-y-1 bg-surface-raised p-2.5 rounded border border-line/60">
                  <div className="flex justify-between">
                    <span>Entry: <strong>{booking.entryTime || '—'}</strong></span>
                    <span>Exit: <strong>{booking.exitTime || '—'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-body">
                <span className="text-xs text-muted uppercase font-bold tracking-wider">Settled Amount</span>
                <strong className="font-display text-base font-extrabold text-gold">
                  ${Number(booking.amount || 0).toFixed(2)}
                </strong>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-body text-muted">No past bookings match the selected criteria.</p>
          <div className="mt-4">
            <Link to="/book" className="text-xs text-gold hover:underline uppercase font-bold">
              Book a new slot →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default History;
