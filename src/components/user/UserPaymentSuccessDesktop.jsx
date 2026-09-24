import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import { formatDateTime, formatDuration } from '../../utils/parkingUtils';

const UserPaymentSuccessDesktop = ({
  vehicleData,
  upiConfig,
  receiptId,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  onDownloadReceipt,
}) => {
  const navigate = useNavigate();

  if (!vehicleData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#F1F5F9',
          fontFamily: "'Space Grotesk', sans-serif",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <UserNavbar />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              maxWidth: '480px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '64px', color: '#FFD700', marginBottom: '16px', display: 'block' }}
            >
              error_outline
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px' }}>
              No Session Receipt Found
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
              Please initiate a parking session lookup first.
            </p>
            <button
              onClick={() => navigate('/user')}
              style={{
                background: '#FFD700',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              START NEW SEARCH
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#F1F5F9',
        fontFamily: "'Space Grotesk', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Reused Desktop Navbar */}
      <UserNavbar />

      {/* Main Desktop Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '48px 32px 64px',
          boxSizing: 'border-box',
        }}
      >
        {/* 2-Column Side-by-Side Horizontal Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Success Confirmation & Feedback */}
          <div
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div>
              {/* Animated Emerald & Gold Check Badge */}
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 136, 0.12)',
                  border: '2px solid rgba(0, 255, 136, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#00FF88',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A0A0A',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.4)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '36px', fontWeight: 900 }}
                  >
                    check
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#00FF88',
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: '6px',
                }}
              >
                GATE CLEARANCE VERIFIED
              </div>

              <h1
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '44px',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  margin: '0 0 12px',
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                }}
              >
                PAYMENT CONFIRMED &amp; <span style={{ color: '#FFD700' }}>SESSION CLOSED</span>
              </h1>

              <p
                style={{
                  color: '#94A3B8',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  margin: '0 0 32px',
                }}
              >
                Your vehicle <strong style={{ color: '#FFD700', fontFamily: "'Space Mono', monospace" }}>{vehicleData.plate}</strong> has been logged as fully paid. Optical gate sensors have cleared your vehicle for automatic exit.
              </p>

              {/* Experience Rating Card */}
              <div
                style={{
                  background: '#1F1F1F',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#FFD700',
                    fontFamily: "'Space Mono', monospace",
                    marginBottom: '12px',
                  }}
                >
                  RATE YOUR SMART PARKING EXPERIENCE
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: active ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.08)',
                          background: active ? '#FFD700' : 'rgba(255,255,255,0.04)',
                          color: active ? '#0A0A0A' : '#64748B',
                          transition: 'all 0.15s ease',
                          transform: active ? 'scale(1.08)' : 'scale(1)',
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '26px',
                            fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                  {rating === 5
                    ? '★ Exceptional experience! Thank you for parking with VeloxPark.'
                    : `★ Thank you for providing ${rating}-star feedback.`}
                </div>
              </div>
            </div>

            {/* Bottom Return Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/user')}
                style={{
                  flex: 1,
                  height: '52px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#F1F5F9',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  search
                </span>
                NEW LOOKUP
              </button>

              <button
                type="button"
                onClick={() => navigate('/map')}
                style={{
                  flex: 1,
                  height: '52px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#F1F5F9',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  map
                </span>
                VIEW LIVE LOTS
              </button>
            </div>
          </div>

          {/* Right Column: Digital Parking Receipt Ticket */}
          <div
            style={{
              background: '#161616',
              border: '1.5px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              {/* Ticket Top Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '20px',
                  borderBottom: '1px dashed rgba(255, 255, 255, 0.12)',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: '#94A3B8',
                      fontWeight: 700,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    DIGITAL TAX RECEIPT
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '22px',
                      fontWeight: 800,
                      margin: '4px 0 0',
                      color: '#FFFFFF',
                    }}
                  >
                    {receiptId}
                  </h3>
                </div>

                <div
                  style={{
                    background: '#FFD700',
                    color: '#0A0A0A',
                    padding: '6px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    boxShadow: '0 4px 14px rgba(255, 215, 0, 0.3)',
                  }}
                >
                  PAID IN FULL
                </div>
              </div>

              {/* Facility details */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: '#FFD700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A0A0A',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                    local_parking
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>VeloxPark Urban Smart Hub</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Automated Gate Sensor Node #01 • Brooklyn
                  </div>
                </div>
              </div>

              {/* Itemized Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Vehicle Registration', value: vehicleData.plate, mono: true },
                  { label: 'Entry Time', value: formatDateTime(vehicleData.entry) },
                  {
                    label: 'Exit Time',
                    value: vehicleData.exit ? formatDateTime(vehicleData.exit) : '—',
                  },
                  {
                    label: 'Total Billable Duration',
                    value: formatDuration(vehicleData.duration) || '—',
                  },
                  { label: 'Payment Gateway', value: upiConfig?.upiId || 'parking@upi', mono: true },
                  { label: 'Merchant Entity', value: upiConfig?.upiName || 'VeloxPark' },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ color: '#94A3B8' }}>{label}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F1F5F9',
                        fontFamily: mono ? "'Space Mono', monospace" : "'Space Grotesk', sans-serif",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Amount Highlight */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>
                  Total Amount Paid
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    color: '#FFD700',
                    letterSpacing: '-1px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  ₹{vehicleData.amount || 0}
                </div>
              </div>
            </div>

            {/* Action: Download PDF Receipt */}
            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                onClick={onDownloadReceipt}
                style={{
                  width: '100%',
                  height: '60px',
                  background: '#FFD700',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '16px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '18px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 30px rgba(255, 215, 0, 0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF200';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFD700';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.35)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  download
                </span>
                DOWNLOAD OFFICIAL PDF RECEIPT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '24px 40px',
          background: '#0E0E0E',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748B',
        }}
      >
        © 2026 VeloxPark Operating Systems Inc. Official Electronic Clearance Receipt.
      </footer>
    </div>
  );
};

export default UserPaymentSuccessDesktop;
