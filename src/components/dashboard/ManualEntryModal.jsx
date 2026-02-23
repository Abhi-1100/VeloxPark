/**
 * ManualEntryModal.jsx
 * --------------------
 * Floating modal for manually registering a vehicle entry when hardware
 * sensors are offline.  Calls pushManualEntry() → Firebase `numberplate`
 * node — the dashboard subscription picks up the new record automatically.
 *
 * PROPS:
 *   isOpen    {boolean}   Whether the modal is visible
 *   onClose   {function}  Called when the user dismisses the modal
 */

import { useState } from 'react';
import { pushManualEntry } from '../../services/firebaseService';

const ManualEntryModal = ({ isOpen, onClose }) => {
    const [plate, setPlate] = useState('');
    const [type, setType] = useState('');
    const [zone, setZone] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errMsg, setErrMsg] = useState('');

    if (!isOpen) return null;

    const reset = () => {
        setPlate('');
        setType('');
        setZone('');
        setStatus('idle');
        setErrMsg('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanPlate = plate.trim().toUpperCase();
        if (!cleanPlate) { setErrMsg('Please enter a licence plate.'); return; }
        if (!type) { setErrMsg('Please select a vehicle type.'); return; }
        if (!zone) { setErrMsg('Please select a parking zone.'); return; }

        setErrMsg('');
        setStatus('loading');

        try {
            await pushManualEntry(cleanPlate, type, zone);
            setStatus('success');
        } catch (err) {
            console.error('Manual entry failed:', err);
            setErrMsg('Failed to register entry. Check your connection and try again.');
            setStatus('error');
        }
    };

    /* ── Shared input style ── */
    const inputBase = {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(249,208,6,0.2)',
        borderRadius: '12px',
        color: '#e2e8f0',
        outline: 'none',
        fontFamily: "'Space Grotesk', sans-serif",
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    };

    return (
        /* ── Backdrop ── */
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 60,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            {/* ── Modal card ── */}
            <div style={{
                position: 'relative',
                width: '100%', maxWidth: '520px',
                background: 'rgba(22,22,22,0.97)',
                border: '1px solid rgba(249,208,6,0.35)',
                borderRadius: '20px',
                boxShadow: '0 0 60px rgba(249,208,6,0.15), 0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden',
            }}>

                {/* Success overlay */}
                {status === 'success' && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        background: 'rgba(22,22,22,0.97)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '16px', padding: '40px', textAlign: 'center',
                        borderRadius: '20px',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: 'rgba(249,208,6,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                background: '#f9d006', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(249,208,6,0.4)',
                            }}>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '28px', color: '#0a0a0a',
                                    fontVariationSettings: "'FILL' 1, 'wght' 700",
                                }}>check</span>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                                Entry Registered!
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                                <span style={{ color: '#f9d006', fontWeight: 700, fontFamily: 'monospace', fontSize: '16px' }}>
                                    {plate.toUpperCase()}
                                </span>
                                <br />
                                has been logged to the database.<br />
                                The dashboard will update automatically.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
                            <button
                                onClick={reset}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', color: '#e2e8f0',
                                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '0.5px',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                            >
                                ADD ANOTHER
                            </button>
                            <button
                                onClick={handleClose}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: '#f9d006', border: 'none',
                                    borderRadius: '12px', color: '#0a0a0a',
                                    fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '1px',
                                    boxShadow: '0 4px 20px rgba(249,208,6,0.3)',
                                }}
                            >
                                DONE
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Form body ── */}
                <div style={{ padding: '32px' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'rgba(249,208,6,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#f9d006',
                            boxShadow: '0 0 15px rgba(249,208,6,0.15)',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>add_circle</span>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                Manual Vehicle Entry
                            </h2>
                            <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                Sensor override — entry will be timestamped now
                            </p>
                        </div>

                        {/* Close X */}
                        <button
                            onClick={handleClose}
                            style={{
                                marginLeft: 'auto', background: 'none', border: 'none',
                                color: '#475569', cursor: 'pointer', padding: '4px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '6px', transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#f9d006')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Plate number */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '10px', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '2px',
                                color: '#475569', marginBottom: '8px', marginLeft: '4px',
                            }}>
                                License Plate Number
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. TS15EL5671"
                                value={plate}
                                onChange={e => setPlate(e.target.value.toUpperCase())}
                                maxLength={12}
                                required
                                disabled={status === 'loading'}
                                style={{
                                    ...inputBase,
                                    padding: '16px 20px',
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    fontFamily: "'Space Grotesk', monospace",
                                    color: '#f9d006',
                                    letterSpacing: '0.1em',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#f9d006')}
                                onBlur={e => (e.target.style.borderColor = 'rgba(249,208,6,0.2)')}
                            />
                        </div>

                        {/* Type + Zone row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                            {/* Vehicle Type */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '10px', fontWeight: 800,
                                    textTransform: 'uppercase', letterSpacing: '2px',
                                    color: '#475569', marginBottom: '8px', marginLeft: '4px',
                                }}>
                                    Vehicle Type
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        required
                                        disabled={status === 'loading'}
                                        style={{
                                            ...inputBase,
                                            padding: '14px 40px 14px 16px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            appearance: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onFocus={e => (e.target.style.borderColor = '#f9d006')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(249,208,6,0.2)')}
                                    >
                                        <option value="" disabled style={{ background: '#161616' }}>Type</option>
                                        <option value="Car" style={{ background: '#161616' }}>Car</option>
                                        <option value="Bike" style={{ background: '#161616' }}>Bike</option>
                                        <option value="Truck" style={{ background: '#161616' }}>Truck</option>
                                        <option value="EV" style={{ background: '#161616' }}>EV</option>
                                    </select>
                                    <span className="material-symbols-outlined" style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#475569', pointerEvents: 'none', fontSize: '18px',
                                    }}>expand_more</span>
                                </div>
                            </div>

                            {/* Parking Zone */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '10px', fontWeight: 800,
                                    textTransform: 'uppercase', letterSpacing: '2px',
                                    color: '#475569', marginBottom: '8px', marginLeft: '4px',
                                }}>
                                    Parking Zone
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={zone}
                                        onChange={e => setZone(e.target.value)}
                                        required
                                        disabled={status === 'loading'}
                                        style={{
                                            ...inputBase,
                                            padding: '14px 40px 14px 16px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            appearance: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onFocus={e => (e.target.style.borderColor = '#f9d006')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(249,208,6,0.2)')}
                                    >
                                        <option value="" disabled style={{ background: '#161616' }}>Zone</option>
                                        <option value="Zone A" style={{ background: '#161616' }}>Zone A</option>
                                        <option value="Zone B" style={{ background: '#161616' }}>Zone B</option>
                                        <option value="Zone C" style={{ background: '#161616' }}>Zone C</option>
                                        <option value="Zone E (EV)" style={{ background: '#161616' }}>Zone E (EV)</option>
                                    </select>
                                    <span className="material-symbols-outlined" style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#475569', pointerEvents: 'none', fontSize: '18px',
                                    }}>expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {errMsg && (
                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(255,51,102,0.08)',
                                border: '1px solid rgba(255,51,102,0.3)',
                                borderRadius: '10px',
                                color: '#ff6b8a',
                                fontSize: '13px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', flexShrink: 0 }}>error</span>
                                {errMsg}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                style={{
                                    width: '100%', padding: '16px',
                                    background: status === 'loading' ? 'rgba(249,208,6,0.6)' : '#f9d006',
                                    border: 'none', borderRadius: '12px',
                                    color: '#0a0a0a', fontWeight: 800, fontSize: '13px',
                                    letterSpacing: '1.5px', textTransform: 'uppercase',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    boxShadow: '0 4px 20px rgba(249,208,6,0.25)',
                                    transition: 'box-shadow 0.2s, transform 0.15s',
                                }}
                                onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.boxShadow = '0 0 24px rgba(249,208,6,0.5)'; }}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,208,6,0.25)')}
                                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                                onMouseUp={e => (e.currentTarget.style.transform = 'none')}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>sync</span>
                                        Registering…
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_reg</span>
                                        Register Entry
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleClose}
                                style={{
                                    width: '100%', padding: '14px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px', color: '#94a3b8',
                                    fontWeight: 700, fontSize: '12px',
                                    letterSpacing: '1.5px', textTransform: 'uppercase',
                                    cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bottom glow line */}
                <div style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(249,208,6,0.4), transparent)',
                }} />
            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ManualEntryModal;
