import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import avatarJack from '../../assets/avatar-jack.jpg';
import './Profile.css';

/* ─── Vector SVG Icons ─────────────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.8 2 11v5c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 14 14" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 6.8L21 10.5l-5.6 4.3 1.8 7.2-5.2-4.1-5.2 4.1 1.8-7.2-5.6-4.3 6.6-1.7z" />
    </svg>
  );
}

function IconLogOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconChevronRight({ color = '#9ca3af' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme: ctxTheme, setTheme: setCtxTheme } = useTheme();

  const THEME_KEY = 'veloxpark-theme';
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-user-theme')
      || localStorage.getItem(THEME_KEY)
      || ctxTheme
      || 'dark';
  });

  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-user-theme', t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch { /* ignore */ }
    setCurrentTheme(t);
    if (typeof setCtxTheme === 'function') {
      setCtxTheme(t);
    }
  };

  const [form, setForm]         = useState({ name: '', phone: '' });
  const [plates, setPlates]     = useState([]);
  const [newPlate, setNewPlate] = useState('');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [stats, setStats]       = useState({ sessions: 0, hours: 0, pts: 0 });
  const [toast, setToast]       = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const toastTimer = useRef(null);

  /* Live Firestore profile sync */
  useEffect(() => {
    if (!user?.uid) return undefined;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const data = snap.data() || {};
      setForm({
        name:  data.name  || user.displayName || '',
        phone: data.phone || '',
      });
      if (Array.isArray(data.vehiclePlates) && data.vehiclePlates.length > 0) {
        setPlates(data.vehiclePlates);
      } else {
        setPlates(['7ABC123']);
      }
    });
    return unsub;
  }, [user]);

  /* Booking stats */
  useEffect(() => {
    if (!user?.uid) return;
    async function loadStats() {
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        let totalHours = 0;
        snap.forEach((d) => {
          const b = d.data();
          if (b.duration) totalHours += Number(b.duration) / 60;
          else if (b.durationHours) totalHours += Number(b.durationHours);
        });
        const count = snap.size || 0;
        setStats({
          sessions: count,
          hours:    Math.round(totalHours),
          pts:      count * 120,
        });
      } catch (_) {
        setStats({ sessions: 0, hours: 0, pts: 0 });
      }
    }
    loadStats();
  }, [user]);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2600);
  };

  const addPlate = () => {
    const plate = newPlate.trim().toUpperCase();
    if (!plate) return;
    if (plates.includes(plate)) {
      showToast('Plate already added');
      return;
    }
    setPlates((p) => [...p, plate]);
    setNewPlate('');
  };

  const removePlate = (plateToRemove) => {
    if (plates.length <= 1) {
      showToast('At least one plate is required');
      return;
    }
    setPlates((p) => p.filter((x) => x !== plateToRemove));
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name:          form.name.trim(),
        phone:         form.phone.trim(),
        vehiclePlates: plates,
        updatedAt:     new Date(),
      });
      setSaved(true);
      showToast('✓ Changes saved successfully');
      setTimeout(() => setSaved(false), 2500);
    } catch {
      showToast('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (_) { /* ignore */ }
  };

  const displayName = form.name || user?.displayName || 'Driver User';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DU';

  const userPhoto = user?.photoURL || avatarJack;

  return (
    <div className="prof-page">
      <div className="prof-shell">
        
        {/* Top Bar with back navigation and theme switcher */}
        <div className="prof-top-bar">
          <button
            type="button"
            className="prof-nav-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <IconArrowLeft />
          </button>
          
          <h2 className="prof-top-title">Profile</h2>

          <button
            type="button"
            className="prof-nav-btn"
            onClick={() => applyTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {currentTheme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
        </div>

        {/* Hero Section with Banner + Prominent Centered Avatar */}
        <div className="prof-header-hero">
          <div className="prof-banner-strip">
            <div className="prof-banner-pattern"></div>
          </div>

          <div className="prof-avatar-cluster">
            <div className="prof-avatar-ring">
              {!imgError && userPhoto ? (
                <img
                  src={userPhoto}
                  alt={displayName}
                  className="prof-avatar-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="prof-avatar-fallback">{initials}</div>
              )}
              <div className="prof-avatar-badge" title="Verified Account">✓</div>
            </div>

            <h1 className="prof-user-name">{displayName}</h1>
            <p className="prof-user-email">{user?.email || 'driver@veloxpark.com'}</p>
            
            <div className="prof-member-pill">
              <span className="prof-star-icon">★</span>
              <span>VeloxPark Member</span>
            </div>
          </div>
        </div>

        {/* 3 Square Stat Quick-Cards (Wireframe 3-Box Row) */}
        <div className="prof-stats-grid">
          <div className="prof-stat-box" onClick={() => navigate('/history')} role="button" tabIndex={0}>
            <div className="prof-stat-icon-wrap sessions">
              <IconHistory />
            </div>
            <div className="prof-stat-val">{stats.sessions}</div>
            <div className="prof-stat-lbl">Sessions</div>
          </div>

          <div className="prof-stat-box">
            <div className="prof-stat-icon-wrap hours">
              <IconClock />
            </div>
            <div className="prof-stat-val">{stats.hours}h</div>
            <div className="prof-stat-lbl">Duration</div>
          </div>

          <div className="prof-stat-box">
            <div className="prof-stat-icon-wrap rewards">
              <IconSparkles />
            </div>
            <div className="prof-stat-val gold">{stats.pts}</div>
            <div className="prof-stat-lbl">Points</div>
          </div>
        </div>

        {/* 3 Wide Stacked Cards (Wireframe 3 Horizontal Rows) */}
        <div className="prof-rows-stack">
          
          {/* Row Card 1: Personal Details */}
          <div className="prof-row-card">
            <div className="prof-row-head">
              <div className="prof-row-icon"><IconUser /></div>
              <div className="prof-row-titles">
                <h3 className="prof-row-title">Personal Details</h3>
                <p className="prof-row-sub">Manage your driver information</p>
              </div>
            </div>

            <div className="prof-card-fields">
              <div className="prof-field">
                <label className="prof-field-label">FULL NAME</label>
                <input
                  type="text"
                  className="prof-input"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="prof-field">
                <label className="prof-field-label">PHONE NUMBER</label>
                <input
                  type="tel"
                  className="prof-input"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Row Card 2: Vehicles & License Plates */}
          <div className="prof-row-card">
            <div className="prof-row-head">
              <div className="prof-row-icon"><IconCar /></div>
              <div className="prof-row-titles">
                <h3 className="prof-row-title">Vehicle Plates</h3>
                <p className="prof-row-sub">{plates.length} vehicle(s) saved</p>
              </div>
            </div>

            <div className="prof-plates-wrap">
              {plates.map((plate, index) => (
                <div key={plate} className="prof-plate-pill">
                  <span className="prof-plate-val">{plate}</span>
                  {index === 0 && <span className="prof-plate-primary">PRIMARY</span>}
                  <button
                    type="button"
                    className="prof-plate-del"
                    onClick={() => removePlate(plate)}
                    title="Remove plate"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="prof-add-plate-row">
              <input
                type="text"
                className="prof-input prof-add-input"
                placeholder="ADD PLATE (E.G. 7ABC123)"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPlate();
                  }
                }}
              />
              <button
                type="button"
                className="prof-add-btn"
                onClick={addPlate}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Row Card 3: Appearance & Display */}
          <div className="prof-row-card">
            <div className="prof-row-head">
              <div className="prof-row-icon"><IconMoon /></div>
              <div className="prof-row-titles">
                <h3 className="prof-row-title">Appearance</h3>
                <p className="prof-row-sub">Cockpit theme selector</p>
              </div>
            </div>

            <div className="prof-theme-grid">
              <button
                type="button"
                className={`prof-theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
                onClick={() => applyTheme('dark')}
              >
                <div className="prof-theme-btn-icon"><IconMoon /></div>
                <div className="prof-theme-btn-info">
                  <span className="prof-theme-btn-title">Dark Cockpit</span>
                  <span className="prof-theme-btn-desc">Night &amp; HUD view</span>
                </div>
                {currentTheme === 'dark' && <span className="prof-theme-check">✓</span>}
              </button>

              <button
                type="button"
                className={`prof-theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
                onClick={() => applyTheme('light')}
              >
                <div className="prof-theme-btn-icon"><IconSun /></div>
                <div className="prof-theme-btn-info">
                  <span className="prof-theme-btn-title">Light Daylight</span>
                  <span className="prof-theme-btn-desc">High clarity view</span>
                </div>
                {currentTheme === 'light' && <span className="prof-theme-check">✓</span>}
              </button>
            </div>
          </div>

          {/* Quick Action Rows: History & Sign Out */}
          <div className="prof-nav-links">
            <div
              className="prof-link-row"
              onClick={() => navigate('/history')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/history')}
            >
              <div className="prof-link-left">
                <div className="prof-link-icon"><IconHistory /></div>
                <div>
                  <span className="prof-link-title">Parking History</span>
                  <span className="prof-link-subtitle">Telemetry, receipts &amp; barriers</span>
                </div>
              </div>
              <IconChevronRight />
            </div>

            <div
              className="prof-link-row danger"
              onClick={handleLogout}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
            >
              <div className="prof-link-left">
                <div className="prof-link-icon danger"><IconLogOut /></div>
                <div>
                  <span className="prof-link-title danger">Sign Out</span>
                  <span className="prof-link-subtitle">Disconnect active session</span>
                </div>
              </div>
              <IconChevronRight color="#ef4444" />
            </div>
          </div>

        </div>

        {/* Sticky Save Bar */}
        <div className="prof-bottom-bar">
          <button
            type="button"
            className={`prof-save-btn ${saved ? 'saved' : ''}`}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Saving Changes…' : saved ? '✓ Profile Saved!' : 'Save Changes'}
          </button>
        </div>

      </div>

      {/* Toast popup */}
      <div className={`prof-toast ${toastVisible ? 'visible' : ''}`} aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

export default Profile;
