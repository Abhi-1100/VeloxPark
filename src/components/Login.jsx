import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    // ── Existing state — UNCHANGED ────────────────────────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ── UI-only state (password visibility toggle) ────────────────────────────
    const [showPassword, setShowPassword] = useState(false);

    // ── Existing handler — UNCHANGED ──────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (error) {
            setError('Invalid credentials. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ── New UI — same logic, new look ─────────────────────────────────────────
    return (
        <div className="lp-root">
            {/* Background dot-grid pattern */}
            <div className="lp-bg-pattern" aria-hidden="true" />

            {/* Ambient glow blobs */}
            <div className="lp-glow lp-glow-tl" aria-hidden="true" />
            <div className="lp-glow lp-glow-br" aria-hidden="true" />

            <div className="lp-card-wrap">
                {/* Glass card */}
                <div className="lp-card">

                    {/* ── Logo & Header ── */}
                    <div className="lp-header">
                        <div className="lp-logo-icon">
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '36px', fontWeight: 700, color: '#12110a' }}
                            >
                                local_parking
                            </span>
                        </div>
                        <h1 className="lp-title">Smart Parking</h1>
                        <p className="lp-subtitle">Admin Portal: Sign in to manage your facility.</p>
                    </div>

                    {/* ── Error banner ── */}
                    {error && (
                        <div className="lp-error" role="alert">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                error
                            </span>
                            {error}
                        </div>
                    )}

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="lp-form" noValidate>

                        {/* Email */}
                        <div className="lp-field">
                            <label className="lp-label" htmlFor="lp-email">
                                Email Address
                            </label>
                            <div className="lp-input-wrap">
                                <span className="material-symbols-outlined lp-input-icon">mail</span>
                                <input
                                    id="lp-email"
                                    type="email"
                                    className="lp-input"
                                    placeholder="admin@smartparking.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="lp-field">
                            <div className="lp-label-row">
                                <label className="lp-label" htmlFor="lp-password">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="lp-forgot"
                                    tabIndex={-1}
                                    onClick={() => {/* placeholder — no forgot-password flow yet */ }}
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="lp-input-wrap">
                                <span className="material-symbols-outlined lp-input-icon">lock</span>
                                <input
                                    id="lp-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="lp-input lp-input-pw"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="lp-eye-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="lp-remember">
                            <input
                                type="checkbox"
                                id="lp-remember"
                                className="lp-checkbox"
                            />
                            <label htmlFor="lp-remember" className="lp-remember-label">
                                Remember this device
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="lp-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="lp-spinner" aria-hidden="true" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="material-symbols-outlined lp-arrow-icon">
                                        arrow_forward
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* ── Bottom links ── */}
                    <div className="lp-bottom">
                        <p className="lp-bottom-text">
                            Don't have an admin account?{' '}
                            <a href="#" className="lp-bottom-link">Request Access</a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="lp-footer">
                    <span>v2.4.0-Stable</span>
                    <span className="lp-footer-dot" aria-hidden="true" />
                    <span>© 2025 Smart Parking Systems</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
