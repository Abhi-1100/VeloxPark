import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import UserNavbar from './UserNavbar';
import { formatDateTime, formatDuration } from '../../utils/parkingUtils';

const UserPaymentPageDesktop = ({
  vehicleData,
  upiConfig,
  upiLink,
  onConfirmPayment,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const fallbackUpiLink =
    upiLink ||
    `upi://pay?pa=${upiConfig?.upiId || 'parking@upi'}&pn=${
      upiConfig?.upiName || 'VeloxPark'
    }&am=${vehicleData?.amount || 0}&cu=INR&tn=Parking-${vehicleData?.plate || ''}`;

  const handleCopyUpi = () => {
    if (upiConfig?.upiId) {
      navigator.clipboard.writeText(upiConfig.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              No Active Payment Session
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
              Please enter your vehicle plate number on the search page first.
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
              RETURN TO SEARCH
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
          padding: '40px 32px 64px',
          boxSizing: 'border-box',
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/user')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_back
            </span>
            Back to Vehicle Search
          </button>
        </div>

        {/* 2-Column Side-by-Side Horizontal Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Payment Summary & Itemized Details */}
          <div
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: '#FFD700',
                      fontFamily: "'Space Mono', monospace",
                      marginBottom: '4px',
                    }}
                  >
                    INVOICE CHECKOUT
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '32px',
                      fontWeight: 800,
                      margin: 0,
                      letterSpacing: '0.5px',
                    }}
                  >
                    PAYMENT BREAKDOWN
                  </h2>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 255, 136, 0.12)',
                    color: '#00FF88',
                    border: '1px solid rgba(0, 255, 136, 0.35)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  GATE READY
                </div>
              </div>

              {/* Amount Highlight */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(22,22,22,0.6) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: '18px',
                  padding: '24px',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: '#94A3B8',
                    marginBottom: '6px',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  TOTAL PAYABLE AMOUNT
                </div>
                <div
                  style={{
                    fontSize: '56px',
                    fontWeight: 900,
                    color: '#FFD700',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  ₹{vehicleData.amount || 0}
                </div>
                {vehicleData.amount === 0 ? (
                  <div style={{ color: '#00FF88', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>
                    Stay is within the free 30-minute grace window.
                  </div>
                ) : (
                  <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '8px' }}>
                    Standard tariff applied: ₹20 / hr beyond initial 30 minutes.
                  </div>
                )}
              </div>

              {/* Itemized Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Vehicle Plate', value: vehicleData.plate, highlight: true },
                  { label: 'Entry Recorded', value: formatDateTime(vehicleData.entry) },
                  {
                    label: 'Exit Recorded',
                    value: vehicleData.exit ? formatDateTime(vehicleData.exit) : 'Logged at Gate',
                  },
                  {
                    label: 'Total Billable Duration',
                    value: formatDuration(vehicleData.duration) || '—',
                  },
                  {
                    label: 'Settlement Merchant',
                    value: upiConfig?.upiName || 'VeloxPark Systems',
                  },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#94A3B8' }}>{label}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: highlight ? '#FFD700' : '#F1F5F9',
                        fontFamily: highlight
                          ? "'Space Mono', monospace"
                          : "'Space Grotesk', sans-serif",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guarantee Strip */}
            <div
              style={{
                marginTop: '28px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: '#00FF88', fontSize: '24px' }}
              >
                security
              </span>
              <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                Direct bank-to-bank settlement powered by NPCI Unified Payments Interface (UPI).
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated QR Code & Actions */}
          <div
            style={{
              background: '#161616',
              border: '1.5px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top gold glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
              }}
            />

            <h3
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '26px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                margin: '0 0 6px',
                color: '#FFFFFF',
              }}
            >
              SCAN DYNAMIC UPI QR
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#94A3B8',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Open any UPI app on your smartphone to scan and complete payment.
            </p>

            {/* High Contrast White QR Container */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '22px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <QRCodeSVG
                value={fallbackUpiLink}
                size={220}
                level="H"
                fgColor="#0A0A0A"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Supported Payment App Logos/Names */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '20px',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span style={{ padding: '4px 8px', background: '#1F1F1F', borderRadius: '6px' }}>
                Google Pay
              </span>
              <span style={{ padding: '4px 8px', background: '#1F1F1F', borderRadius: '6px' }}>
                PhonePe
              </span>
              <span style={{ padding: '4px 8px', background: '#1F1F1F', borderRadius: '6px' }}>
                Paytm
              </span>
              <span style={{ padding: '4px 8px', background: '#1F1F1F', borderRadius: '6px' }}>
                BHIM UPI
              </span>
            </div>

            {/* Copyable UPI ID Pill */}
            <button
              type="button"
              onClick={handleCopyUpi}
              style={{
                background: '#1F1F1F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                padding: '8px 20px',
                color: '#F1F5F9',
                fontSize: '13px',
                fontFamily: "'Space Mono', monospace",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '28px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FFD700')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <span style={{ color: '#94A3B8' }}>UPI ID:</span>
              <strong style={{ color: '#FFD700' }}>{upiConfig?.upiId || 'parking@upi'}</strong>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px', color: copied ? '#00FF88' : '#94A3B8' }}
              >
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied && <span style={{ color: '#00FF88', fontSize: '11px' }}>Copied!</span>}
            </button>

            {/* Action Buttons */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={onConfirmPayment}
                style={{
                  width: '100%',
                  height: '60px',
                  background: '#FFD700',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '16px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '20px',
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
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                CONFIRM PAYMENT
              </button>

              <button
                type="button"
                onClick={() => navigate('/user')}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  color: '#94A3B8',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFD700';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  close
                </span>
                Cancel &amp; Return to Search
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
        © 2026 VeloxPark Operating Systems Inc. All transactions encrypted via NPCI UPI protocol.
      </footer>
    </div>
  );
};

export default UserPaymentPageDesktop;
