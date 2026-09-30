import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nodeNetworkImg from '../assets/smart-node-network.jpg';
import networkAccessBannerImg from '../assets/network-access-banner.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', role: 'Driver Portal', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success'
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const quickPresets = [
    { label: 'Spot Reservation Issue', role: 'Driver Portal', text: 'Reporting a space allocation or navigation issue in zone: ' },
    { label: 'Node Hardware Onboarding', role: 'Node Operator', text: 'Inquiring about deploying VeloxPark node sensors at our parking facility in: ' },
    { label: 'City Traffic Grid Sync', role: 'City Mobility', text: 'Requesting mobility telemetry integration and macro traffic analytics for municipal transit.' },
    { label: 'API & Developer Access', role: 'General Support', text: 'Requesting SDK credentials and LiDAR calibration documentation for: ' }
  ];

  const applyPreset = (preset) => {
    setContactForm(prev => ({
      ...prev,
      role: preset.role,
      message: preset.text
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

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
        // Fallback open mail client
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
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Stats Counter Animation
    function animateCounter(el, target, suffix = '') {
      let start = 0;
      const duration = 1800;
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = isDecimal
          ? (start + (target - start) * ease).toFixed(1)
          : Math.round(start + (target - start) * ease);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const nums = e.target.querySelectorAll('.stat-num');
          const targets = [250, 1.2, 99];
          nums.forEach((n, i) => {
            const span = n.querySelector('.stat-unit');
            const spanHTML = span ? span.outerHTML : '';
            n.innerHTML = '';
            const textNode = document.createElement('span');
            n.appendChild(textNode);
            if (spanHTML) n.insertAdjacentHTML('beforeend', spanHTML);
            animateCounter(textNode, targets[i]);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav-wrapper">
        <div className="nav-inner">
          <div className="nav-logo">VELOX<span>.</span>PARK</div>

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
            <li><button onClick={() => scrollToSection('node-network')}>Nodes</button></li>
            <li><button onClick={() => scrollToSection('features')}>Core</button></li>
            <li><button onClick={() => scrollToSection('stats')}>Scale</button></li>
          </ul>
          <button className="btn-connect" onClick={() => scrollToSection('contact')}>CONTACT</button>
        </div>

        <div className={`nav-mobile ${mobileMenuOpen ? 'is-open' : ''}`}>
          <button onClick={() => { scrollToSection('node-network'); setMobileMenuOpen(false); }}>
            Nodes
          </button>
          <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }}>
            Core
          </button>
          <button onClick={() => { scrollToSection('stats'); setMobileMenuOpen(false); }}>
            Scale
          </button>
          <button className="btn-connect nav-mobile-cta" onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}>CONTACT</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%), url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80') center/cover no-repeat" }}></div>
        <div className="hero-blinds"></div>
        <div className="hero-content">
          <div className="hero-badge">V4.0 PROTOCOL ACTIVE</div>
          <h1 className="hero-title">
            VELOX<br />
            <span className="yellow">PARK</span>
          </h1>
          <p className="hero-subtitle">
            Architecting the future of urban density.<br />
            Autonomous routing, predictive space<br />
            allocation, and real-time kinetic mapping.
          </p>
          <div className="hero-cta">
            <button className="btn-get-started" onClick={() => navigate('/login')}>
              GET STARTED
            </button>
            <div className="hero-scroll" onClick={() => scrollToSection('features')}>
              <div className="scroll-arrow">↓</div>
              INITIALIZE SYSTEM ACCESS
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / FEATURE SHARDS */}
      <section id="features" className="features-shards-section">
        <div className="shards-container">
          {/* Shard 1: Real-time Analytics */}
          <div className="shard-card shard-1 fade-up">
            <div className="shard-border">
              <div className="shard-inner">
                <div className="shard-num">01</div>
                <div className="shard-content">
                  <h3 className="shard-title">REAL-TIME<br />ANALYTICS</h3>
                  <p className="shard-desc">
                    Live telemetry from over 50,000 nodes,<br className="hidden-sm" />
                    processed via edge computing for millisecond<br className="hidden-sm" />
                    latency in routing.
                  </p>
                  <div className="shard-action">
                    <span className="shard-line"></span>
                    <button className="shard-link" onClick={() => scrollToSection('node-network')}>ACCESS MODULE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shard 2: Kinetic Mapping */}
          <div className="shard-card shard-2 fade-up">
            <div className="shard-border">
              <div className="shard-inner">
                <div className="shard-num shard-num-left">02</div>
                <div className="shard-content align-right">
                  <h3 className="shard-title">KINETIC<br />MAPPING</h3>
                  <p className="shard-desc">
                    3D spatial awareness for autonomous vehicles.<br className="hidden-sm" />
                    Seamless integration with LiDAR and computer<br className="hidden-sm" />
                    vision protocols.
                  </p>
                  <div className="shard-action justify-end">
                    <button className="shard-link" onClick={() => scrollToSection('node-network')}>VIEW ATLAS</button>
                    <span className="shard-line"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats">
        <div className="stats-header fade-up">
          <div className="stats-title">SCALE OF<br />OPERATIONS</div>
          <div className="network-health">
            <div className="health-label">NETWORK HEALTH: OPTIMAL</div>
            <div className="health-bar"></div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item fade-up">
            <div className="stat-num">250</div>
            <div className="stat-label">CITIES CONNECTED</div>
          </div>
          <div className="stat-item fade-up" style={{ paddingLeft: '40px' }}>
            <div className="stat-num">1.2<span className="stat-unit">M+</span></div>
            <div className="stat-label">SESSIONS / DAY</div>
          </div>
          <div className="stat-item fade-up" style={{ paddingLeft: '40px' }}>
            <div className="stat-num">99</div>
            <div className="stat-label">% EFFICIENCY GAIN</div>
          </div>
        </div>
      </section>

      {/* NODE NETWORK */}
      <section id="node-network">
        <div className="node-img">
          <img src={nodeNetworkImg} alt="Smart Parking Infrastructure" />
          <div className="node-img-label">NODE_STATUS: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>ACTIVE</span></div>
        </div>
        <div className="node-content fade-up">
          <h2 className="node-title">DECENTRALIZED<br />NODE NETWORK</h2>
          <p className="node-desc">Our hardware agnostic layer allows any existing infrastructure to be converted into a smart node within 48 hours. Enterprise-grade security meets consumer-grade simplicity.</p>
          <ul className="node-features">
            <li>
              <div className="feat-icon">⊕</div>
              QUANTUM ENCRYPTION
            </li>
            <li>
              <div className="feat-icon">⊕</div>
              EV-CHARGING GRID SYNC
            </li>
            <li>
              <div className="feat-icon">⊕</div>
              DYNAMIC PRICING ENGINE
            </li>
          </ul>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles">
        <div className="roles-header fade-up">
          <div className="section-badge">ACCESS THE NETWORK</div>
          <h2 className="roles-title">WHO ARE<br />YOU?</h2>
        </div>
        <div className="roles-grid">
          <div className="role-card fade-up">
            <div className="role-num">01 / DRIVER</div>
            <div className="role-icon">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div className="role-name">Driver</div>
            <p className="role-desc">Find, reserve, and navigate to available parking spots in real-time. Never circle the block again.</p>
            <button className="role-cta" onClick={() => navigate('/login')}>ACCESS PORTAL</button>
          </div>
          <div className="role-card fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="role-num">02 / OPERATOR</div>
            <div className="role-icon">
              <span className="material-symbols-outlined">business</span>
            </div>
            <div className="role-name">Operator</div>
            <p className="role-desc">Manage your parking assets, optimize occupancy rates, and unlock new revenue streams with predictive analytics.</p>
            <button className="role-cta" onClick={() => navigate('/login')}>ACCESS PORTAL</button>
          </div>
          <div className="role-card fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="role-num">03 / CITY</div>
            <div className="role-icon">
              <span className="material-symbols-outlined">local_police</span>
            </div>
            <div className="role-name">City Planner</div>
            <p className="role-desc">Deploy city-wide smart infrastructure, reduce congestion, and gain macro-level urban mobility intelligence.</p>
            <button className="role-cta" onClick={() => navigate('/login')}>ACCESS PORTAL</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="how-header fade-up">
          <div className="section-badge">WORKFLOW</div>
          <h2 className="how-title">HOW IT<br />WORKS</h2>
        </div>
        <div className="steps-grid">
          <div className="step-card fade-up">
            <div className="step-line"></div>
            <div className="step-num">01</div>
            <div className="step-title">Connect Node</div>
            <p className="step-desc">Install the VeloxPark hardware module or integrate via API with your existing systems.</p>
          </div>
          <div className="step-card fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="step-line"></div>
            <div className="step-num">02</div>
            <div className="step-title">Map Space</div>
            <p className="step-desc">LiDAR sensors automatically map and calibrate your parking topology within minutes.</p>
          </div>
          <div className="step-card fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="step-line"></div>
            <div className="step-num">03</div>
            <div className="step-title">Go Live</div>
            <p className="step-desc">Real-time data streams to the network — drivers can find and reserve your spaces instantly.</p>
          </div>
          <div className="step-card fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="step-line"></div>
            <div className="step-num">04</div>
            <div className="step-title">Optimize</div>
            <p className="step-desc">AI continuously learns usage patterns, pricing, and routing to maximize efficiency and revenue.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact-full-section">
        <div className="contact-full-container">
          {/* Left Column: VeloxPark Details & Header */}
          <div className="contact-full-left fade-up">
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
          <div className="contact-full-right fade-up">
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
                      setContactForm({ name: '', email: '', role: 'Select a service', message: '' });
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
                        <option value="Select a service">Select a service</option>
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

      {/* FOOTER */}
      <footer className="site-footer" id="footer">
        <div className="footer-feature">
          <img src={networkAccessBannerImg} alt="Connected urban mobility network" />
          <div className="footer-feature-overlay"></div>
          <div className="footer-feature-content fade-up">
            <div className="section-badge">NETWORK ACCESS</div>
            <h2>Parking that<br /><span>moves with you.</span></h2>
            <p>Find your space, connect your site, and keep every journey moving.</p>
          </div>
        </div>
        <div className="footer-main">
          <div className="footer-grid">
            <div className="footer-brand-block fade-up">
              <div className="footer-brand">VELOX<span>.</span>PARK</div>
              <p className="footer-tagline">The operating system for smarter urban parking. Built for drivers, operators, and the cities they share.</p>
              <button className="footer-connect" onClick={() => navigate('/login')}>ACCESS PORTAL <span>↗</span></button>
            </div>
            <div className="footer-column fade-up">
              <div className="footer-col-title">Network</div>
              <ul className="footer-links">
                <li><button onClick={() => scrollToSection('node-network')}>Node Network</button></li>
                <li><button onClick={() => scrollToSection('features')}>Core Systems</button></li>
                <li><button onClick={() => scrollToSection('stats')}>Network Scale</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
              </ul>
            </div>
            <div className="footer-column fade-up">
              <div className="footer-col-title">Access</div>
              <ul className="footer-links">
                <li><button onClick={() => navigate('/login')}>Driver Portal</button></li>
                <li><button onClick={() => navigate('/login')}>Operator Portal</button></li>
                <li><button onClick={() => navigate('/login')}>City Systems</button></li>
                <li><button onClick={() => scrollToSection('contact')}>Contact Operations</button></li>
              </ul>
            </div>
            <div className="footer-column footer-status fade-up">
              <div className="footer-col-title">Live Status</div>
              <p><span className="status-dot"></span> All systems operational</p>
              <p>Cluster: 01 / India</p>
              <p>Protocol: VP-4.0</p>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 VELOXPARK URBAN MOBILITY CORP. ALL RIGHTS RESERVED.</div>
            <div className="footer-legal"><a href="#">Privacy Protocol</a><a href="#">Terms of Service</a><a href="#">Security</a></div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">VELOXPARK<span>.</span></div>
      </footer>
    </>
  );
};

export default Home;

