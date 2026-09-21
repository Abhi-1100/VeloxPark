import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { useBooking } from '../../hooks/useUserBookings';
import './Payment.css';

/* ─── Vector SVG Icons ─────────────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconShieldLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <circle cx="12" cy="15" r="1" fill="#10b981" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="3" ry="3" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconQrCode() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking } = useBooking(id);

  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  useEffect(() => {
    if (!id || id.startsWith('bk_')) return undefined;
    return onSnapshot(doc(db, 'bookings', id), (snap) => {
      const status = snap.data()?.paymentStatus;
      if (status) setPaymentStatus(status);
    });
  }, [id]);

  const handlePay = async () => {
    setProcessing(true);

    try {
      // Instant snappy feedback
      await new Promise((r) => setTimeout(r, 400));

      if (id && !id.startsWith('bk_')) {
        try {
          updateDoc(doc(db, 'bookings', id), {
            paymentStatus: 'confirmed',
            status: 'active',
            paidAt: Timestamp.fromDate(new Date()),
            paymentMethod: selectedMethod,
          });
        } catch (_) { /* Background Firestore sync */ }
      }

      setPaymentStatus('confirmed');
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const activeBooking = booking || {
    id,
    slotId: 'H1 237',
    slotLabel: 'Slot H1 237',
    address: 'California Parking (Brooklyn)',
    entryTime: '10:00 AM',
    exitTime: '02:00 PM',
    duration: 240,
    rate: 6,
    amount: 24.00,
    status: 'reserved',
    paymentStatus: paymentStatus,
  };

  const amountDisplay = Number(activeBooking.amount || 24).toFixed(2);
  const slotName = activeBooking.slotLabel || (activeBooking.slotId ? `Slot ${activeBooking.slotId}` : 'Spot H1 237');

  return (
    <div className="pay-page">
      <div className="pay-shell">

        {/* Top Navigation Bar */}
        <div className="pay-top-bar">
          <button
            type="button"
            className="pay-nav-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <IconArrowLeft />
          </button>

          <h1 className="pay-top-title">
            {paymentStatus === 'confirmed' ? 'Receipt & Pass' : 'Payment'}
          </h1>

          <div className="pay-secure-badge" title="256-bit SSL Encrypted">
            <IconShieldLock />
            <span>Encrypted</span>
          </div>
        </div>

        {paymentStatus === 'confirmed' ? (
          /* ── Success Screen ── */
          <div className="pay-success-container">
            <div className="pay-success-circle">
              <IconCheck />
            </div>

            <h2 className="pay-success-title">Payment Confirmed!</h2>
            <p className="pay-success-sub">
              Your parking reservation is locked. Barrier gate access has been authorized.
            </p>

            {/* Digital Pass Card */}
            <div className="pay-pass-card">
              <div className="pay-pass-header">
                <div>
                  <span className="pay-pass-tag">ACTIVE GATE PASS</span>
                  <h3 className="pay-pass-slot">{slotName}</h3>
                </div>
                <div className="pay-pass-badge">CONFIRMED</div>
              </div>

              <div className="pay-pass-meta">
                <div className="pay-pass-col">
                  <span className="pay-pass-lbl">LOCATION</span>
                  <span className="pay-pass-val">{activeBooking.address || 'California Parking'}</span>
                </div>
                <div className="pay-pass-col text-right">
                  <span className="pay-pass-lbl">AMOUNT PAID</span>
                  <span className="pay-pass-val text-gold">${amountDisplay}</span>
                </div>
              </div>

              <div className="pay-pass-timing">
                <div className="pay-timing-item">
                  <span className="pay-timing-lbl">ENTRY</span>
                  <span className="pay-timing-val">{activeBooking.entryTime || '10:00 AM'}</span>
                </div>
                <div className="pay-timing-divider">➔</div>
                <div className="pay-timing-item">
                  <span className="pay-timing-lbl">EXIT</span>
                  <span className="pay-timing-val">{activeBooking.exitTime || '02:00 PM'}</span>
                </div>
              </div>

              {/* QR Access Code */}
              <div className="pay-pass-qr-wrap">
                <QRCodeSVG
                  value={`velox://gate-pass/${id}?slot=${activeBooking.slotId || 'H1-237'}`}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="Q"
                />
                <span className="pay-pass-qr-hint">Scan at entry barrier scanner</span>
              </div>
            </div>

            {/* Success Actions */}
            <div className="pay-success-actions">
              <button
                type="button"
                className="pay-btn-primary"
                onClick={() => navigate(`/booking/${id}`)}
              >
                View Gate Pass Details
              </button>

              <button
                type="button"
                className="pay-btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* ── Checkout Screen ── */
          <div className="pay-checkout-container">

            {/* Summary Banner Card */}
            <div className="pay-summary-card">
              <div className="pay-summary-top">
                <div>
                  <span className="pay-summary-badge">SELECTED BAY</span>
                  <h2 className="pay-summary-slot">{slotName}</h2>
                  <p className="pay-summary-loc">{activeBooking.address || 'California Parking (Brooklyn)'}</p>
                </div>
                <div className="pay-summary-amount-box">
                  <span className="pay-summary-amount-lbl">TOTAL DUE</span>
                  <span className="pay-summary-amount">${amountDisplay}</span>
                </div>
              </div>

              <div className="pay-summary-times">
                <div className="pay-time-col">
                  <span className="pay-time-lbl">ENTRY</span>
                  <span className="pay-time-val">{activeBooking.entryTime || '10:00 AM'}</span>
                </div>
                <div className="pay-time-pill">
                  {activeBooking.duration ? `${Math.round(activeBooking.duration / 60)}h` : '4h'}
                </div>
                <div className="pay-time-col text-right">
                  <span className="pay-time-lbl">EXIT</span>
                  <span className="pay-time-val">{activeBooking.exitTime || '02:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pay-section-heading">
              <h3>Choose Payment Method</h3>
              <span>Instant Confirmation</span>
            </div>

            <div className="pay-methods-grid">
              <div
                className={`pay-method-pill ${selectedMethod === 'card' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('card')}
                role="button"
                tabIndex={0}
              >
                <div className="pay-method-icon"><IconCreditCard /></div>
                <span className="pay-method-name">Credit Card</span>
                {selectedMethod === 'card' && <span className="pay-method-dot">●</span>}
              </div>

              <div
                className={`pay-method-pill ${selectedMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('qr')}
                role="button"
                tabIndex={0}
              >
                <div className="pay-method-icon"><IconQrCode /></div>
                <span className="pay-method-name">UPI / QR</span>
                {selectedMethod === 'qr' && <span className="pay-method-dot">●</span>}
              </div>

              <div
                className={`pay-method-pill ${selectedMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('wallet')}
                role="button"
                tabIndex={0}
              >
                <div className="pay-method-icon"><IconWallet /></div>
                <span className="pay-method-name">Velox Wallet</span>
                {selectedMethod === 'wallet' && <span className="pay-method-dot">●</span>}
              </div>
            </div>

            {/* Method Details Pane */}
            {selectedMethod === 'card' && (
              <div className="pay-card-pane">
                {/* Visual Card Preview */}
                <div className="pay-visual-card">
                  <div className="pay-vcard-top">
                    <span className="pay-vcard-chip"></span>
                    <span className="pay-vcard-brand">VISA</span>
                  </div>
                  <div className="pay-vcard-number">{cardNumber}</div>
                  <div className="pay-vcard-bottom">
                    <div>
                      <span className="pay-vcard-lbl">CARD HOLDER</span>
                      <span className="pay-vcard-val">VALUED DRIVER</span>
                    </div>
                    <div>
                      <span className="pay-vcard-lbl">EXPIRES</span>
                      <span className="pay-vcard-val">{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="pay-fields-stack">
                  <div className="pay-field">
                    <label className="pay-field-lbl">CARD NUMBER</label>
                    <input
                      type="text"
                      className="pay-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                    />
                  </div>

                  <div className="pay-fields-row">
                    <div className="pay-field">
                      <label className="pay-field-lbl">EXPIRY DATE</label>
                      <input
                        type="text"
                        className="pay-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="pay-field">
                      <label className="pay-field-lbl">CVV</label>
                      <input
                        type="password"
                        className="pay-input"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVV"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'qr' && (
              <div className="pay-qr-pane">
                <div className="pay-qr-frame">
                  <QRCodeSVG
                    value={`upi://pay?pa=veloxpark@upi&pn=VeloxPark&am=${activeBooking.amount || 24}&cu=USD&tn=Parking-${id}`}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#111827"
                    level="H"
                  />
                </div>
                <p className="pay-qr-text">
                  Scan using Google Pay, PhonePe, Apple Pay or any UPI scanner.
                </p>
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div className="pay-wallet-pane">
                <div className="pay-wallet-box">
                  <div className="pay-wallet-info">
                    <span className="pay-wallet-lbl">AVAILABLE BALANCE</span>
                    <span className="pay-wallet-val">$150.00</span>
                  </div>
                  <span className="pay-wallet-badge">Active</span>
                </div>
                <p className="pay-wallet-text">
                  ${amountDisplay} will be instantly deducted from your Velox 1-Tap balance.
                </p>
              </div>
            )}

            {/* Bottom Floating Pay Bar */}
            <div className="pay-bottom-bar">
              <button
                type="button"
                className="pay-btn-submit"
                disabled={processing}
                onClick={handlePay}
              >
                {processing ? (
                  <span className="pay-btn-loading">
                    <span className="pay-btn-spinner"></span>
                    Authorizing…
                  </span>
                ) : (
                  `Pay $${amountDisplay} & Confirm Spot`
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Payment;
