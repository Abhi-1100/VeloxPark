import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, formatDuration } from '../../utils/parkingUtils';

const UserPaymentSuccessMobile = ({
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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 375
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;

  if (!vehicleData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#231f0f',
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '64px', color: '#f9d006', display: 'block', marginBottom: '16px' }}
          >
            error_outline
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
            No Session Data Found
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Please start a new search.</p>
          <button
            onClick={() => navigate('/user')}
            style={{
              background: '#f9d006',
              color: '#231f0f',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#231f0f',
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '12px 14px' : isTablet ? '14px 20px' : '16px 80px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(35,31,15,0.6)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#f9d006',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#231f0f',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              local_parking
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>
            VeloxPark
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '32px' }}>
          <nav style={{ display: isMobile ? 'none' : 'flex', gap: isTablet ? '16px' : '32px' }}>
            {['Dashboard', 'My Bookings', 'Settings'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#f9d006')}
                onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
              >
                {item}
              </a>
            ))}
          </nav>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid rgba(249,208,6,0.25)',
              background: '#3a3318',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f9d006',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            U
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '24px 12px' : '48px 16px',
          background: 'linear-gradient(180deg, rgba(249,208,6,0.05) 0%, transparent 40%)',
        }}
      >
        {/* Success Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '36px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(249,208,6,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#f9d006',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#231f0f',
                boxShadow: '0 8px 24px rgba(249,208,6,0.3)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '32px',
                  fontVariationSettings: "'FILL' 1, 'wght' 700",
                }}
              >
                check
              </span>
            </div>
          </div>
          <h1
            style={{
              fontSize: isMobile ? '30px' : '36px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              marginBottom: '8px',
              margin: 0,
            }}
          >
            Payment Successful
          </h1>
          <p style={{ color: '#64748b', fontWeight: 500, fontSize: '15px', marginTop: '6px' }}>
            Thank you for parking with us! Your session is now closed.
          </p>
        </div>

        {/* Digital Receipt Card */}
        <div style={{ width: '100%', maxWidth: '448px', position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: '#2d2816',
              borderRadius: '14px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Ticket Header */}
            <div
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px dashed rgba(255,255,255,0.1)',
                gap: '10px',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Digital Parking Receipt
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', margin: 0 }}>
                  {receiptId}
                </h3>
              </div>
              <div
                style={{
                  background: 'rgba(249,208,6,0.12)',
                  color: '#f9d006',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(249,208,6,0.25)',
                }}
              >
                Paid
              </div>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: isMobile ? '16px' : '24px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #3a3318, #1e1a0a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(249,208,6,0.15)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '28px', color: '#f9d006' }}
                  >
                    local_parking
                  </span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      marginBottom: '4px',
                      margin: 0,
                    }}
                  >
                    VeloxPark Facility
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      margin: '4px 0 0',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                      location_on
                    </span>
                    VeloxPark Parking System
                  </p>
                </div>
              </div>

              {/* Session Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '20px 16px',
                  marginBottom: '24px',
                }}
              >
                {[
                  { label: 'Entry Time', value: formatDateTime(vehicleData.entry) },
                  {
                    label: 'Exit Time',
                    value: vehicleData.exit ? formatDateTime(vehicleData.exit) : '—',
                  },
                  {
                    label: 'Total Time',
                    value: formatDuration(vehicleData.duration) || '—',
                  },
                  { label: 'Vehicle', value: vehicleData.plate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '4px',
                        margin: 0,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#e2e8f0',
                        margin: '4px 0 0',
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div
                style={{
                  paddingTop: '20px',
                  borderTop: '1px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', margin: 0 }}>
                  Total Amount Paid
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#f9d006',
                    letterSpacing: '-1px',
                    margin: 0,
                  }}
                >
                  ₹{vehicleData.amount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div
          style={{
            marginTop: '48px',
            width: '100%',
            maxWidth: '448px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#64748b',
              marginBottom: '16px',
            }}
          >
            Rate your experience
          </p>

          {/* Star Rating */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    width: isMobile ? '42px' : '48px',
                    height: isMobile ? '42px' : '48px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: active ? '#f9d006' : 'rgba(255,255,255,0.04)',
                    color: active ? '#231f0f' : '#475569',
                    transition: 'all 0.15s ease',
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '24px',
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={onDownloadReceipt}
              style={{
                width: '100%',
                height: '56px',
                background: '#f9d006',
                color: '#231f0f',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(249,208,6,0.2)',
                transition: 'box-shadow 0.2s, transform 0.15s',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                download
              </span>
              Download PDF Receipt
            </button>

            <button
              onClick={() => navigate('/user')}
              style={{
                width: '100%',
                height: '56px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '12px',
        }}
      >
        <p>© 2024 VeloxPark Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserPaymentSuccessMobile;
