import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Login.page.css';

/* ─── Google SVG icon ─────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.552c0-1.636-.145-3.2-.415-4.695H24.48v8.879h12.984c-.56 3.015-2.248 5.569-4.79 7.284v6.053h7.755c4.538-4.18 7.103-10.336 7.103-17.52z" fill="#4285F4"/>
    <path d="M24.48 48c6.517 0 11.987-2.162 15.984-5.853l-7.756-6.053c-2.155 1.445-4.912 2.297-8.228 2.297-6.328 0-11.684-4.27-13.593-10.01H2.87v6.248C6.845 42.892 15.063 48 24.48 48z" fill="#34A853"/>
    <path d="M10.887 28.38A14.44 14.44 0 0 1 10.13 24c0-1.52.26-2.997.757-4.38V13.37H2.869A23.97 23.97 0 0 0 .48 24c0 3.867.927 7.527 2.389 10.629l8.018-6.249z" fill="#FBBC05"/>
    <path d="M24.48 9.607c3.563 0 6.76 1.225 9.278 3.629l6.958-6.957C36.46 2.384 30.994 0 24.48 0 15.063 0 6.845 5.107 2.87 13.37l8.018 6.248c1.91-5.74 7.265-10.01 13.593-10.01z" fill="#EA4335"/>
  </svg>
);

/* ─── Parking lot SVG illustration ────────────────── */
const ParkingIllustration = () => (
  <svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="vl-hero-svg">
    <rect x="20" y="60" width="320" height="160" rx="4" fill="#1A1A0A" stroke="#F2C230" strokeWidth="0.5" strokeOpacity="0.3"/>
    <line x1="20" y1="140" x2="340" y2="140" stroke="#F2C230" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="8 6"/>
    <line x1="120" y1="60" x2="120" y2="220" stroke="#F2C230" strokeWidth="0.5" strokeOpacity="0.3"/>
    <line x1="240" y1="60" x2="240" y2="220" stroke="#F2C230" strokeWidth="0.5" strokeOpacity="0.3"/>
    {[30,65,100].map(x => (
      <rect key={x} x={x} y="68" width="28" height="58" rx="2" stroke="#F2C230" strokeWidth="0.6" strokeOpacity="0.35" fill="none"/>
    ))}
    <rect x="33" y="78" width="22" height="40" rx="4" fill="#1E1E10" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.7"/>
    <rect x="35" y="82" width="18" height="16" rx="2" fill="#2A2A18" stroke="#F2C230" strokeWidth="0.4" strokeOpacity="0.5"/>
    <circle cx="36" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <circle cx="52" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <rect x="68" y="78" width="22" height="40" rx="4" fill="#1E1E10" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.4"/>
    <rect x="70" y="82" width="18" height="16" rx="2" fill="#2A2A18" stroke="#F2C230" strokeWidth="0.4" strokeOpacity="0.3"/>
    <circle cx="71" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.5"/>
    <circle cx="87" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.5"/>
    <rect x="103" y="68" width="28" height="58" rx="2" stroke="#F2C230" strokeWidth="0.6" strokeOpacity="0.6" fill="rgba(242,194,48,0.04)"/>
    <circle cx="117" cy="97" r="6" fill="#F2C230" fillOpacity="0.15"/>
    <circle cx="117" cy="97" r="3" fill="#F2C230" fillOpacity="0.6"/>
    {[30,65,100].map(x => (
      <rect key={x} x={x} y="148" width="28" height="58" rx="2" stroke="#F2C230" strokeWidth="0.6" strokeOpacity="0.35" fill="none"/>
    ))}
    <rect x="33" y="156" width="22" height="40" rx="4" fill="#1E1E10" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.5"/>
    <rect x="35" y="160" width="18" height="16" rx="2" fill="#2A2A18" stroke="#F2C230" strokeWidth="0.4" strokeOpacity="0.4"/>
    <circle cx="36" cy="196" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <circle cx="52" cy="196" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    {[150,185,220].map(x => (
      <rect key={x} x={x} y="68" width="28" height="58" rx="2" stroke="#F2C230" strokeWidth="0.6" strokeOpacity="0.3" fill="none"/>
    ))}
    <rect x="153" y="78" width="22" height="40" rx="4" fill="#1E1E10" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <circle cx="154" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <circle cx="172" cy="118" r="4" fill="#0A0A0A" stroke="#F2C230" strokeWidth="0.8" strokeOpacity="0.6"/>
    <g className="vl-moving-car">
      <rect x="270" y="148" width="26" height="44" rx="5" fill="#F2C230" fillOpacity="0.9"/>
      <rect x="273" y="153" width="20" height="18" rx="3" fill="#0A0A05" fillOpacity="0.7"/>
      <circle cx="273" cy="192" r="5" fill="#0A0A0A" stroke="#fff" strokeWidth="1" strokeOpacity="0.5"/>
      <circle cx="293" cy="192" r="5" fill="#0A0A0A" stroke="#fff" strokeWidth="1" strokeOpacity="0.5"/>
    </g>
    <circle cx="283" cy="148" r="12" fill="#F2C230" fillOpacity="0.08"/>
  </svg>
);

function Login() {
  const { user, role, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to={role === 'admin' ? '/admin' : (location.state?.from?.pathname || '/')} replace />;

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError(''); setBusy(true);
    try {
      if (mode === 'signup') await signUp(form.email, form.password, form.name);
      else await signIn(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
          ? 'Email or password is incorrect.'
          : err.message || 'Unable to continue.'
      );
    } finally { setBusy(false); }
  };

  const google = async () => {
    setError(''); setBusy(true);
    try { await signInWithGoogle(); navigate('/'); }
    catch (err) {
      setError(err.code === 'auth/popup-closed-by-user' ? 'Google sign-in was cancelled.' : err.message || 'Google sign-in failed.');
    }
    finally { setBusy(false); }
  };

  return (
    <div className="vl-root">
      {/* ── Left hero panel ──────────────────────────────────── */}
      <div className="vl-hero" aria-hidden="true">
        <div className="vl-hero-glow vl-hero-glow-tl" />
        <div className="vl-hero-glow vl-hero-glow-br" />

        <div className="vl-hero-content">
          <div className="vl-logo-mark">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#0A0A0A', fontVariationSettings: "'FILL' 1" }}>local_parking</span>
          </div>

          <div className="vl-wordmark">
            <span className="vl-wordmark-label">V.PARK</span>
            <h1 className="vl-wordmark-title">Velox<span>Park</span></h1>
            <p className="vl-wordmark-sub">Smart Parking. Instant Access.</p>
          </div>

          <div className="vl-illustration-wrap">
            <ParkingIllustration />
          </div>

          <div className="vl-stats">
            <div className="vl-stat">
              <span className="vl-stat-num">2,400+</span>
              <span className="vl-stat-lbl">Slots</span>
            </div>
            <div className="vl-stat-divider" />
            <div className="vl-stat">
              <span className="vl-stat-num">99.8%</span>
              <span className="vl-stat-lbl">Uptime</span>
            </div>
            <div className="vl-stat-divider" />
            <div className="vl-stat">
              <span className="vl-stat-num">12 sec</span>
              <span className="vl-stat-lbl">Avg Entry</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="vl-form-panel">
        <div className="vl-form-wrap">

          <div className="vl-mobile-logo">
            <div className="vl-logo-mark vl-logo-mark-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#0A0A0A', fontVariationSettings: "'FILL' 1" }}>local_parking</span>
            </div>
            <span className="vl-mobile-brand">VeloxPark</span>
          </div>

          <div className="vl-tabs" role="tablist">
            <button
              role="tab"
              className={`vl-tab ${mode === 'signin' ? 'vl-tab--active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); }}
              aria-selected={mode === 'signin'}
            >
              Sign In
            </button>
            <button
              role="tab"
              className={`vl-tab ${mode === 'signup' ? 'vl-tab--active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
              aria-selected={mode === 'signup'}
            >
              Sign Up
            </button>
          </div>

          <div className="vl-form-header">
            <h2 className="vl-form-title">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="vl-form-desc">
              {mode === 'signin'
                ? 'Sign in to manage your parking sessions.'
                : 'Join VeloxPark — reserve slots in seconds.'}
            </p>
          </div>

          {error && (
            <div className="vl-error" role="alert">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              {error}
            </div>
          )}

          <form className="vl-form" onSubmit={submit} noValidate>
            {mode === 'signup' && (
              <div className="vl-field">
                <label className="vl-label" htmlFor="vl-name">Full Name</label>
                <div className="vl-input-wrap">
                  <span className="material-symbols-outlined vl-input-icon">person</span>
                  <input
                    id="vl-name"
                    type="text"
                    className="vl-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange('name')}
                    required
                    disabled={busy}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="vl-field">
              <label className="vl-label" htmlFor="vl-email">Email Address</label>
              <div className="vl-input-wrap">
                <span className="material-symbols-outlined vl-input-icon">mail</span>
                <input
                  id="vl-email"
                  type="email"
                  className="vl-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  disabled={busy}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="vl-field">
              <div className="vl-label-row">
                <label className="vl-label" htmlFor="vl-password">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="vl-forgot" tabIndex={-1}>Forgot?</button>
                )}
              </div>
              <div className="vl-input-wrap">
                <span className="material-symbols-outlined vl-input-icon">lock</span>
                <input
                  id="vl-password"
                  type={showPassword ? 'text' : 'password'}
                  className="vl-input vl-input-pw"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                  minLength={6}
                  disabled={busy}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="vl-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="vl-submit-btn" disabled={busy} id="vl-submit">
              {busy ? (
                <><span className="vl-spinner" aria-hidden="true" /> Please wait…</>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <span className="material-symbols-outlined vl-arrow">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="vl-divider">
            <span className="vl-divider-line" />
            <span className="vl-divider-text">or</span>
            <span className="vl-divider-line" />
          </div>

          <button className="vl-google-btn" onClick={google} disabled={busy} id="vl-google">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="vl-foot-note">
            {mode === 'signin' ? 'New to VeloxPark?' : 'Already have an account?'}{' '}
            <button
              className="vl-foot-link"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
