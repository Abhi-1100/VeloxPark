import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <button className="btn-connect" onClick={() => navigate('/select')}>CONNECT OS</button>
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
          <button className="btn-connect nav-mobile-cta" onClick={() => { navigate('/select'); setMobileMenuOpen(false); }}>
            CONNECT OS
          </button>
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
            <button className="btn-get-started" onClick={() => navigate('/select')}>
              GET STARTED
            </button>
            <div className="hero-scroll" onClick={() => scrollToSection('features')}>
              <div className="scroll-arrow">↓</div>
              INITIALIZE SYSTEM ACCESS
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="feature-block">
          <div className="feature-left fade-up">
            <span className="feature-num">01</span>
            <h2 className="feature-title">REAL-TIME<br />ANALYTICS</h2>
            <p className="feature-desc">Live telemetry from over 50,000 nodes, processed via edge computing for millisecond latency in routing.</p>
            <a className="feature-link">ACCESS MODULE</a>
          </div>
          <div style={{ background: 'var(--dark3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#111 0%,#1a1a1a 100%)' }}></div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ opacity: 0.15 }}>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#F5C518" strokeWidth="1" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="#F5C518" strokeWidth="0.5" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="#F5C518" strokeWidth="0.5" />
                <line x1="100" y1="20" x2="100" y2="180" stroke="#F5C518" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="4" fill="#F5C518" />
                <circle cx="140" cy="70" r="3" fill="#F5C518" style={{ opacity: 0.6 }} />
                <circle cx="65" cy="130" r="3" fill="#F5C518" style={{ opacity: 0.6 }} />
                <line x1="100" y1="100" x2="140" y2="70" stroke="#F5C518" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="65" y2="130" stroke="#F5C518" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="feature-block">
          <div style={{ background: 'var(--dark4)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="220" height="180" viewBox="0 0 220 180" style={{ opacity: 0.12 }}>
                <rect x="10" y="10" width="200" height="160" fill="none" stroke="#F5C518" strokeWidth="1" />
                <rect x="30" y="30" width="60" height="50" fill="none" stroke="#F5C518" strokeWidth="0.5" />
                <rect x="130" y="30" width="60" height="50" fill="none" stroke="#F5C518" strokeWidth="0.5" />
                <rect x="80" y="100" width="60" height="50" fill="none" stroke="#F5C518" strokeWidth="0.5" />
                <line x1="60" y1="80" x2="110" y2="100" stroke="#F5C518" strokeWidth="0.5" />
                <line x1="160" y1="80" x2="110" y2="100" stroke="#F5C518" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
          <div className="feature-right fade-up">
            <span className="feature-num">02</span>
            <h2 className="feature-title">KINETIC<br />MAPPING</h2>
            <p className="feature-desc">3D spatial awareness for autonomous vehicles. Seamless integration with LiDAR and computer vision protocols.</p>
            <a className="feature-link">VIEW ATLAS</a>
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
          <img src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80" alt="Smart Parking Infrastructure" />
          <div className="node-img-label">NODE_STATUS: ACTIVE</div>
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
          <div className="section-badge">SELECT YOUR ROLE</div>
          <h2 className="roles-title">WHO ARE<br />YOU?</h2>
        </div>
        <div className="roles-grid">
          <div className="role-card fade-up">
            <div className="role-num">01 / DRIVER</div>
            <div className="role-icon">🚗</div>
            <div className="role-name">Driver</div>
            <p className="role-desc">Find, reserve, and navigate to available parking spots in real-time. Never circle the block again.</p>
            <button className="role-cta" onClick={() => navigate('/select')}>ACCESS PORTAL</button>
          </div>
          <div className="role-card fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="role-num">02 / OPERATOR</div>
            <div className="role-icon">🏢</div>
            <div className="role-name">Operator</div>
            <p className="role-desc">Manage your parking assets, optimize occupancy rates, and unlock new revenue streams with predictive analytics.</p>
            <button className="role-cta" onClick={() => navigate('/select')}>ACCESS PORTAL</button>
          </div>
          <div className="role-card fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="role-num">03 / CITY</div>
            <div className="role-icon">🏙️</div>
            <div className="role-name">City Planner</div>
            <p className="role-desc">Deploy city-wide smart infrastructure, reduce congestion, and gain macro-level urban mobility intelligence.</p>
            <button className="role-cta" onClick={() => navigate('/select')}>ACCESS PORTAL</button>
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

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">VELOXPARK.OS</div>
            <p className="footer-tagline">The operating system for the next billion urban transitions. Built for cities, scaled for humanity.</p>
          </div>
          <div>
            <div className="footer-col-title">System</div>
            <ul className="footer-links">
              <li><a href="#">API Docs</a></li>
              <li><a href="#">Infrastructure</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Privacy Protocol</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 VELOXPARK URBAN MOBILITY CORP. ALL RIGHTS RESERVED.</div>
          <div className="footer-system">SYSTEM: ONLINE / CLUSTER: 01</div>
        </div>
      </footer>
    </>
  );
};

export default Home;
