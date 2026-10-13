import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import networkAccessBannerImg from '../assets/network-access-banner.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Downtown Central');
  const [selectedPrice, setSelectedPrice] = useState('$15 - $30 / hr');
  const [selectedTime, setSelectedTime] = useState('05:00 PM - 07:00 PM');
  const [activePin, setActivePin] = useState(2); // default spot 2

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', role: 'Driver Mobility & Navigation', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success'
  const [ticketId, setTicketId] = useState('');

  const mapSpots = [
    { id: 1, name: 'Metro Terminal Bay', price: '$12/hr', zone: 'Zone A-04', spots: '8 spots available', rateNum: 12 },
    { id: 2, name: 'Velox Central Tower', price: '$18/hr', zone: 'Zone B-12', spots: '14 spots available', rateNum: 18 },
    { id: 3, name: 'Silicon Hub Garage', price: '$15/hr', zone: 'Zone C-07', spots: '5 spots available', rateNum: 15 },
    { id: 4, name: 'Waterfront Plaza Deck', price: '$10/hr', zone: 'Zone D-02', spots: '21 spots available', rateNum: 10 }
  ];

  const currentSpot = mapSpots.find(s => s.id === activePin) || mapSpots[1];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;

    setFormStatus('sending');
    const generatedTicket = 'VP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTicketId(generatedTicket);

    try {
      const response = await fetch('https://formsubmit.co/ajax/supportproject1100@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[${generatedTicket}] VeloxPark Inquiry: ${contactForm.role} - ${contactForm.name || 'Anonymous'}`,
          Callsign_Name: contactForm.name,
          Return_Email: contactForm.email,
          Inquiry_Domain: contactForm.role,
          Transmission_Message: contactForm.message,
          Ticket_Reference: generatedTicket,
          _captcha: 'false'
        })
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        window.open(`mailto:supportproject1100@gmail.com?subject=VeloxPark Inquiry [${generatedTicket}]&body=Name: ${encodeURIComponent(contactForm.name)}%0D%0AEmail: ${encodeURIComponent(contactForm.email)}%0D%0ADomain: ${encodeURIComponent(contactForm.role)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(contactForm.message)}`);
        setFormStatus('success');
      }
    } catch (err) {
      console.warn('FormSubmit network notice, falling back to mailto:', err);
      window.open(`mailto:supportproject1100@gmail.com?subject=VeloxPark Inquiry [${generatedTicket}]&body=Name: ${encodeURIComponent(contactForm.name)}%0D%0AEmail: ${encodeURIComponent(contactForm.email)}%0D%0ADomain: ${encodeURIComponent(contactForm.role)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(contactForm.message)}`);
      setFormStatus('success');
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="velox-landing">
      {/* ─── 1. RESTORED OLD FLOATING PILL NAVBAR ─── */}
      <nav className="nav-wrapper">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollToSection('hero')}>
            <img src="/brand/digital/veloxpark-app-icon.svg" alt="" />
            <span className="nav-logo-wordmark">VELOX<span>.</span>PARK</span>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <ul className="nav-links">
            <li><button onClick={() => scrollToSection('features')}>Nodes</button></li>
            <li><button onClick={() => scrollToSection('features')}>Core</button></li>
            <li><button onClick={() => scrollToSection('about')}>Scale</button></li>
            <li><button onClick={() => scrollToSection('live-map')}>Map</button></li>
          </ul>

          <div className="nav-right-actions">
            {user ? (
              <button className="btn-connect" onClick={() => navigate('/dashboard')}>
                DASHBOARD ↗
              </button>
            ) : (
              <>
                <button className="nav-link-login" onClick={() => navigate('/login')}>
                  LOGIN
                </button>
                <button className="btn-connect" onClick={() => scrollToSection('contact')}>
                  CONTACT
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`nav-mobile ${mobileMenuOpen ? 'is-open' : ''}`}>
          <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }}>Nodes</button>
          <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }}>Core</button>
          <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }}>Scale</button>
          <button onClick={() => { scrollToSection('live-map'); setMobileMenuOpen(false); }}>Live Map</button>
          {user ? (
            <button className="btn-connect" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>DASHBOARD</button>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</button>
              <button className="btn-connect" onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}>CONTACT</button>
            </>
          )}
        </div>
      </nav>

      {/* ─── 2. HERO SECTION (EXACTLY LIKE REFERENCE IMAGE) ─── */}
      <section id="hero" className="vl-hero-section">
        <div className="velox-container">
          <div className="vl-hero-card">
            {/* Detailed Authentic Street Map SVG Background with Cars, GPS route & HUDs */}
            <svg
              className="vl-hero-full-map-svg"
              viewBox="0 0 1200 680"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="carGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
                </filter>
                <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38BDF8" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Base Dark Map Background */}
              <rect width="1200" height="680" fill="#0A0E17" />

              {/* Urban Grid Parcels & Building Blocks */}
              <g fill="#0D1321" stroke="#121A2C" strokeWidth="1">
                {/* Block Cluster Left */}
                <rect x="30" y="40" width="75" height="55" rx="3" />
                <rect x="115" y="40" width="85" height="55" rx="3" />
                <rect x="30" y="105" width="80" height="70" rx="3" />
                <rect x="120" y="105" width="90" height="70" rx="3" />
                <rect x="30" y="185" width="60" height="90" rx="3" />
                <rect x="100" y="185" width="110" height="90" rx="3" />
                <rect x="30" y="285" width="90" height="65" rx="3" />
                <rect x="130" y="285" width="85" height="65" rx="3" />
                <rect x="30" y="360" width="70" height="75" rx="3" />
                <rect x="110" y="360" width="105" height="75" rx="3" />
                <rect x="30" y="445" width="95" height="85" rx="3" />
                <rect x="135" y="445" width="80" height="85" rx="3" />
                <rect x="30" y="540" width="85" height="90" rx="3" />
                <rect x="125" y="540" width="95" height="90" rx="3" />

                {/* Block Cluster Center */}
                <rect x="230" y="40" width="95" height="60" rx="3" />
                <rect x="335" y="40" width="115" height="60" rx="3" />
                <rect x="460" y="40" width="90" height="60" rx="3" />
                <rect x="560" y="40" width="105" height="60" rx="3" />
                <rect x="230" y="110" width="100" height="70" rx="3" />
                <rect x="340" y="110" width="110" height="70" rx="3" />
                <rect x="460" y="110" width="95" height="70" rx="3" />
                <rect x="565" y="110" width="100" height="70" rx="3" />
                <rect x="230" y="190" width="90" height="85" rx="3" />
                <rect x="330" y="190" width="120" height="85" rx="3" />
                <rect x="460" y="190" width="100" height="85" rx="3" />
                <rect x="570" y="190" width="95" height="85" rx="3" />

                {/* Block Cluster Right */}
                <rect x="680" y="40" width="100" height="60" rx="3" />
                <rect x="790" y="40" width="110" height="60" rx="3" />
                <rect x="910" y="40" width="120" height="60" rx="3" />
                <rect x="1040" y="40" width="115" height="60" rx="3" />
                <rect x="680" y="110" width="95" height="70" rx="3" />
                <rect x="785" y="110" width="115" height="70" rx="3" />
                <rect x="910" y="110" width="115" height="70" rx="3" />
                <rect x="1035" y="110" width="125" height="70" rx="3" />
                <rect x="680" y="190" width="105" height="85" rx="3" />
                <rect x="795" y="190" width="105" height="85" rx="3" />
                <rect x="910" y="190" width="120" height="85" rx="3" />
                <rect x="1040" y="190" width="120" height="85" rx="3" />

                {/* Lower Right Blocks */}
                <rect x="790" y="285" width="105" height="70" rx="3" />
                <rect x="905" y="285" width="115" height="70" rx="3" />
                <rect x="1030" y="285" width="125" height="70" rx="3" />
                <rect x="800" y="365" width="95" height="75" rx="3" />
                <rect x="905" y="365" width="120" height="75" rx="3" />
                <rect x="1035" y="365" width="120" height="75" rx="3" />
                <rect x="810" y="450" width="85" height="80" rx="3" />
                <rect x="905" y="450" width="125" height="80" rx="3" />
                <rect x="1040" y="450" width="120" height="80" rx="3" />
                <rect x="820" y="540" width="85" height="90" rx="3" />
                <rect x="915" y="540" width="115" height="90" rx="3" />
                <rect x="1040" y="540" width="120" height="90" rx="3" />
              </g>

              {/* City Street Network (Dark Navy Arterials) */}
              <g stroke="#141D2D" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Secondary Cross Streets */}
                <line x1="0" y1="100" x2="1200" y2="100" strokeWidth="12" />
                <line x1="0" y1="180" x2="1200" y2="180" strokeWidth="12" />
                <line x1="0" y1="280" x2="1200" y2="280" strokeWidth="14" />
                <line x1="0" y1="355" x2="1200" y2="355" strokeWidth="12" />
                <line x1="0" y1="440" x2="1200" y2="440" strokeWidth="12" />
                <line x1="0" y1="535" x2="1200" y2="535" strokeWidth="12" />

                <line x1="110" y1="0" x2="110" y2="680" strokeWidth="12" />
                <line x1="220" y1="0" x2="220" y2="680" strokeWidth="14" />
                <line x1="330" y1="0" x2="330" y2="680" strokeWidth="12" />
                <line x1="450" y1="0" x2="450" y2="680" strokeWidth="14" />
                <line x1="560" y1="0" x2="560" y2="680" strokeWidth="12" />
                <line x1="675" y1="0" x2="675" y2="680" strokeWidth="14" />
                <line x1="785" y1="0" x2="785" y2="680" strokeWidth="12" />
                <line x1="900" y1="0" x2="900" y2="680" strokeWidth="14" />
                <line x1="1030" y1="0" x2="1030" y2="680" strokeWidth="12" />

                {/* Major Diagonal Highway Arterial Crossing */}
                <path d="M -50,420 C 180,440 320,500 500,590 S 800,680 1250,680" stroke="#182338" strokeWidth="26" />
                <path d="M 460,680 C 580,590 680,480 840,240 S 980,60 1060,-40" stroke="#182338" strokeWidth="26" />
                <path d="M -40,220 C 220,240 450,290 820,380 S 1100,430 1240,440" stroke="#182338" strokeWidth="24" />
              </g>

              {/* ─── DOTTED CYAN GPS NAVIGATION PATH ─── */}
              <g stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 5" fill="none" opacity="0.85">
                {/* Left Approach path toward Car 1 */}
                <path d="M 120,440 L 220,470 L 320,510 L 400,545" />
                {/* Path from Car 1 toward Car 2 and continuing up */}
                <path d="M 445,570 L 530,610 L 610,630 L 660,590 L 685,550" />
                <path d="M 698,500 L 730,420 L 775,320 L 820,230" />
              </g>

              {/* ─── LEFT HUD SENSOR RETICLE + CYAN STATUS BARS ─── */}
              <g transform="translate(200, 520)" filter="url(#radarGlow)">
                {/* Outer HUD Target Rings */}
                <circle cx="0" cy="0" r="17" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.75" />
                <circle cx="0" cy="0" r="12" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.85" />
                <circle cx="0" cy="0" r="6" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.9" />
                <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                {/* Small tick markers */}
                <line x1="-19" y1="0" x2="-14" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="14" y1="0" x2="19" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="0" y1="-19" x2="0" y2="-14" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="0" y1="14" x2="0" y2="19" stroke="#38BDF8" strokeWidth="1.5" />

                {/* Left Cyan Status Bars */}
                <rect x="28" y="-7.5" width="50" height="7" rx="3.5" fill="#38BDF8" />
                <rect x="28" y="4" width="24" height="7" rx="3.5" fill="#38BDF8" />
              </g>

              {/* ─── CAR 1 (WHITE SPORTS CAR HEADING DIAGONALLY DOWN-RIGHT) ─── */}
              <g transform="translate(425, 545) rotate(32)" filter="url(#carGlow)">
                {/* Car Shadow */}
                <rect x="-18" y="-38" width="36" height="76" rx="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

                {/* Sleek White Car Body Shell */}
                <path
                  d="M -15,-32 C -15,-40 15,-40 15,-32 L 16,28 C 16,36 -16,36 -16,28 Z"
                  fill="#FFFFFF"
                />

                {/* Front Bumper & Headlight Pods */}
                <path d="M -13,-36 C -8,-39 8,-39 13,-36" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                <rect x="-14" y="-38" width="5" height="2.5" rx="1" fill="#FEF08A" />
                <rect x="9" y="-38" width="5" height="2.5" rx="1" fill="#FEF08A" />

                {/* Dark Tinted Windshield */}
                <path d="M -12,-20 L 12,-20 L 14,-7 L -14,-7 Z" fill="#111827" />

                {/* Car Roof Panel */}
                <rect x="-12" y="-7" width="24" height="24" rx="4" fill="#F1F5F9" />

                {/* Dark Tinted Rear Window */}
                <path d="M -12,17 L 12,17 L 11,24 L -11,24 Z" fill="#111827" />

                {/* Side Mirrors */}
                <rect x="-19" y="-15" width="4" height="7" rx="1.5" fill="#FFFFFF" />
                <rect x="15" y="-15" width="4" height="7" rx="1.5" fill="#FFFFFF" />

                {/* Rear Tail Lamps */}
                <rect x="-13" y="32" width="6" height="2" rx="1" fill="#EF4444" />
                <rect x="7" y="32" width="6" height="2" rx="1" fill="#EF4444" />
              </g>

              {/* ─── WHITE NAVIGATION ARROWHEAD (Directly ahead of Car 1) ─── */}
              {/* Pointing forward in direction of motion (angled ~32deg) */}
              <polygon
                points="492,576 464,582 478,556"
                fill="#FFFFFF"
                filter="url(#carGlow)"
              />

              {/* ─── CAR 2 (WHITE SPORTS CAR HEADING DIAGONALLY UP-RIGHT) ─── */}
              <g transform="translate(692, 532) rotate(-22)" filter="url(#carGlow)">
                {/* Car Shadow */}
                <rect x="-17" y="-37" width="34" height="74" rx="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

                {/* Sleek White Car Body Shell */}
                <path
                  d="M -15,-32 C -15,-40 15,-40 15,-32 L 16,28 C 16,36 -16,36 -16,28 Z"
                  fill="#FFFFFF"
                />

                {/* Front Bumper & Headlights */}
                <path d="M -13,-36 C -8,-39 8,-39 13,-36" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
                <rect x="-14" y="-38" width="5" height="2.5" rx="1" fill="#FEF08A" />
                <rect x="9" y="-38" width="5" height="2.5" rx="1" fill="#FEF08A" />

                {/* Dark Tinted Windshield */}
                <path d="M -12,-20 L 12,-20 L 14,-7 L -14,-7 Z" fill="#111827" />

                {/* Car Roof Panel */}
                <rect x="-12" y="-7" width="24" height="24" rx="4" fill="#F1F5F9" />

                {/* Dark Tinted Rear Window */}
                <path d="M -12,17 L 12,17 L 11,24 L -11,24 Z" fill="#111827" />

                {/* Side Mirrors */}
                <rect x="-19" y="-15" width="4" height="7" rx="1.5" fill="#FFFFFF" />
                <rect x="15" y="-15" width="4" height="7" rx="1.5" fill="#FFFFFF" />

                {/* Rear Tail Lamps */}
                <rect x="-13" y="32" width="6" height="2" rx="1" fill="#EF4444" />
                <rect x="7" y="32" width="6" height="2" rx="1" fill="#EF4444" />
              </g>

              {/* ─── RIGHT HUD SENSOR RETICLE + CYAN STATUS BARS ─── */}
              <g transform="translate(900, 535)" filter="url(#radarGlow)">
                {/* Outer HUD Target Rings */}
                <circle cx="0" cy="0" r="17" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.75" />
                <circle cx="0" cy="0" r="12" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.85" />
                <circle cx="0" cy="0" r="6" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.9" />
                <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                {/* Tick markers */}
                <line x1="-19" y1="0" x2="-14" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="14" y1="0" x2="19" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="0" y1="-19" x2="0" y2="-14" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="0" y1="14" x2="0" y2="19" stroke="#38BDF8" strokeWidth="1.5" />

                {/* Right Cyan Status Bars */}
                <rect x="28" y="-7.5" width="52" height="7" rx="3.5" fill="#38BDF8" />
                <rect x="28" y="4" width="26" height="7" rx="3.5" fill="#38BDF8" />
              </g>
            </svg>

            {/* ─── CENTER HERO TEXT & DOWNLOAD APP BUTTON ─── */}
            <div className="vl-hero-center-content">
              <h1 className="vl-hero-headline">
                Parking just got a<br />lot simpler
              </h1>
              <p className="vl-hero-subtitle">
                The mobile parking app integrated with GPS to make finding parking spots quick and easy with competitive pricing.
              </p>
              <button className="vl-hero-download-btn" onClick={() => navigate('/login')}>
                <span>Download App</span>
              </button>
            </div>

            {/* Bottom spacer so SVG scene is positioned in the lower area */}
            <div className="vl-hero-bottom-stage"></div>
          </div>
        </div>
      </section>

      {/* ─── 3. TWO SPLIT FEATURE / STAT CARDS BELOW HERO ─── */}
      <section className="vl-split-cards-section" id="about">
        <div className="velox-container">
          <div className="vl-split-grid">
            {/* Left Card: Velox Gold Brand Accent Card */}
            <div className="vl-accent-card">
              <h2 className="vl-accent-card-heading">
                There are systems that offer nearby listings and competitive prices
              </h2>
              <div className="vl-accent-card-bottom">
                <span className="vl-accent-badge">Smart Grid Engine</span>
                <div className="vl-accent-arrow" onClick={() => scrollToSection('features')}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Right Card: Pure White Card with 2 columns */}
            <div className="vl-stats-card">
              {/* 99% Column */}
              <div className="vl-stat-col">
                <div className="vl-stat-num">99%</div>
                <div className="vl-stat-label">
                  Accurate data based<br />on our system
                </div>
                <div className="vl-store-badges">
                  <button className="vl-store-pill" onClick={() => navigate('/login')}>
                    <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.74-.86 2.76 1 .08 2.02-.51 2.57-1.26z"/></svg>
                    <span>App Store</span>
                  </button>
                  <button className="vl-store-pill" onClick={() => navigate('/login')}>
                    <svg viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.5 1.5 0 0 1-.61-.954V2.768c0-.395.23-.746.609-.954zm11.242 11.244l2.58 2.58-12.33 7.12 9.75-9.7zm0-2.116L5.1 1.242l12.33 7.12-2.58 2.58zm1.06 1.058l3.47-2.003a1.5 1.5 0 0 1 0 2.602l-3.47 2.003-1.41-1.41 1.41-1.192z"/></svg>
                    <span>Google Play</span>
                  </button>
                </div>
              </div>

              {/* 570K+ Column */}
              <div className="vl-stat-col">
                <div className="vl-stat-num">570K+</div>
                <div className="vl-stat-label">
                  Users actively using the<br />application
                </div>
                <div className="vl-avatar-stack-wrap">
                  <div className="vl-avatar-stack">
                    <img className="vl-avatar-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Active user" />
                    <img className="vl-avatar-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Active user" />
                    <img className="vl-avatar-img" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Active user" />
                    <img className="vl-avatar-img" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Active user" />
                  </div>
                  <div className="vl-avatar-rating">
                    <span className="vl-stars-yellow">★★★★★</span>
                    <span>4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SECTION: THE SOLUTION TO YOUR PARKING PROBLEMS ─── */}
      <section className="vl-solution-section" id="features">
        <div className="velox-container">
          <div className="vl-solution-grid">
            {/* Left Content */}
            <div className="vl-solution-left">
              <h2 className="vl-section-h2">
                The solution to your<br />parking problems
              </h2>
              <p className="vl-section-desc">
                We understand that finding a parking space can be a challenge for many. Our app addresses this problem with these three essential features:
              </p>

              <ul className="vl-feature-checklist">
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Well-organized information</span>
                </li>
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Google Maps integration</span>
                </li>
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Integration with car sensors</span>
                </li>
              </ul>

              <button className="vl-learn-btn" onClick={() => scrollToSection('live-map')}>
                <span>Learn more</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
            </div>

            {/* Right: Phone Mockup Screen 1 */}
            <div className="vl-phone-container">
              <div className="vl-phone-backdrop"></div>
              <div className="vl-iphone">
                <div className="vl-iphone-island">
                  <div className="vl-island-camera"></div>
                  <div className="vl-island-sensor"></div>
                </div>

                <div className="vl-iphone-screen">
                  {/* Header */}
                  <div className="vl-app-header">
                    <div>
                      <div className="vl-app-greeting">Good morning,</div>
                      <div className="vl-app-user">Alex Morgan</div>
                    </div>
                    <div className="vl-app-bell">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>notifications</span>
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="vl-balance-card">
                    <div>
                      <div className="vl-balance-label">Total Balance</div>
                      <div className="vl-balance-val">$3,192.00</div>
                    </div>
                    <div className="vl-balance-plus">+</div>
                  </div>

                  {/* Vehicle Tabs */}
                  <div className="vl-veh-row">
                    <div className="vl-veh-chip active">
                      <span>🚗</span>
                      <div>Car</div>
                    </div>
                    <div className="vl-veh-chip">
                      <span>🏍️</span>
                      <div>Bike</div>
                    </div>
                    <div className="vl-veh-chip">
                      <span>🚚</span>
                      <div>Truck</div>
                    </div>
                    <div className="vl-veh-chip">
                      <span>🚌</span>
                      <div>Bus</div>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="vl-mock-search">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>search</span>
                    <span>Find Parking Space...</span>
                    <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '16px' }}>tune</span>
                  </div>

                  {/* Mini Map */}
                  <div className="vl-mock-map">
                    <div className="vl-map-route"></div>
                    <div className="vl-map-pin">P • $4.50</div>
                  </div>

                  {/* Nearby Spot Card */}
                  <div className="vl-mock-spot-card">
                    <div>
                      <div className="vl-spot-title">QuickPark Central</div>
                      <div className="vl-spot-sub">120m away • 14 spots left</div>
                    </div>
                    <div className="vl-spot-rate">$4.50/hr</div>
                  </div>

                  {/* Bottom Tab Bar */}
                  <div className="vl-mock-tab-bar">
                    <span className="material-symbols-outlined active">home</span>
                    <span className="material-symbols-outlined">explore</span>
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. SECTION: THE SOLUTION TO YOUR PARKING CHALLENGES (Alternating) ─── */}
      <section className="vl-challenges-section">
        <div className="velox-container">
          <div className="vl-challenges-grid">
            {/* Left: Phone Mockup Screen 2 (My Booking) */}
            <div className="vl-phone-container">
              <div className="vl-phone-backdrop" style={{ background: 'linear-gradient(135deg, #FDF4DB 0%, #F5E6B8 100%)' }}></div>
              <div className="vl-iphone">
                <div className="vl-iphone-island">
                  <div className="vl-island-camera"></div>
                  <div className="vl-island-sensor"></div>
                </div>

                <div className="vl-iphone-screen">
                  {/* Header */}
                  <div className="vl-app-header">
                    <div className="vl-app-user">My Booking</div>
                    <div className="vl-app-bell">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>more_vert</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="vl-booking-tabs">
                    <div className="vl-booking-tab active">Active</div>
                    <div className="vl-booking-tab">Completed</div>
                    <div className="vl-booking-tab">Cancelled</div>
                  </div>

                  {/* Active Ticket Card */}
                  <div className="vl-active-ticket-card">
                    <div className="vl-ticket-header">
                      <span className="vl-ticket-zone">Zone B-14 • Grand Plaza</span>
                      <span className="vl-ticket-badge">Reserved</span>
                    </div>
                    <div className="vl-ticket-timer">01:45:20</div>
                    <div className="vl-ticket-sub">Spot #42 • Level 2 Underground</div>
                    <div className="vl-ticket-actions">
                      <button className="vl-nav-action-btn" onClick={() => navigate('/login')}>Navigate</button>
                      <button className="vl-extend-action-btn">Extend +1h</button>
                    </div>
                  </div>

                  {/* Saved / Recommended lots list */}
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px' }}>Saved Locations</div>

                  <div className="vl-saved-lot-item">
                    <div className="vl-saved-lot-info">
                      <span className="vl-saved-lot-name">ParkStar City Center</span>
                      <span className="vl-saved-lot-meta">4.9 ★ • 180m • $4.20/hr</span>
                    </div>
                    <button className="vl-book-mini-btn" onClick={() => navigate('/login')}>Book</button>
                  </div>

                  <div className="vl-saved-lot-item">
                    <div className="vl-saved-lot-info">
                      <span className="vl-saved-lot-name">Skyline Airport Terminal</span>
                      <span className="vl-saved-lot-meta">4.8 ★ • 650m • $5.00/hr</span>
                    </div>
                    <button className="vl-book-mini-btn" onClick={() => navigate('/login')}>Book</button>
                  </div>

                  {/* Bottom Tab Bar */}
                  <div className="vl-mock-tab-bar" style={{ marginTop: 'auto' }}>
                    <span className="material-symbols-outlined">home</span>
                    <span className="material-symbols-outlined">explore</span>
                    <span className="material-symbols-outlined active">calendar_today</span>
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="vl-challenges-right">
              <h2 className="vl-section-h2">
                The solution to your<br />parking challenges.
              </h2>
              <p className="vl-section-desc">
                We know that locating a parking spot can be tough for a lot of people. Our app tackles this issue with these three key features:
              </p>

              <ul className="vl-feature-checklist">
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Structured and clear information</span>
                </li>
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Google Maps integration</span>
                </li>
                <li className="vl-checklist-item">
                  <div className="vl-check-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                  </div>
                  <span>Integration with automotive sensors</span>
                </li>
              </ul>

              <button className="vl-learn-btn" onClick={() => scrollToSection('contact')}>
                <span>Learn more</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SECTION: EASY WAY TO FIND PARKING LOCATION HERE ─── */}
      <section className="vl-map-search-section" id="live-map">
        <div className="velox-container">
          <div className="vl-map-search-header">
            <h2 className="vl-section-h2" style={{ marginBottom: '12px' }}>
              Easy way to find parking location here
            </h2>
            <p className="vl-section-desc" style={{ marginBottom: 0 }}>
              Search across our real-time smart grid and reserve your spot in seconds.
            </p>
          </div>

          {/* Floating Filter Card */}
          <div className="vl-filter-card">
            <div className="vl-filter-field">
              <label className="vl-filter-label" htmlFor="filter-location">Location?</label>
              <select
                id="filter-location"
                className="vl-filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="Downtown Central">Downtown Central</option>
                <option value="Silicon Tech Corridor">Silicon Tech Corridor</option>
                <option value="City Airport Terminal">City Airport Terminal</option>
                <option value="Waterfront Bay Area">Waterfront Bay Area</option>
              </select>
            </div>

            <div className="vl-filter-divider"></div>

            <div className="vl-filter-field">
              <label className="vl-filter-label" htmlFor="filter-price">Price range</label>
              <select
                id="filter-price"
                className="vl-filter-select"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                <option value="$5 - $15 / hr">$5 - $15 / hr</option>
                <option value="$15 - $30 / hr">$15 - $30 / hr</option>
                <option value="$30 - $50 / hr">$30 - $50 / hr</option>
                <option value="All Rates">All Rates</option>
              </select>
            </div>

            <div className="vl-filter-divider"></div>

            <div className="vl-filter-field">
              <label className="vl-filter-label" htmlFor="filter-time">Parking type (Hourly)</label>
              <select
                id="filter-time"
                className="vl-filter-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
                <option value="All Day Pass">All Day Pass</option>
              </select>
            </div>

            <button className="vl-filter-submit-btn" onClick={() => navigate('/login')}>
              Get Access
            </button>
          </div>

          {/* Dark Vector Map Card */}
          <div className="vl-interactive-map-card">
            <div className="vl-map-grid-layer"></div>

            {/* Vector Highway Roads in Map */}
            <svg className="vl-map-vector-roads" viewBox="0 0 1000 480" preserveAspectRatio="none">
              <path d="M 50,380 C 300,380 450,220 750,210 S 950,90 980,80" stroke="rgba(255,255,255,0.12)" strokeWidth="18" fill="none" />
              <path d="M 50,380 C 300,380 450,220 750,210 S 950,90 980,80" stroke="var(--velox-gold)" strokeWidth="3" strokeDasharray="8,10" fill="none" />
              <path d="M 220,50 L 220,450" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
              <path d="M 720,20 L 720,460" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
            </svg>

            {/* Interactive Spot Pins */}
            {mapSpots.map((spot) => (
              <div
                key={spot.id}
                className={`vl-map-spot-pin vl-map-spot-pin-${spot.id} ${activePin === spot.id ? 'active' : ''}`}
                onClick={() => setActivePin(spot.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_parking</span>
                <span>{spot.price}</span>
              </div>
            ))}

            {/* Active Spot Detail Floating Box */}
            <div className="vl-map-detail-card">
              <div className="vl-map-detail-header">
                <div className="vl-map-detail-title">{currentSpot.name}</div>
                <div className="vl-map-detail-badge">{currentSpot.spots}</div>
              </div>
              <div className="vl-map-detail-meta">
                {currentSpot.zone} • Rate: <strong>{currentSpot.price}</strong> • Real-time LiDAR live
              </div>
              <button className="vl-map-detail-btn" onClick={() => navigate('/login')}>
                Reserve Spot Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. SECTION: WHAT OUR USERS SAY ABOUT US ─── */}
      <section className="vl-testimonials-section" id="reviews">
        <div className="velox-container">
          <div className="vl-testimonials-header">
            <h2 className="vl-section-h2" style={{ marginBottom: '12px' }}>
              What our users say<br />about us
            </h2>
          </div>

          <div className="vl-testimonials-grid">
            <div className="vl-testimonial-card">
              <div className="vl-quote-icon-bubble">“</div>
              <p className="vl-quote-text">
                VeloxPark cut my daily commute parking search from 20 minutes to zero. The car sensor integration guides me straight into the reserved stall.
              </p>
              <div className="vl-reviewer-row">
                <img className="vl-reviewer-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Michael Jackson" />
                <div className="vl-reviewer-info">
                  <span className="vl-reviewer-name">Michael Jackson</span>
                  <span className="vl-reviewer-stars">★★★★★</span>
                </div>
              </div>
            </div>

            <div className="vl-testimonial-card">
              <div className="vl-quote-icon-bubble">“</div>
              <p className="vl-quote-text">
                The real-time sensor sync is unmatched. I can see live stall availability and EV charging speeds before I even arrive at the garage.
              </p>
              <div className="vl-reviewer-row">
                <img className="vl-reviewer-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Sarah Jenkins" />
                <div className="vl-reviewer-info">
                  <span className="vl-reviewer-name">Sarah Jenkins</span>
                  <span className="vl-reviewer-stars">★★★★★</span>
                </div>
              </div>
            </div>

            <div className="vl-testimonial-card">
              <div className="vl-quote-icon-bubble">“</div>
              <p className="vl-quote-text">
                Managing municipal fleet parking across 3 downtown hubs was chaotic until we integrated Velox. Real-time telemetry saves us thousands monthly.
              </p>
              <div className="vl-reviewer-row">
                <img className="vl-reviewer-avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="David Kumar" />
                <div className="vl-reviewer-info">
                  <span className="vl-reviewer-name">David Kumar</span>
                  <span className="vl-reviewer-stars">★★★★★</span>
                </div>
              </div>
            </div>

            <div className="vl-testimonial-card">
              <div className="vl-quote-icon-bubble">“</div>
              <p className="vl-quote-text">
                The accuracy is 99.8% true to life. Highly structured data, Google Maps integration, and automotive telematics make it the best in class.
              </p>
              <div className="vl-reviewer-row">
                <img className="vl-reviewer-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Elena Rostova" />
                <div className="vl-reviewer-info">
                  <span className="vl-reviewer-name">Elena Rostova</span>
                  <span className="vl-reviewer-stars">★★★★★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. SECTION: BE PART OF THE FUTURE PARKING ERA NOW (CTA BANNER) ─── */}
      <section className="vl-cta-banner-section">
        <div className="velox-container">
          <div className="vl-cta-banner-card">
            <div>
              <h2 className="vl-cta-banner-headline">
                Be part of the future<br />parking era now
              </h2>
              <p className="vl-cta-banner-sub">
                Download the VeloxPark mobile app today and experience effortless, guaranteed parking wherever you drive.
              </p>
              <div className="vl-cta-banner-buttons">
                <button className="vl-banner-store-btn" onClick={() => navigate('/login')}>
                  <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.74-.86 2.76 1 .08 2.02-.51 2.57-1.26z"/></svg>
                  <span>App Store</span>
                </button>
                <button className="vl-banner-store-btn" onClick={() => navigate('/login')}>
                  <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.5 1.5 0 0 1-.61-.954V2.768c0-.395.23-.746.609-.954zm11.242 11.244l2.58 2.58-12.33 7.12 9.75-9.7zm0-2.116L5.1 1.242l12.33 7.12-2.58 2.58zm1.06 1.058l3.47-2.003a1.5 1.5 0 0 1 0 2.602l-3.47 2.003-1.41-1.41 1.41-1.192z"/></svg>
                  <span>Google Play</span>
                </button>
              </div>
            </div>

            {/* Tilted Phone Mockup */}
            <div className="vl-cta-phone-wrapper">
              <div className="vl-cta-tilted-phone">
                <div className="vl-iphone-island" style={{ top: '8px', height: '18px', width: '70px' }}></div>
                <div className="vl-iphone-screen" style={{ padding: '34px 12px 12px', background: '#0F172A' }}>
                  <div style={{ color: '#FFF', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>Live Navigation</div>
                  <div style={{ height: '180px', background: '#1E293B', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
                    <div className="vl-radar-pulse" style={{ width: '60px', height: '60px' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '6px 10px', borderRadius: '8px', color: 'var(--velox-gold)', fontSize: '10px', fontWeight: 700 }}>
                      Approaching Spot #42 • 50m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. PRESERVED CONTACT US SECTION ─── */}
      <section id="contact" className="contact-full-section">
        <div className="contact-full-container">
          {/* Left Column: VeloxPark Details & Header */}
          <div className="contact-full-left">
            <div className="contact-full-badge">
              <div className="badge-mail-circle">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <span>VELOXPARK OS</span>
            </div>

            <h2 className="contact-full-headline">
              CONTACT US
            </h2>

            <p className="contact-full-subtext">
              Ready to connect your site to the VeloxPark mobility network, deploy autonomous parking nodes, or need driver assistance? Fill out the form or reach out directly to our central operations desk.
            </p>

            <div className="contact-info-matrix">
              <div className="contact-matrix-row">
                <div className="contact-matrix-item">
                  <div className="contact-circle-icon">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div className="contact-matrix-text">
                    <span className="contact-matrix-label">DIRECT HOTLINE</span>
                    <span className="contact-matrix-val">+91 (080) 4123-8900</span>
                  </div>
                </div>

                <div className="contact-matrix-item">
                  <div className="contact-circle-icon">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="contact-matrix-text">
                    <span className="contact-matrix-label">OPERATIONS HUB</span>
                    <span className="contact-matrix-val">Cluster 01 / India & Global</span>
                  </div>
                </div>
              </div>

              <div className="contact-matrix-row">
                <div className="contact-matrix-item">
                  <div className="contact-circle-icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="contact-matrix-text">
                    <span className="contact-matrix-label">PRIMARY INBOX</span>
                    <a href="mailto:supportproject1100@gmail.com" className="contact-email-anchor">
                      supportproject1100@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-matrix-item">
                  <div className="contact-circle-icon">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                  <div className="contact-matrix-text">
                    <span className="contact-matrix-label">SLA RESPONSE</span>
                    <span className="contact-matrix-val">&lt; 15 Minutes Average</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full-Size Yellow Card Form */}
          <div className="contact-full-right">
            <div className="contact-yellow-card">
              {formStatus === 'success' ? (
                <div className="yellow-success-panel">
                  <div className="yellow-success-icon">
                    <span className="material-symbols-outlined">check</span>
                  </div>
                  <h3>Transmission Delivered</h3>
                  <p>
                    Your message has been dispatched to <strong>supportproject1100@gmail.com</strong>.
                  </p>
                  <div className="yellow-ticket-badge">
                    DISPATCH REF: <span>{ticketId}</span>
                  </div>
                  <button
                    type="button"
                    className="yellow-reset-btn"
                    onClick={() => {
                      setFormStatus('idle');
                      setContactForm({ name: '', email: '', role: 'Driver Mobility & Navigation', message: '' });
                    }}
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form className="yellow-form" onSubmit={handleContactSubmit}>
                  <div className="yellow-field-group">
                    <label htmlFor="full-name">Your name</label>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="yellow-field-group">
                    <label htmlFor="full-email">Your Phone / Email</label>
                    <input
                      id="full-email"
                      type="email"
                      placeholder="Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="yellow-field-group">
                    <label htmlFor="full-service">Services</label>
                    <div className="yellow-select-wrapper">
                      <select
                        id="full-service"
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                      >
                        <option value="Driver Mobility & Navigation">Driver Mobility & Navigation</option>
                        <option value="Smart Node Infrastructure">Smart Node Infrastructure</option>
                        <option value="City Mobility Planning">City Mobility Planning</option>
                        <option value="Technical API & Enterprise">Technical API & Enterprise</option>
                      </select>
                      <span className="material-symbols-outlined yellow-arrow-icon">expand_more</span>
                    </div>
                  </div>

                  <div className="yellow-field-group">
                    <label htmlFor="full-message">Message</label>
                    <textarea
                      id="full-message"
                      rows="3"
                      placeholder="Write your message here..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="yellow-submit-btn"
                    disabled={formStatus === 'sending'}
                  >
                    <div className="yellow-submit-circle">
                      <span className="material-symbols-outlined yellow-plane-icon">send</span>
                    </div>
                    <span>{formStatus === 'sending' ? 'Sending...' : 'Submit'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. PRESERVED SITE FOOTER ─── */}
      <footer className="site-footer" id="footer">
        <div className="footer-feature">
          <img src={networkAccessBannerImg} alt="Connected urban mobility network" />
          <div className="footer-feature-overlay"></div>
          <div className="footer-feature-content">
            <div className="section-badge">NETWORK ACCESS</div>
            <h2>Parking that<br /><span>moves with you.</span></h2>
            <p>Find your space, connect your site, and keep every journey moving.</p>
          </div>
        </div>
        <div className="footer-main">
          <div className="footer-grid">
            <div className="footer-brand-block">
              <div className="footer-brand"><img src="/brand/digital/veloxpark-app-icon.svg" alt="" />VELOX<span>.</span>PARK</div>
              <p className="footer-tagline">The operating system for smarter urban parking. Built for drivers, operators, and the cities they share.</p>
              <button className="footer-connect" onClick={() => navigate('/login')}>ACCESS PORTAL ↗</button>
            </div>
            <div className="footer-column">
              <div className="footer-col-title">Network</div>
              <ul className="footer-links">
                <li><button onClick={() => scrollToSection('features')}>Core Systems</button></li>
                <li><button onClick={() => scrollToSection('live-map')}>Live Grid Map</button></li>
                <li><button onClick={() => scrollToSection('about')}>Network Scale</button></li>
                <li><button onClick={() => scrollToSection('features')}>How It Works</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <div className="footer-col-title">Access</div>
              <ul className="footer-links">
                <li><button onClick={() => navigate('/login')}>Driver Portal</button></li>
                <li><button onClick={() => navigate('/login')}>Operator Portal</button></li>
                <li><button onClick={() => navigate('/login')}>City Systems</button></li>
                <li><button onClick={() => scrollToSection('contact')}>Contact Operations</button></li>
              </ul>
            </div>
            <div className="footer-column footer-status">
              <div className="footer-col-title">Live Status</div>
              <p><span className="status-dot"></span> All systems operational</p>
              <p>Cluster: 01 / India</p>
              <p>Protocol: VP-4.0</p>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 VELOXPARK URBAN MOBILITY CORP. ALL RIGHTS RESERVED.</div>
            <div className="footer-legal">
              <a href="#">Privacy Protocol</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">VELOXPARK<span>.</span></div>
      </footer>
    </div>
  );
};

export default Home;
