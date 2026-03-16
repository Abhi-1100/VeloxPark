import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelect from './RoleSelect';

import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll animation for counters
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseFloat(target.getAttribute('data-target'));
          let current = 0;
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = countTo / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= countTo) {
              target.innerText = countTo;
              clearInterval(timer);
            } else {
              target.innerText = current.toFixed(countTo % 1 === 0 ? 0 : 1);
            }
          }, stepTime);
          
          counterObserver.unobserve(target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.counter-value').forEach(counter => {
      counterObserver.observe(counter);
    });

    return () => counterObserver.disconnect();
  }, []);

  return (
    <div className="font-sans" style={{ backgroundColor: '#0a0a0b', color: '#ffffff', overflowX: 'hidden' }}>

      {/* BEGIN: Hero Section */}
      <section className="relative h-screen w-full flex items-center overflow-hidden" data-purpose="hero-section">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Futuristic Parking Structure"
            className="w-full h-full object-cover opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0uEMLD0Zx8HSC-rh75Mjyu5C_UP8JCnikEWzzJootuA6F-qGTlFplUzfbxPZ9m2NEeQx9MQ1i-WoF32UmZGPMmiMZ4UbXZJUKeFAGMVpi-BP9QBYkOETu1hIzVtA3tBM2YLnd6S7_B2VkdkRyCY99qcmHOK6ygTixb36dEw2fZkyqBXPhEzzm4NfBvNj4QORYhIvWHEYxTIIq3z5abI8bVKlpfzXlGnRANb10tI34nIPmlT7C8lvgeMVjxRSbr4t5K0tWxfRtaGc"
          />
          <div className="absolute inset-0 hero-bg-overlay"></div>
        </div>
        {/* Oversized Vertical Typography */}
        <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <h1
            className="vertical-text font-bold text-transparent select-none"
            style={{ fontSize: '12rem', WebkitTextStroke: '2px rgba(255,255,255,0.2)', opacity: 0.1 }}
          >
            MOBILITY
          </h1>
        </div>
        <div className="container mx-auto px-6 relative z-20 grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-start-4 lg:col-span-8">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-12 gap-6 w-full pt-4 md:pt-8">
              <div
                className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest self-start"
                style={{ border: '1px solid rgba(250,204,21,0.3)', backgroundColor: 'rgba(250,204,21,0.05)', color: '#facc15' }}
              >
                v4.0 Protocol Active
              </div>

              {/* BEGIN: Embedded Navigation Pill */}
              <nav className="glass-panel px-6 py-2 rounded-full flex items-center gap-8 shadow-2xl self-start border border-white/5" style={{ backgroundColor: '#141417' }}>
                <a className="font-bold tracking-tighter text-xl" href="#" style={{ color: '#facc15' }}>S.PARK</a>
                <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-bold text-gray-300">
                  <a className="hover:text-white transition-colors" href="#nodes">Nodes</a>
                  <a className="hover:text-white transition-colors" href="#shards">Core</a>
                  <a className="hover:text-white transition-colors" href="#stats">Scale</a>
                </div>
                <button className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight hover:bg-yellow-400 transition-all flex-shrink-0"
                  onClick={() => scrollToSection('roles')}
                  style={{ backgroundColor: '#facc15', color: '#000' }}>
                  Connect OS
                </button>
              </nav>
              {/* END: Embedded Navigation Pill */}
            </div>
            <h2 className="text-6xl md:text-9xl font-bold leading-none mb-8">
              SMART<br/><span style={{ color: '#facc15' }}>PARK</span>
            </h2>
            <p className="max-w-md text-gray-400 text-lg md:text-xl leading-relaxed mb-12 border-l-2 pl-6" style={{ borderColor: '#facc15' }}>
              Architecting the future of urban density. Autonomous routing, predictive space allocation, and real-time kinetic mapping.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/select')}
                className="px-8 py-4 text-xs font-bold uppercase tracking-widest transition-transform duration-300 hover:translate-x-1 hover:scale-105"
                style={{
                  backgroundColor: '#facc15',
                  color: '#000',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                GET STARTED
              </button>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6" style={{ color: '#facc15' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('shards')}
                className="uppercase self-center opacity-50 hover:opacity-90 transition-opacity"
                style={{ fontSize: '10px', letterSpacing: '0.4em' }}
              >
                Initialize System Access
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Feature Shards */}
      <section className="py-32 relative" data-purpose="feature-shards" id="shards" style={{ backgroundColor: '#0a0a0b' }}>
        <div className="container mx-auto px-6">
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Shard 1: Real-time Analytics */}
            <div className="md:col-span-7 glass-panel shard-right p-12 md:p-20 mb-12 md:mb-0 transform hover:-translate-y-2 transition-transform duration-500 relative z-10 group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="text-5xl font-bold" style={{ color: '#facc15' }}>01</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Real-time<br/>Analytics</h3>
              <p className="text-gray-400 max-w-sm mb-8">
                Live telemetry from over 50,000 nodes, processed via edge computing for millisecond latency in routing.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-20" style={{ backgroundColor: '#facc15' }}></div>
                <a className="text-xs font-bold uppercase tracking-widest hover:text-yellow-400 transition-colors" href="#">Access Module</a>
              </div>
            </div>
            {/* Shard 2: Kinetic Mapping (Overlapping) */}
            <div className="md:col-start-6 md:col-span-7 md:-mt-20 glass-panel shard-left p-12 md:p-20 transform hover:translate-x-2 transition-transform duration-500 relative z-20 group" style={{ backgroundColor: 'rgba(20,20,23,0.8)' }}>
              <div className="absolute top-0 left-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="text-5xl font-bold" style={{ color: '#facc15' }}>02</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <h3 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Kinetic<br/>Mapping</h3>
                <p className="text-gray-400 max-w-sm mb-8">
                  3D spatial awareness for autonomous vehicles. Seamless integration with LIDAR and computer vision protocols.
                </p>
                <div className="flex items-center gap-4">
                  <a className="text-xs font-bold uppercase tracking-widest hover:text-yellow-400 transition-colors" href="#">View Atlas</a>
                  <div className="h-px w-20" style={{ backgroundColor: '#facc15' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Feature Shards */}

      {/* BEGIN: Scale of Operations */}
      <section className="py-32 border-y border-white/5 overflow-hidden" data-purpose="scale-section" id="stats" style={{ backgroundColor: '#141417' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none italic">Scale of<br/>Operations</h2>
            <div className="text-right">
              <p className="font-bold text-sm tracking-widest uppercase mb-2" style={{ color: '#facc15' }}>Network Health: Optimal</p>
              <div className="flex gap-1">
                <div className="w-12 h-1" style={{ backgroundColor: '#facc15' }}></div>
                <div className="w-12 h-1" style={{ backgroundColor: '#facc15' }}></div>
                <div className="w-12 h-1" style={{ backgroundColor: 'rgba(250,204,21,0.2)' }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Counter 1 */}
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="250">0</div>
              <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#facc15' }}>Cities Connected</p>
              <div className="absolute -bottom-4 left-0 w-full h-px bg-white/10"></div>
            </div>
            {/* Counter 2 */}
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="1.2">0</div>
              <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#facc15' }}>M+ Sessions / Day</p>
              <div className="absolute -bottom-4 left-0 w-full h-px bg-white/10"></div>
            </div>
            {/* Counter 3 */}
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="99">0</div>
              <p className="text-sm uppercase tracking-widest font-bold" style={{ color: '#facc15' }}>% Efficiency Gain</p>
              <div className="absolute -bottom-4 left-0 w-full h-px bg-white/10"></div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Scale of Operations */}

      {/* BEGIN: Nodes Section */}
      <section className="py-32" data-purpose="nodes-display" id="nodes" style={{ backgroundColor: '#0a0a0b' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l z-0" style={{ borderColor: 'rgba(250,204,21,0.4)' }}></div>
              <img
                alt="High-tech Parking Hub"
                className="grayscale hover:grayscale-0 transition-all duration-700 relative z-10 w-full rounded-sm shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaLFeZNnE6fP9Ime_H9waohSEIMS9URK6bzp3-EpPfrlithY0G00iK4Lc_9c2PWhbdUOeMJSuQvaCErg1N2Kl0WNgdo8JMgAK5kBLmP9DejIZ4CXayp46OHvoYMVw8IA09yXf76jee44-ghwDN1xUyKIZkSS4iVlMI8IdPOeOEfNJyk5JRe7NWFBHPRvvLz2ZM1ATJc5ukYg7dXvu25XR7H_VNwr_nwuqDjsRaMptO5M2OVD-Pd2d5Woq1I4Sr35HvvHe-qf7rMHY"
              />
              <div className="absolute -bottom-6 -right-6 p-6 glass-panel z-20">
                <p className="text-xs uppercase tracking-tighter">Node_Status: <span className="text-green-500">Active</span></p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-5xl font-bold uppercase mb-8 leading-tight">Decentralized<br/>Node Network</h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Our hardware agnostic layer allows any existing infrastructure to be converted into a smart node within 48 hours. Enterprise-grade security meets consumer-grade simplicity.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group">
                  <span className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:text-black transition-all"
                    style={{ borderColor: 'rgba(250,204,21,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#facc15'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >→</span>
                  Quantum Encryption
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group">
                  <span className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:text-black transition-all"
                    style={{ borderColor: 'rgba(250,204,21,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#facc15'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >→</span>
                  EV-Charging Grid Sync
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group">
                  <span className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:text-black transition-all"
                    style={{ borderColor: 'rgba(250,204,21,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#facc15'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >→</span>
                  Dynamic Pricing Engine
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* END: Nodes Section */}

      {/* BEGIN: Roles Section */}
      <section className="py-28 border-t border-white/5" data-purpose="roles-section" id="roles" style={{ backgroundColor: '#0a0a0b' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 text-xs uppercase tracking-widest mb-4"
              style={{ border: '1px solid #facc15', color: '#facc15' }}>
              Select Your Role
            </div>
            <h2 className="text-5xl md:text-7xl font-bold uppercase italic leading-none">Who Are<br />You?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <article className="role-card p-10" style={{ backgroundColor: '#111' }}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">01 / Driver</p>
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-xl mb-4"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                🚗
              </div>
              <h3 className="text-3xl font-bold uppercase mb-4">Driver</h3>
              <p className="text-gray-400 mb-8">Find, reserve, and navigate to available parking spots in real-time. Never circle the block again.</p>
              <button
                type="button"
                onClick={() => scrollToSection('workflow')}
                className="px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 hover:text-black"
                style={{ border: '1px solid #facc15', color: '#facc15' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#facc15'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Access Portal
              </button>
            </article>

            <article className="role-card p-10" style={{ backgroundColor: '#111' }}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">02 / Operator</p>
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-xl mb-4"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                🏢
              </div>
              <h3 className="text-3xl font-bold uppercase mb-4">Operator</h3>
              <p className="text-gray-400 mb-8">Manage your parking assets, optimize occupancy rates, and unlock revenue using predictive analytics.</p>
              <button
                type="button"
                onClick={() => scrollToSection('workflow')}
                className="px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 hover:text-black"
                style={{ border: '1px solid #facc15', color: '#facc15' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#facc15'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Access Portal
              </button>
            </article>

            <article className="role-card p-10" style={{ backgroundColor: '#111' }}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">03 / City Planner</p>
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-xl mb-4"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                🏙️
              </div>
              <h3 className="text-3xl font-bold uppercase mb-4">City Planner</h3>
              <p className="text-gray-400 mb-8">Deploy city-scale infrastructure, reduce congestion, and gain macro-level urban mobility intelligence.</p>
              <button
                type="button"
                onClick={() => scrollToSection('workflow')}
                className="px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 hover:text-black"
                style={{ border: '1px solid #facc15', color: '#facc15' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#facc15'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Access Portal
              </button>
            </article>
          </div>
        </div>
      </section>
      {/* END: Roles Section */}

      {/* BEGIN: How It Works */}
      <section className="py-28 border-t border-white/5" data-purpose="workflow-section" id="workflow" style={{ backgroundColor: '#141417' }}>
        <div className="container mx-auto px-6">
          <div className="mb-14">
            <div className="inline-block px-4 py-1.5 text-xs uppercase tracking-widest mb-4"
              style={{ border: '1px solid #facc15', color: '#facc15' }}>
              Workflow
            </div>
            <h2 className="text-5xl md:text-7xl font-bold uppercase italic leading-none">How It<br />Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <article className="p-8" style={{ backgroundColor: '#0a0a0b' }}>
              <p className="text-6xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.08)' }}>01</p>
              <h3 className="text-lg font-bold uppercase mb-3" style={{ color: '#facc15' }}>Connect Node</h3>
              <p className="text-sm text-gray-400">Install SmartPark hardware module or integrate by API with your existing systems.</p>
            </article>
            <article className="p-8" style={{ backgroundColor: '#0a0a0b' }}>
              <p className="text-6xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.08)' }}>02</p>
              <h3 className="text-lg font-bold uppercase mb-3" style={{ color: '#facc15' }}>Map Space</h3>
              <p className="text-sm text-gray-400">LiDAR sensors map and calibrate your parking topology in minutes.</p>
            </article>
            <article className="p-8" style={{ backgroundColor: '#0a0a0b' }}>
              <p className="text-6xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.08)' }}>03</p>
              <h3 className="text-lg font-bold uppercase mb-3" style={{ color: '#facc15' }}>Go Live</h3>
              <p className="text-sm text-gray-400">Drivers discover and reserve spaces instantly with real-time network updates.</p>
            </article>
            <article className="p-8" style={{ backgroundColor: '#0a0a0b' }}>
              <p className="text-6xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.08)' }}>04</p>
              <h3 className="text-lg font-bold uppercase mb-3" style={{ color: '#facc15' }}>Optimize</h3>
              <p className="text-sm text-gray-400">AI learns behavior patterns for better pricing, routing, and occupancy.</p>
            </article>
          </div>
        </div>
      </section>
      {/* END: How It Works */}

      {/* BEGIN: Footer */}
      <footer className="py-20 border-t border-white/10" data-purpose="main-footer" style={{ backgroundColor: '#000' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#facc15' }}>SMARTPARK.OS</h3>
              <p className="text-gray-500 max-w-sm">The operating system for the next billion urban transitions. Built for cities, scaled for humanity.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white mb-6" style={{ letterSpacing: '0.3em' }}>System</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a className="hover:text-yellow-400" href="#">API Docs</a></li>
                <li><a className="hover:text-yellow-400" href="#">Infrastructure</a></li>
                <li><a className="hover:text-yellow-400" href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white mb-6" style={{ letterSpacing: '0.3em' }}>Legal</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a className="hover:text-yellow-400" href="#">Privacy Protocol</a></li>
                <li><a className="hover:text-yellow-400" href="#">Terms of Service</a></li>
                <li><a className="hover:text-yellow-400" href="#">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
            <p className="uppercase text-gray-600" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>© 2024 SmartPark Urban Mobility Corp. All Rights Reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#facc15' }}></span>
              <p className="uppercase text-gray-600" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Server: London_Cluster_01</p>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
};

export default Home;
