import React, { useEffect, useState } from 'react';
import './AppSkeleton.css';

const AppSkeleton = ({ statusText = 'Loading VeloxPark...', theme = 'light' }) => {
  const isLight = theme !== 'dark';

  return (
    <div
      className={`vp-sk-root ${isLight ? 'theme-light' : 'theme-dark'}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* ══════════════════════════════════════════════════════════════
          1. WHITE / LIGHT THEME SKELETON (Matched to Shared Screenshot)
          ══════════════════════════════════════════════════════════════ */}
      {isLight ? (
        <>
          {/* ─── MOBILE VIEW (Viewport <= 768px) ─── */}
          <div className="vp-sk-mobile-view">
            {/* Top Header */}
            <header className="vp-sk-m-header">
              <div className="vp-sk-m-brand">
                <img
                  src="/brand/digital/veloxpark-app-icon.svg"
                  alt="VeloxPark"
                  className="vp-sk-m-logo-img"
                />
                <div className="vp-sk-m-brand-text">
                  <div className="vp-sk-box" style={{ width: '84px', height: '16px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '92px', height: '10px' }} />
                </div>
              </div>
              <div className="vp-sk-m-actions">
                <div className="vp-sk-m-circle-btn">
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', borderRadius: '50%', background: '#FECB35' }} />
                </div>
                <div className="vp-sk-m-circle-btn" style={{ border: '2px solid #FECB35', overflow: 'hidden' }}>
                  <div className="vp-sk-box" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px', borderRadius: '50%', background: '#4AE176', border: '1.5px solid #fff' }} />
                </div>
              </div>
            </header>

            {/* Greeting Section */}
            <div className="vp-sk-greeting">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="vp-sk-box" style={{ width: '190px', height: '22px', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="vp-sk-box vp-sk-gold" style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
                <div className="vp-sk-box vp-sk-darker" style={{ width: '185px', height: '12px', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Search Bar Pill */}
            <div className="vp-sk-m-search-wrap">
              <div className="vp-sk-m-search-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '75%' }}>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0 }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '80%', height: '14px' }} />
                </div>
                <div className="vp-sk-search-target-btn">
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #765B00', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: '2px', background: '#765B00', borderRadius: '50%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Pills Carousel */}
            <div className="vp-sk-quick-pills">
              <div className="vp-sk-pill-btn">
                <div className="vp-sk-box vp-sk-darker" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '100px', height: '13px' }} />
              </div>
              <div className="vp-sk-pill-btn">
                <div className="vp-sk-box vp-sk-darker" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '90px', height: '13px' }} />
              </div>
              <div className="vp-sk-pill-btn">
                <div className="vp-sk-box vp-sk-darker" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '70px', height: '13px' }} />
              </div>
            </div>

            {/* My Vehicles Section */}
            <div className="vp-sk-section-header">
              <div className="vp-sk-box" style={{ width: '105px', height: '18px' }} />
              <div className="vp-sk-box vp-sk-gold" style={{ width: '68px', height: '14px', borderRadius: '6px' }} />
            </div>

            {/* Active Vehicle Card (Dark Card matching screenshot) */}
            <div className="vp-sk-vehicle-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '26px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '18px', height: '12px', background: '#FECB35', borderRadius: '3px' }} />
                </div>
                <div style={{ padding: '2px 8px', borderRadius: '9999px', background: '#FECB35', color: '#010102', fontSize: '9px', fontWeight: 800 }}>
                  ACTIVE
                </div>
              </div>
              <div>
                <div style={{ width: '80px', height: '13px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ width: '75px', height: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Map Preview Card (Explore Live Map) */}
            <div className="vp-sk-map-card">
              <div className="vp-sk-map-canvas">
                {/* Floating Explore Live Map Button */}
                <div className="vp-sk-map-explore-btn">
                  <div className="vp-sk-box" style={{ width: '95px', height: '12px' }} />
                  <span style={{ fontSize: '11px', color: '#191C1F', fontWeight: 800 }}>↗</span>
                </div>

                {/* Map Road Corridors and Dashed Yellow Path */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 0 50 L 300 50 L 440 120" stroke="#E6ECF5" strokeWidth="18" fill="none" />
                  <path d="M 30 140 L 440 100" stroke="#E6ECF5" strokeWidth="14" fill="none" />
                  <path d="M 20 80 Q 180 90, 440 60" stroke="#FECB35" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                </svg>

                {/* Price Waypoint Pins */}
                <div className="vp-sk-map-pin" style={{ top: '22px', left: '38px' }}>₹60</div>
                <div className="vp-sk-map-pin" style={{ top: '35px', right: '115px' }}>₹45</div>
                <div className="vp-sk-map-pin" style={{ bottom: '24px', right: '70px' }}>₹30</div>
                <div className="vp-sk-map-pin center-pin" style={{ top: '48%', left: '46%' }}>P</div>
              </div>

              {/* Bottom Card Info Bar */}
              <div className="vp-sk-map-bottom-bar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
                    <div className="vp-sk-box" style={{ width: '120px', height: '13px' }} />
                  </div>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '150px', height: '10px' }} />
                </div>
                <div className="vp-sk-box vp-sk-darker" style={{ width: '70px', height: '12px' }} />
              </div>
            </div>

            {/* Nearby Parking Hubs Section Header */}
            <div className="vp-sk-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="vp-sk-box" style={{ width: '155px', height: '18px' }} />
                <div style={{ padding: '2px 8px', borderRadius: '9999px', background: '#ECEEF2', fontSize: '11px', fontWeight: 600, color: '#46464A' }}>
                  3 Anand Lots
                </div>
              </div>
              <div className="vp-sk-box vp-sk-gold" style={{ width: '58px', height: '14px', borderRadius: '4px' }} />
            </div>

            {/* Hub Card 1: Amul Dairy Road Hub */}
            <div className="vp-sk-hub-card">
              <div className="vp-sk-hub-top">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="vp-sk-hub-icon-box">P</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="vp-sk-box" style={{ width: '150px', height: '15px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="vp-sk-box vp-sk-darker" style={{ width: '45px', height: '11px' }} />
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8A8F98' }} />
                      <div className="vp-sk-box vp-sk-green" style={{ width: '65px', height: '11px' }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <div className="vp-sk-box" style={{ width: '48px', height: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '58px', height: '22px', borderRadius: '6px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '46px', height: '22px', borderRadius: '6px' }} />
                </div>
                <div className="vp-sk-hub-reserve-btn">Reserve</div>
              </div>
            </div>

            {/* Hub Card 2: Bhaikaka Statue Ground */}
            <div className="vp-sk-hub-card">
              <div className="vp-sk-hub-top">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="vp-sk-hub-icon-box">EV</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="vp-sk-box" style={{ width: '160px', height: '15px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="vp-sk-box vp-sk-darker" style={{ width: '45px', height: '11px' }} />
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8A8F98' }} />
                      <div className="vp-sk-box vp-sk-green" style={{ width: '70px', height: '11px' }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="vp-sk-box" style={{ width: '48px', height: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '55px', height: '22px', borderRadius: '6px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '64px', height: '22px', borderRadius: '6px' }} />
                </div>
                <div className="vp-sk-hub-reserve-btn">Reserve</div>
              </div>
            </div>

            {/* Hub Card 3: Vallabh Vidyanagar Central */}
            <div className="vp-sk-hub-card">
              <div className="vp-sk-hub-top">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="vp-sk-hub-icon-box">P</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="vp-sk-box" style={{ width: '165px', height: '15px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="vp-sk-box vp-sk-darker" style={{ width: '45px', height: '11px' }} />
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#8A8F98' }} />
                      <div className="vp-sk-box vp-sk-green" style={{ width: '70px', height: '11px' }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="vp-sk-box" style={{ width: '48px', height: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '68px', height: '22px', borderRadius: '6px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '45px', height: '22px', borderRadius: '6px' }} />
                </div>
                <div className="vp-sk-hub-reserve-btn">Reserve</div>
              </div>
            </div>

            {/* Floating Bottom Pill Dock matching UserMobileDock */}
            <div className="vp-sk-m-dock-wrap" aria-hidden="true">
              <nav className="vp-sk-m-dock">
                <div className="vp-sk-m-dock-tab" style={{ background: '#1C1C1E', borderRadius: '9999px', padding: '0 14px', width: 'auto', gap: '6px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FECB35' }} />
                  <div style={{ width: '38px', height: '11px', borderRadius: '3px', background: '#FFFFFF' }} />
                </div>
                <div className="vp-sk-m-dock-tab">
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                </div>
                <div className="vp-sk-m-dock-tab">
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                </div>
                <div className="vp-sk-m-dock-tab">
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                </div>
              </nav>
            </div>
          </div>

          {/* ─── DESKTOP VIEW (Viewport >= 769px) ─── */}
          <div className="vp-sk-desktop-view">
            <header className="vp-sk-d-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/brand/digital/veloxpark-app-icon.svg"
                  alt="VeloxPark"
                  className="vp-sk-m-logo-img"
                />
                <div>
                  <div className="vp-sk-box" style={{ width: '100px', height: '18px', marginBottom: '4px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '90px', height: '10px' }} />
                </div>
              </div>

              {/* Desktop Nav Pills */}
              <div style={{ display: 'flex', gap: '8px', background: '#ECEEF2', padding: '4px 6px', borderRadius: '9999px' }}>
                <div style={{ padding: '6px 16px', borderRadius: '9999px', background: '#010102', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                  Dashboard
                </div>
                <div className="vp-sk-box" style={{ width: '85px', height: '30px', borderRadius: '9999px' }} />
                <div className="vp-sk-box" style={{ width: '80px', height: '30px', borderRadius: '9999px' }} />
                <div className="vp-sk-box" style={{ width: '75px', height: '30px', borderRadius: '9999px' }} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="vp-sk-m-circle-btn" />
                <div className="vp-sk-m-circle-btn" style={{ border: '2px solid #FECB35' }} />
              </div>
            </header>

            {/* Desktop Dashboard 2-Column Grid */}
            <div className="vp-sk-d-grid">
              {/* Left Column: Greeting, Vehicles, and Live Map */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="vp-sk-greeting">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="vp-sk-box" style={{ width: '240px', height: '26px' }} />
                  </div>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '240px', height: '13px' }} />
                </div>

                {/* My Vehicles */}
                <div>
                  <div className="vp-sk-section-header">
                    <div className="vp-sk-box" style={{ width: '110px', height: '18px' }} />
                    <div className="vp-sk-box vp-sk-gold" style={{ width: '70px', height: '14px', borderRadius: '6px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div className="vp-sk-vehicle-card" style={{ width: '150px', height: '135px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '26px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ padding: '2px 8px', borderRadius: '9999px', background: '#FECB35', color: '#010102', fontSize: '9px', fontWeight: 800 }}>ACTIVE</div>
                      </div>
                      <div>
                        <div style={{ width: '90px', height: '14px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px', marginBottom: '6px' }} />
                        <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="vp-sk-map-card" style={{ margin: 0 }}>
                  <div className="vp-sk-map-canvas" style={{ height: '260px' }}>
                    <div className="vp-sk-map-explore-btn">
                      <div className="vp-sk-box" style={{ width: '100px', height: '12px' }} />
                      <span style={{ fontSize: '11px', fontWeight: 800 }}>↗</span>
                    </div>
                    <div className="vp-sk-map-pin" style={{ top: '40px', left: '60px' }}>₹60</div>
                    <div className="vp-sk-map-pin" style={{ top: '60px', right: '140px' }}>₹45</div>
                    <div className="vp-sk-map-pin" style={{ bottom: '40px', right: '90px' }}>₹30</div>
                    <div className="vp-sk-map-pin center-pin" style={{ top: '46%', left: '46%' }}>P</div>
                  </div>
                  <div className="vp-sk-map-bottom-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
                      <div className="vp-sk-box" style={{ width: '140px', height: '14px' }} />
                    </div>
                    <div className="vp-sk-box vp-sk-darker" style={{ width: '80px', height: '12px' }} />
                  </div>
                </div>
              </div>

              {/* Right Column: Search, Quick Actions, and Nearby Hubs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="vp-sk-m-search-wrap" style={{ margin: 0 }}>
                  <div className="vp-sk-m-search-bar" style={{ height: '56px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '80%' }}>
                      <div className="vp-sk-box vp-sk-darker" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      <div className="vp-sk-box vp-sk-darker" style={{ width: '70%', height: '15px' }} />
                    </div>
                    <div className="vp-sk-search-target-btn" style={{ width: '42px', height: '42px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #765B00' }} />
                    </div>
                  </div>
                </div>

                <div className="vp-sk-quick-pills" style={{ margin: 0 }}>
                  <div className="vp-sk-pill-btn"><div className="vp-sk-box" style={{ width: '110px', height: '14px' }} /></div>
                  <div className="vp-sk-pill-btn"><div className="vp-sk-box" style={{ width: '100px', height: '14px' }} /></div>
                  <div className="vp-sk-pill-btn"><div className="vp-sk-box" style={{ width: '80px', height: '14px' }} /></div>
                </div>

                {/* Hub Cards */}
                <div>
                  <div className="vp-sk-section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="vp-sk-box" style={{ width: '165px', height: '18px' }} />
                      <div style={{ padding: '2px 8px', borderRadius: '9999px', background: '#ECEEF2', fontSize: '11px', fontWeight: 600 }}>3 Lots</div>
                    </div>
                    <div className="vp-sk-box vp-sk-gold" style={{ width: '60px', height: '14px' }} />
                  </div>

                  {[1, 2, 3].map((hub) => (
                    <div key={hub} className="vp-sk-hub-card">
                      <div className="vp-sk-hub-top">
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div className="vp-sk-hub-icon-box">{hub === 2 ? 'EV' : 'P'}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div className="vp-sk-box" style={{ width: '160px', height: '15px' }} />
                            <div className="vp-sk-box vp-sk-green" style={{ width: '75px', height: '11px' }} />
                          </div>
                        </div>
                        <div className="vp-sk-box" style={{ width: '50px', height: '16px' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                        <div className="vp-sk-box vp-sk-darker" style={{ width: '110px', height: '22px', borderRadius: '6px' }} />
                        <div className="vp-sk-hub-reserve-btn">Reserve</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           2. DARK THEME SKELETON (Preserved Intact as requested)
           ══════════════════════════════════════════════════════════════ */
        <>
          <div className="vp-sk-ambient" />
          <div className="vp-sk-mobile-view">
            <header className="vp-sk-m-header">
              <div className="vp-sk-m-brand">
                <img
                  src="/brand/digital/veloxpark-app-icon.svg"
                  alt="VeloxPark"
                  className="vp-sk-m-logo-img"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="vp-sk-box" style={{ width: '90px', height: '16px' }} />
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '130px', height: '11px' }} />
                </div>
              </div>
            </header>
            <div className="vp-sk-m-search-wrap">
              <div className="vp-sk-m-search-bar">
                <div className="vp-sk-box vp-sk-gold" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '70%', height: '14px' }} />
              </div>
            </div>
            <div className="vp-sk-m-vehicle-grid">
              <div className="vp-sk-m-vehicle-card active">
                <div className="vp-sk-box vp-sk-gold" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
                <div className="vp-sk-box" style={{ width: '65px', height: '13px' }} />
              </div>
              <div className="vp-sk-m-vehicle-card">
                <div className="vp-sk-box" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
                <div className="vp-sk-box" style={{ width: '55px', height: '13px' }} />
              </div>
              <div className="vp-sk-m-vehicle-card">
                <div className="vp-sk-box" style={{ width: '34px', height: '34px', borderRadius: '10px' }} />
                <div className="vp-sk-box" style={{ width: '58px', height: '13px' }} />
              </div>
            </div>
            <div className="vp-sk-m-quick-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="vp-sk-m-quick-item">
                  <div className="vp-sk-m-quick-icon">
                    <div className="vp-sk-box vp-sk-gold" style={{ width: '22px', height: '22px', borderRadius: '6px' }} />
                  </div>
                  <div className="vp-sk-box vp-sk-darker" style={{ width: '48px', height: '10px' }} />
                </div>
              ))}
            </div>
            {[1, 2].map((hub) => (
              <div key={hub} className="vp-sk-m-hub-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="vp-sk-box" style={{ width: '140px', height: '14px' }} />
                  <div className="vp-sk-box vp-sk-gold" style={{ width: '50px', height: '14px' }} />
                </div>
              </div>
            ))}
            <div className="vp-sk-m-dock-wrap">
              <nav className="vp-sk-m-dock">
                <div style={{ width: '60px', height: '40px', borderRadius: '9999px', background: '#1F1F23', border: '1px solid #F2C230' }} />
                <div className="vp-sk-box" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <div className="vp-sk-box" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppSkeleton;
