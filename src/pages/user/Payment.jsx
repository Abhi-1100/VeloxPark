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
  const { booking: liveBooking, loading } = useBooking(id);

  const [booking, setBooking] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (liveBooking) {
      setBooking(liveBooking);
      if (liveBooking.status === 'completed' || liveBooking.status === 'active') {
        setPaid(true);
      }
    }
  }, [liveBooking]);

  const activeBooking = booking || {
    id: id || 'demo-booking-1',
    slotId: 'H1 237',
    slotLabel: 'Slot H1 237',
    address: 'California Parking',
    amount: 24.0,
    entryTime: '10:00 AM',
    exitTime: '02:00 PM',
    duration: 240,
    status: 'reserved',
  };

  const amountDisplay = Number(activeBooking.amount || 24.0).toFixed(2);
  const slotName = activeBooking.slotLabel || (activeBooking.slotId ? `Slot ${activeBooking.slotId}` : 'Slot H1 237');

  const handlePay = async () => {
    setProcessing(true);

    try {
      if (id && id !== 'demo-booking-1') {
        await updateDoc(doc(db, 'bookings', id), {
          status: 'completed',
          paidAt: Timestamp.fromDate(new Date()),
          paymentMethod: selectedMethod,
        });
      }
    } catch (err) {
      console.warn('Payment update note:', err);
    }

    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 900);
  };

  if (loading && !booking) {
    return (
      <div className="pay-page">
        <div className="pay-shell pay-loading-shell">
          <div className="pay-spinner"></div>
          <span className="pay-loading-text">Loading secure checkout…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <div className="pay-shell">
        
        {/* Top Bar */}
        <div className="pay-top-bar">
          <button
            type="button"
            className="pay-nav-btn"
            onClick={() => navigate(paid ? '/dashboard' : -1)}
            aria-label="Go back"
          >
            <IconArrowLeft />
          </button>

          <div className="pay-title-group">
            <h1 className="pay-top-title">{paid ? 'Receipt & Pass' : 'Payment'}</h1>
            <span className="pay-desktop-crumb">
              {paid ? 'Reservation Confirmed · Instant Barrier Access' : 'California Parking · Guaranteed Slot Reservation'}
            </span>
          </div>

          <div className="pay-badge-encrypted">
            <IconShieldLock />
            <span>Encrypted</span>
          </div>
        </div>

        {paid ? (
          /* ── Post-Payment Confirmation Pass Screen ── */
          <div className="pay-success-container">
            
            <div className="pay-success-header">
              <div className="pay-success-icon-wrap">
                <IconCheck />
              </div>
              <h2 className="pay-success-title">Payment Confirmed!</h2>
              <p className="pay-success-sub">
                Your parking reservation is locked. Barrier gate access has been authorized.
              </p>
            </div>

            {/* Boarding-Pass Style Ticket Card */}
            <div className="pay-pass-card">
              <div className="pay-pass-top">
                <div>
                  <span className="pay-pass-lbl">ACTIVE GATE PASS</span>
                  <h3 className="pay-pass-slot">{slotName}</h3>
                </div>
                <div className="pay-pass-status-pill">
                  CONFIRMED
                </div>
              </div>

              <div className="pay-pass-divider"></div>

              <div className="pay-pass-info-grid">
                <div>
                  <span className="pay-pass-lbl">LOCATION</span>
                  <span className="pay-pass-val">{activeBooking.address || 'California Parking'}</span>
                </div>
                <div className="text-right">
                  <span className="pay-pass-lbl">AMOUNT PAID</span>
                  <span className="pay-pass-val-gold">₹{amountDisplay}</span>
                </div>
              </div>

              <div className="pay-pass-times-box">
                <div className="pay-pass-time-col">
                  <span className="pay-pass-lbl">ENTRY</span>
                  <span className="pay-pass-time">{activeBooking.entryTime || '10:00 AM'}</span>
                </div>
                <span className="pay-pass-arrow">→</span>
                <div className="pay-pass-time-col text-right">
                  <span className="pay-pass-lbl">EXIT</span>
                  <span className="pay-pass-time">{activeBooking.exitTime || '02:00 PM'}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="pay-qr-center">
                <div className="pay-qr-frame">
                  <QRCodeSVG
                    value={`VELOXPARK-PASS:${activeBooking.id || 'VX-PASS'}:${activeBooking.slotId || 'H1237'}`}
                    size={168}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="pay-qr-hint">Scan at entry barrier scanner</p>
              </div>
            </div>

            {/* Success Actions */}
            <div className="pay-success-actions">
              <button
                type="button"
                className="pay-btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </button>

              <button
                type="button"
                className="pay-btn-secondary"
                onClick={() => navigate('/map')}
              >
                View on Live Map
              </button>
            </div>
          </div>
        ) : (
          /* ── Checkout Screen ── */
          <div className="pay-checkout-container">
            
            <div className="pay-desktop-layout">
              
              {/* Left Column (Payment Methods & Card Form) */}
              <div className="pay-left-pane">
                
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
                    <div className="pay-qr-display-box">
                      <QRCodeSVG
                        value={`upi://pay?pa=veloxpark@upi&pn=VeloxPark&am=${amountDisplay}&cu=INR`}
                        size={160}
                        level="M"
                      />
                    </div>
                    <p className="pay-qr-text">
                      Scan with Google Pay, PhonePe, or any UPI app to authenticate instantly.
                    </p>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="pay-wallet-pane">
                    <div className="pay-wallet-box">
                      <div className="pay-wallet-info">
                        <span className="pay-wallet-lbl">AVAILABLE BALANCE</span>
                        <span className="pay-wallet-val">₹1,500.00</span>
                      </div>
                      <span className="pay-wallet-badge">Active</span>
                    </div>
                    <p className="pay-wallet-text">
                      ₹{amountDisplay} will be instantly deducted from your Velox 1-Tap balance.
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column (Summary & Checkout CTA) */}
              <div className="pay-right-pane">
                
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
                      <span className="pay-summary-amount">₹{amountDisplay}</span>
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

                {/* Trust & Guarantees Card */}
                <div className="pay-guarantees-card">
                  <div className="pay-guarantee-item">
                    <span className="pay-guarantee-icon">🔒</span>
                    <div>
                      <span className="pay-guarantee-title">256-Bit SSL Secured</span>
                      <p className="pay-guarantee-sub">End-to-end encrypted payment transaction</p>
                    </div>
                  </div>
                  <div className="pay-guarantee-item">
                    <span className="pay-guarantee-icon">⚡</span>
                    <div>
                      <span className="pay-guarantee-title">Instant Barrier Gate Pass</span>
                      <p className="pay-guarantee-sub">QR Code pass generated immediately</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Checkout CTA */}
                <div className="pay-desktop-checkout-action">
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
                      `Pay ₹${amountDisplay} & Confirm Spot`
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Floating Pay Bar (Mobile Only) */}
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
                  `Pay ₹${amountDisplay} & Confirm Spot`
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
