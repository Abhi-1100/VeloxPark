import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { formatDuration } from '../utils/parkingUtils';

const UserPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state;

    // Guard: redirect if landed without data
    if (!state || !state.vehicleData) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#231f0f', fontFamily: "'Space Grotesk', sans-serif", color: '#fff'
            }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#f9d006', display: 'block', marginBottom: '16px' }}>error_outline</span>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>No Payment Data Found</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Please search for your vehicle first.</p>
                    <button onClick={() => navigate('/user')} style={{
                        background: '#f9d006', color: '#231f0f', border: 'none', borderRadius: '12px',
                        padding: '14px 32px', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>Go Back</button>
                </div>
            </div>
        );
    }

    const { vehicleData, upiConfig, upiLink } = state;

    // Navigate to success page, passing all data forward
    const handleConfirmPayment = () => {
        navigate('/user/payment/success', {
            state: { vehicleData, upiConfig }
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#231f0f',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
        }}>

            {/* ── Header ── */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 80px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(35,31,15,0.6)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', background: '#f9d006', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#231f0f',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>local_parking</span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>VeloxPark</h2>
                </div>

                {/* Nav + Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {['Dashboard', 'My Bookings', 'Settings'].map(item => (
                            <a key={item} href="#" style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.target.style.color = '#f9d006')}
                                onMouseLeave={e => (e.target.style.color = '#94a3b8')}>
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '2px solid rgba(249,208,6,0.25)',
                        background: '#3a3318', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#f9d006', fontWeight: 700, fontSize: '14px',
                    }}>U</div>
                </div>
            </header>

            {/* ── Main ── */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 16px',
                background: 'linear-gradient(180deg, rgba(249,208,6,0.05) 0%, transparent 40%)',
            }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>

                    {/* Amount */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <p style={{
                            fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '3px', color: '#64748b', marginBottom: '8px',
                        }}>
                            Total Amount Due
                        </p>
                        <h1 style={{
                            fontSize: '72px', fontWeight: 700, color: '#f9d006',
                            letterSpacing: '-3px', lineHeight: 1,
                        }}>
                            ₹{vehicleData.amount || 0}
                        </h1>
                        {vehicleData.amount === 0 && (
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                                Your stay was within the free 30-minute window
                            </p>
                        )}
                    </div>

                    {/* QR Card */}
                    <div style={{
                        position: 'relative',
                        background: '#2d2816',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {/* Top glow line */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '1px',
                            background: 'rgba(249,208,6,0.2)', borderRadius: '24px 24px 0 0', filter: 'blur(1px)',
                        }} />

                        {/* QR or Free Badge */}
                        {vehicleData.amount > 0 ? (
                            <>
                                {/* QR white container */}
                                <div style={{
                                    background: '#ffffff', padding: '24px',
                                    borderRadius: '16px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{
                                        width: '256px', height: '256px',
                                        background: '#ffffff', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '8px', overflow: 'hidden',
                                        border: '4px solid #f8fafc',
                                    }}>
                                        <QRCodeSVG
                                            value={upiLink}
                                            size={240}
                                            level="H"
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                        />
                                    </div>
                                </div>

                                {/* Scan instruction */}
                                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Scan to Pay</h3>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
                                        Use any UPI app or Digital Wallet to complete your payment
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 0', marginBottom: '24px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#22c55e', display: 'block', marginBottom: '16px' }}>check_circle</span>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Payment Required</h3>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>Your stay was complimentary</p>
                            </div>
                        )}

                        {/* Session info row */}
                        <div style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            {/* Vehicle Number */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b' }}>
                                    Vehicle Number
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                                    {vehicleData.plate}
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />

                            {/* Total Duration */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b' }}>
                                    Total Duration
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                                    {formatDuration(vehicleData.duration) || '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Primary — Confirm Payment */}
                        <button
                            onClick={handleConfirmPayment}
                            style={{
                                width: '100%', height: '64px',
                                background: '#f9d006', color: '#231f0f',
                                border: 'none', borderRadius: '16px',
                                fontSize: '17px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '10px', cursor: 'pointer',
                                boxShadow: '0 8px 30px rgba(249,208,6,0.2)',
                                transition: 'box-shadow 0.2s, transform 0.15s',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,208,6,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(249,208,6,0.2)'; e.currentTarget.style.transform = 'none'; }}
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '22px' }}>check_circle</span>
                            Confirm Payment
                        </button>

                        {/* Secondary row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '8px 0' }}>
                            <button
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: 600, color: '#64748b',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontFamily: "'Space Grotesk', sans-serif", transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#f9d006')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>help</span>
                                Having trouble?
                            </button>

                            <span style={{ color: '#334155' }}>|</span>

                            <button
                                onClick={() => navigate('/user')}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: 600, color: '#64748b',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontFamily: "'Space Grotesk', sans-serif", transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#f9d006')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Payment icons strip */}
                    <div
                        style={{
                            marginTop: '48px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '32px', opacity: 0.4, filter: 'grayscale(1)',
                            transition: 'opacity 0.5s, filter 0.5s',
                            cursor: 'default',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'grayscale(0)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = 0.4; e.currentTarget.style.filter = 'grayscale(1)'; }}
                    >
                        {['payments', 'credit_card', 'account_balance_wallet'].map(icon => (
                            <span key={icon} className="material-symbols-outlined" style={{ fontSize: '36px' }}>{icon}</span>
                        ))}
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer style={{ padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                <p>© 2024 VeloxPark Management System. All rights reserved.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                    {['Terms of Service', 'Privacy Policy', 'Support'].map(item => (
                        <a key={item} href="#" style={{
                            color: '#64748b', textDecoration: 'underline',
                            textDecorationColor: 'rgba(249,208,6,0.3)', transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => (e.target.style.color = '#f9d006')}
                            onMouseLeave={e => (e.target.style.color = '#64748b')}>
                            {item}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default UserPaymentPage;
