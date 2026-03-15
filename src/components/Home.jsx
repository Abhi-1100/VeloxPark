import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import './Home.css';

const Home = () => {
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
    <div className="font-sans bg-[#0a0a0b] text-white overflow-x-hidden min-h-screen" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* BEGIN: Floating Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] float-nav" data-purpose="floating-menu">
        <div className="glass-panel px-8 py-4 rounded-full flex items-center gap-8 shadow-2xl">
          <Link to="/" className="text-[#facc15] font-bold tracking-tighter text-xl">
            V.PARK
          </Link>
          <div className="hidden md:flex gap-6 text-sm uppercase tracking-widest font-medium">
            <a href="#nodes" className="hover:text-[#facc15] transition-colors">Nodes</a>
            <a href="#shards" className="hover:text-[#facc15] transition-colors">Core</a>
            <a href="#stats" className="hover:text-[#facc15] transition-colors">Scale</a>
          </div>
          <Link to="/select">
            <button className="bg-[#facc15] text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-white transition-all">
              Connect OS
            </button>
          </Link>
        </div>
      </nav>
      {/* END: Floating Navigation */}

      {/* BEGIN: Hero Section */}
      <section className="relative h-screen w-full flex items-center overflow-hidden" data-purpose="hero-section">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img alt="Futuristic Parking Structure" className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0uEMLD0Zx8HSC-rh75Mjyu5C_UP8JCnikEWzzJootuA6F-qGTlFplUzfbxPZ9m2NEeQx9MQ1i-WoF32UmZGPMmiMZ4UbXZJUKeFAGMVpi-BP9QBYkOETu1hIzVtA3tBM2YLnd6S7_B2VkdkRyCY99qcmHOK6ygTixb36dEw2fZkyqBXPhEzzm4NfBvNj4QORYhIvWHEYxTIIq3z5abI8bVKlpfzXlGnRANb10tI34nIPmlT7C8lvgeMVjxRSbr4t5K0tWxfRtaGc" />
          <div className="absolute inset-0 hero-bg-overlay"></div>
        </div>
        {/* Oversized Vertical Typography */}
        <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <h1 className="vertical-text text-8xl md:text-[12rem] font-bold text-transparent border-text stroke-white opacity-10 select-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>
            MOBILITY
          </h1>
        </div>
        <div className="container mx-auto px-6 relative z-20 grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-start-4 lg:col-span-8">
            <div className="inline-block px-3 py-1 border border-[#facc154d] bg-[#facc151a] text-[#facc15] text-xs mb-6 uppercase tracking-widest">
              v4.0 Protocol Active
            </div>
            <h2 className="text-6xl md:text-9xl font-bold leading-none mb-8">
              VELOX<br/><span className="text-[#facc15]">PARK</span>
            </h2>
            <p className="max-w-md text-gray-400 text-lg md:text-xl leading-relaxed mb-12 border-l-2 border-[#facc15] pl-6">
              Architecting the future of urban density. Autonomous routing, predictive space allocation, and real-time kinetic mapping.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-[#ffffff33] flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-[#facc15]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <span className="uppercase text-[10px] tracking-[0.4em] self-center opacity-50">Initialize System Scroll</span>
            </div>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Feature Shards */}
      <section className="py-32 relative bg-[#0a0a0b]" data-purpose="feature-shards" id="shards">
        <div className="container mx-auto px-6">
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Shard 1: Real-time Analytics */}
            <div className="md:col-span-7 glass-panel shard-right p-12 md:p-20 mb-12 md:mb-0 transform hover:-translate-y-2 transition-transform duration-500 relative z-10 group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="text-5xl font-bold text-[#facc15]">01</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Real-time<br/>Analytics</h3>
              <p className="text-gray-400 max-w-sm mb-8">
                Live telemetry from over 50,000 nodes, processed via edge computing for millisecond latency in routing.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-20 bg-[#facc15]"></div>
                <Link to="/select" className="text-xs font-bold uppercase tracking-widest hover:text-[#facc15] transition-colors">Access Module</Link>
              </div>
            </div>
            {/* Shard 2: Smart Mapping (Overlapping) */}
            <div className="md:col-start-6 md:col-span-7 md:-mt-20 glass-panel shard-left border-[#facc1533] bg-[#141417cc] transform hover:translate-x-2 transition-transform duration-500 relative z-20 group">
              <div className="absolute top-0 left-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="text-5xl font-bold text-[#facc15]">02</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <h3 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Kinetic<br/>Mapping</h3>
                <p className="text-gray-400 max-w-sm mb-8">
                  3D spatial awareness for autonomous vehicles. Seamless integration with LIDAR and computer vision protocols.
                </p>
                <div className="flex items-center gap-4">
                  <Link to="/select" className="text-xs font-bold uppercase tracking-widest hover:text-[#facc15] transition-colors">View Atlas</Link>
                  <div className="h-[1px] w-20 bg-[#facc15]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Feature Shards */}

      {/* BEGIN: Scale of Operations */}
      <section className="py-32 bg-[#141417] border-y border-[#ffffff0d] overflow-hidden" data-purpose="scale-section" id="stats">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none italic">Scale of<br/>Operations</h2>
            <div className="text-right">
              <p className="text-[#facc15] font-bold text-sm tracking-widest uppercase mb-2">Network Health: Optimal</p>
              <div className="flex justify-end gap-1">
                <div className="w-12 h-1 bg-[#facc15]"></div>
                <div className="w-12 h-1 bg-[#facc15]"></div>
                <div className="w-12 h-1 bg-[#facc1533]"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="250">0</div>
              <p className="text-[#facc15] text-sm uppercase tracking-widest font-bold">Cities Connected</p>
              <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-[#ffffff1a]"></div>
            </div>
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="1.2">0</div>
              <p className="text-[#facc15] text-sm uppercase tracking-widest font-bold">M+ Sessions / Day</p>
              <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-[#ffffff1a]"></div>
            </div>
            <div className="relative" data-purpose="stat-card">
              <div className="text-8xl md:text-9xl font-bold text-white mb-2 counter-value" data-target="99">0</div>
              <p className="text-[#facc15] text-sm uppercase tracking-widest font-bold">% Efficiency Gain</p>
              <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-[#ffffff1a]"></div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Scale of Operations */}

      {/* BEGIN: Nodes Section */}
      <section className="py-32 bg-[#0a0a0b]" data-purpose="nodes-display" id="nodes">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-[#facc1566] z-0"></div>
              <img alt="High-tech Parking Hub" className="grayscale hover:grayscale-0 transition-all duration-700 relative z-10 w-full rounded-sm shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaLFeZNnE6fP9Ime_H9waohSEIMS9URK6bzp3-EpPfrlithY0G00iK4Lc_9c2PWhbdUOeMJSuQvaCErg1N2Kl0WNgdo8JMgAK5kBLmP9DejIZ4CXayp46OHvoYMVw8IA09yXf76jee44-ghwDN1xUyKIZkSS4iVlMI8IdPOeOEfNJyk5JRe7NWFBHPRvvLz2ZM1ATJc5ukYg7dXvu25XR7H_VNwr_nwuqDjsRaMptO5M2OVD-Pd2d5Woq1I4Sr35HvvHe-qf7rMHY" />
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
                  <span className="w-8 h-8 rounded-full border border-[#facc1580] flex items-center justify-center group-hover:bg-[#facc15] group-hover:text-black transition-all">→</span>
                  Quantum Encryption
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group">
                  <span className="w-8 h-8 rounded-full border border-[#facc1580] flex items-center justify-center group-hover:bg-[#facc15] group-hover:text-black transition-all">→</span>
                  EV-Charging Grid Sync
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group">
                  <span className="w-8 h-8 rounded-full border border-[#facc1580] flex items-center justify-center group-hover:bg-[#facc15] group-hover:text-black transition-all">→</span>
                  Dynamic Pricing Engine
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* END: Nodes Section */}

      {/* BEGIN: Footer */}
      <footer className="bg-black py-20 border-t border-[#ffffff1a] mt-10" data-purpose="main-footer">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold text-[#facc15] mb-6">VELOXPARK.OS</h3>
              <p className="text-gray-500 max-w-sm">The operating system for the next billion urban transitions. Built for cities, scaled for humanity.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-white">System</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a className="hover:text-[#facc15]" href="#">API Docs</a></li>
                <li><a className="hover:text-[#facc15]" href="#">Infrastructure</a></li>
                <li><a className="hover:text-[#facc15]" href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a className="hover:text-[#facc15]" href="#">Privacy Protocol</a></li>
                <li><a className="hover:text-[#facc15]" href="#">Terms of Service</a></li>
                <li><a className="hover:text-[#facc15]" href="#">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#ffffff0d]">
            <p className="text-[10px] uppercase tracking-widest text-gray-600">© 2026 VeloxPark Urban Mobility Corp. All Rights Reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="w-2 h-2 rounded-full bg-[#facc15] animate-pulse self-center"></span>
              <p className="text-[10px] uppercase tracking-widest text-gray-600">Server: London_Cluster_01</p>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
};

export default Home;
