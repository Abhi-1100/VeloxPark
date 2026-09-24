import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserNavbar = ({ onShowRates }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ratesModalOpen, setRatesModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRatesClick = () => {
    if (onShowRates) {
      onShowRates();
    } else {
      setRatesModalOpen(true);
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 40px',
          background: 'rgba(10, 10, 10, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            background: 'rgba(20, 20, 20, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '30px',
            padding: '8px 14px 8px 22px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate('/user')}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '3px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            VELOX<span style={{ color: '#FFD700' }}>.</span>PARK
          </div>

          {/* Links */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <button
                type="button"
                onClick={() => navigate('/user')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive('/user') ? '#FFD700' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontFamily: "'Barlow', sans-serif",
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive('/user')
                    ? '#FFD700'
                    : 'rgba(255, 255, 255, 0.65)')
                }
              >
                {isActive('/user') && (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#FFD700',
                      boxShadow: '0 0 8px #FFD700',
                    }}
                  />
                )}
                FIND VEHICLE
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleRatesClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontFamily: "'Barlow', sans-serif",
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
              >
                RATES
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => navigate('/map')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive('/map') ? '#FFD700' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontFamily: "'Barlow', sans-serif",
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive('/map')
                    ? '#FFD700'
                    : 'rgba(255, 255, 255, 0.65)')
                }
              >
                LIVE LOTS
              </button>
            </li>
          </ul>

          {/* Connect OS / Admin CTA */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: '#FFD700',
              color: '#000000',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 16px rgba(255, 215, 0, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.45)';
              e.currentTarget.style.background = '#FFF200';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.25)';
              e.currentTarget.style.background = '#FFD700';
            }}
          >
            ADMIN OS
          </button>
        </div>
      </nav>

      {/* Standalone Rates Modal */}
      {ratesModalOpen && (
        <div
          onClick={() => setRatesModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              color: '#F1F5F9',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#FFD700',
                  margin: 0,
                }}
              >
                PARKING TARIFF & RATES
              </h3>
              <button
                type="button"
                onClick={() => setRatesModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: '#1F1F1F',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>First 30 Minutes</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Grace / drop-off period</div>
                </div>
                <span
                  style={{
                    background: 'rgba(0, 255, 136, 0.15)',
                    color: '#00FF88',
                    border: '1px solid rgba(0, 255, 136, 0.35)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  FREE
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>Hourly Standard Rate</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Charged per hour thereafter</div>
                </div>
                <span
                  style={{
                    color: '#FFD700',
                    fontWeight: 900,
                    fontSize: '20px',
                  }}
                >
                  ₹20 / hr
                </span>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              * Time calculations are logged instantaneously by high-precision smart optical sensors upon entry and exit gates.
            </p>

            <button
              type="button"
              onClick={() => setRatesModalOpen(false)}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                background: '#FFD700',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
