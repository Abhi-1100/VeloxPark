import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import {
    calculateDuration,
    calculateAmount,
    formatDateTime,
    formatDuration,
    generateUPILink
} from '../utils/parkingUtils';

const UserParkingInfo = () => {
    const navigate = useNavigate();

    const [plateInput, setPlateInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vehicleData, setVehicleData] = useState(null);
    const [upiConfig, setUpiConfig] = useState({
        upiId: 'parking@upi',
        upiName: 'Smart Parking System'
    });

    // Load UPI config — identical to original UserPanel
    useEffect(() => {
        fetch('/config.json')
            .then(res => res.json())
            .then(cfg => {
                if (cfg.upiId) setUpiConfig(prev => ({ ...prev, upiId: cfg.upiId }));
                if (cfg.upiName) setUpiConfig(prev => ({ ...prev, upiName: cfg.upiName }));
            })
            .catch(() => { /* Use defaults */ });
    }, []);

    // Identical Firebase search logic from original UserPanel
    const searchVehicle = async (plate) => {
        const numberplateRef = ref(database, 'numberplate');
        return new Promise((resolve, reject) => {
            onValue(numberplateRef, (snapshot) => {
                const data = snapshot.val();
                if (!data) { resolve(null); return; }

                const entries = [];
                Object.keys(data).forEach(key => {
                    const entry = data[key];
                    if (entry.number_plate === plate && entry.number_plate !== 'NULL') {
                        entries.push({ id: key, plate: entry.number_plate, timestamp: entry.date_time });
                    }
                });

                if (entries.length === 0) { resolve(null); return; }
                entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                let vehicleInfo = { plate, entry: entries[0].timestamp, exit: null, status: 'Parked' };
                if (entries.length >= 2) {
                    vehicleInfo.exit = entries[1].timestamp;
                    vehicleInfo.status = 'Exited';
                    const dur = calculateDuration(vehicleInfo.entry, vehicleInfo.exit);
                    vehicleInfo.duration = dur;
                    vehicleInfo.amount = calculateAmount(dur);
                }
                resolve(vehicleInfo);
            }, reject);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const plate = plateInput.trim().toUpperCase();
        if (!plate) return;
        setLoading(true);
        setError('');
        setVehicleData(null);
        try {
            const data = await searchVehicle(plate);
            if (data) setVehicleData(data);
            else setError('Vehicle not found. Please check the number plate and try again.');
        } catch (err) {
            setError('Error fetching data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = () => {
        const upiLink = generateUPILink(upiConfig.upiId, upiConfig.upiName, vehicleData.amount, vehicleData.plate);
        navigate('/user/payment', { state: { vehicleData, upiConfig, upiLink } });
    };

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#0f0e09',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#ffffff',
        },
        header: {
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(15,14,9,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(249,208,6,0.12)',
        },
        headerInner: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        logoBadge: {
            background: '#f9d006',
            color: '#0f0e09',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
        },
        navLink: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#94a3b8',
            textDecoration: 'none',
            transition: 'color 0.2s',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
        },
        avatarRing: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid #f9d006',
            background: '#231f0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f9d006',
            fontWeight: 700,
            fontSize: '14px',
        },
        main: {
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '60px 32px 80px',
        },
        heroSection: {
            textAlign: 'center',
            marginBottom: '48px',
        },
        heroTitle: {
            fontSize: '48px',
            fontWeight: 800,
            marginBottom: '12px',
            letterSpacing: '-0.5px',
        },
        heroSub: {
            fontSize: '16px',
            color: '#64748b',
        },
        searchWrap: {
            maxWidth: '680px',
            margin: '0 auto 56px',
        },
        searchBox: {
            display: 'flex',
            alignItems: 'center',
            background: '#1c190e',
            border: '1.5px solid rgba(249,208,6,0.25)',
            borderRadius: '16px',
            padding: '8px 8px 8px 16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            gap: '8px',
        },
        searchInput: {
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            fontWeight: 500,
            color: '#ffffff',
            padding: '12px 8px',
            fontFamily: "'Space Grotesk', sans-serif",
        },
        searchBtn: {
            background: '#f9d006',
            color: '#0f0e09',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 36px',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.15s',
            fontFamily: "'Space Grotesk', sans-serif",
            flexShrink: 0,
        },
        errorBox: {
            maxWidth: '680px',
            margin: '0 auto 32px',
            padding: '14px 20px',
            background: 'rgba(255,51,102,0.08)',
            border: '1px solid rgba(255,51,102,0.35)',
            borderRadius: '12px',
            color: '#ff6b8a',
            fontSize: '14px',
            textAlign: 'center',
        },
        /* Results grid */
        resultsGrid: {
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '24px',
            marginBottom: '28px',
        },
        card: {
            background: '#1c190e',
            border: '1px solid rgba(249,208,6,0.14)',
            borderRadius: '20px',
            overflow: 'hidden',
        },
        cardHeader: {
            padding: '18px 24px 0',
        },
        sessionLabel: {
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#f9d006',
            marginBottom: '6px',
        },
        sessionPlate: {
            fontSize: '22px',
            fontWeight: 800,
            marginBottom: '20px',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
        },
        infoLabel: {
            fontSize: '13px',
            color: '#64748b',
        },
        infoValue: {
            fontSize: '13px',
            fontWeight: 600,
            color: '#e2e8f0',
        },
        pricingCard: {
            background: '#f9d006',
            color: '#0f0e09',
            borderRadius: '20px',
            padding: '22px 24px',
            marginTop: '16px',
        },
        pricingTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
        },
        pricingText: {
            fontSize: '13px',
            lineHeight: '1.7',
            opacity: 0.8,
            fontWeight: 500,
        },
        /* Right panel */
        rightCard: {
            background: '#1c190e',
            border: '1px solid rgba(249,208,6,0.14)',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
        rightCardHead: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
        },
        rightCardBody: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 28px',
            gap: '28px',
        },
        plateDisplay: {
            background: '#f9d006',
            color: '#0f0e09',
            padding: '22px 44px',
            borderRadius: '14px',
            fontSize: '40px',
            fontWeight: 900,
            letterSpacing: '0.22em',
            boxShadow: '0 12px 48px rgba(249,208,6,0.28)',
        },
        amountBlock: {
            textAlign: 'center',
        },
        amountLabel: {
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#64748b',
            marginBottom: '8px',
        },
        amountValue: {
            fontSize: '64px',
            fontWeight: 900,
            color: '#f9d006',
            lineHeight: 1,
            letterSpacing: '-1px',
        },
        parkedAlert: {
            background: 'rgba(249,208,6,0.07)',
            border: '1px solid rgba(249,208,6,0.18)',
            borderRadius: '12px',
            padding: '20px 28px',
            textAlign: 'center',
            maxWidth: '360px',
        },
        rightCardFoot: {
            padding: '18px 28px',
            background: 'rgba(0,0,0,0.25)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        /* Checkout bar */
        checkoutBar: {
            background: '#1c190e',
            border: '1px solid rgba(249,208,6,0.2)',
            borderRadius: '20px',
            padding: '32px 40px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
            overflow: 'hidden',
        },
        checkoutTitle: {
            fontSize: '26px',
            fontWeight: 800,
            marginBottom: '6px',
        },
        checkoutSub: {
            color: '#64748b',
            fontSize: '14px',
            marginBottom: '8px',
        },
        checkoutAmount: {
            color: '#f9d006',
            fontWeight: 800,
            fontSize: '20px',
        },
        payBtn: {
            background: '#f9d006',
            color: '#0f0e09',
            border: 'none',
            borderRadius: '14px',
            padding: '18px 48px',
            fontWeight: 900,
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 40px rgba(249,208,6,0.28)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            flexShrink: 0,
            fontFamily: "'Space Grotesk', sans-serif",
        },
        quadGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
        },
        quadCard: {
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            textAlign: 'left',
        },
        quadIcon: {
            color: '#f9d006',
            fontSize: '22px',
            marginBottom: '10px',
            display: 'block',
        },
        quadLabel: {
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '2px',
        },
        quadSub: {
            fontSize: '11px',
            color: '#64748b',
        },
        footer: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '28px 32px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
        },
        footerCopy: {
            fontSize: '11px',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        footerLinks: {
            display: 'flex',
            gap: '28px',
        },
        footerLink: {
            fontSize: '11px',
            fontWeight: 700,
            color: '#334155',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'color 0.2s',
        },
    };

    const statusBadge = (status) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        ...(status === 'Parked'
            ? { background: 'rgba(0,255,136,0.12)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.35)' }
            : { background: 'rgba(249,208,6,0.12)', color: '#f9d006', border: '1px solid rgba(249,208,6,0.35)' }
        )
    });

    return (
        <div style={styles.page}>
            {/* ── Header ── */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logo}>
                        <div style={styles.logoBadge}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>local_parking</span>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px' }}>
                            PARK<span style={{ color: '#f9d006' }}>PORTAL</span>
                        </span>
                    </div>

                    <nav style={styles.nav} className="hide-mobile">
                        {['Dashboard', 'Find My Car', 'Active Sessions', 'Wallet'].map(item => (
                            <a key={item} href="#" style={styles.navLink}
                                onMouseEnter={e => (e.target.style.color = '#f9d006')}
                                onMouseLeave={e => (e.target.style.color = '#94a3b8')}>
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', position: 'relative', padding: '8px' }}>
                            <span className="material-symbols-outlined">notifications</span>
                            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#f9d006', borderRadius: '50%' }} />
                        </button>
                        <div style={styles.avatarRing}>U</div>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main style={styles.main}>

                {/* Hero — only shown before search */}
                {!vehicleData && (
                    <div style={styles.heroSection}>
                        <h2 style={styles.heroTitle}>Ready to go?</h2>
                        <p style={styles.heroSub}>Enter your plate to check your parking status and proceed to checkout.</p>
                    </div>
                )}

                {/* Search Bar */}
                <div style={styles.searchWrap}>
                    <form onSubmit={handleSubmit} style={styles.searchBox}>
                        <span className="material-symbols-outlined" style={{ color: '#475569', flexShrink: 0 }}>search</span>
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Enter License Plate  (e.g. TS15EL5671)"
                            value={plateInput}
                            onChange={e => setPlateInput(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...styles.searchBtn, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                        >
                            {loading ? 'SEARCHING…' : 'FIND'}
                        </button>
                    </form>
                </div>

                {/* Error */}
                {error && (
                    <div style={styles.errorBox}>
                        <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '16px' }}>error</span>
                        {error}
                    </div>
                )}

                {/* ── Results ── */}
                {vehicleData && (
                    <>
                        {/* Two-column grid */}
                        <div style={styles.resultsGrid}>

                            {/* LEFT — Session info + pricing */}
                            <div>
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <p style={styles.sessionLabel}>
                                            {vehicleData.status === 'Parked' ? 'Active Session' : 'Completed Session'}
                                        </p>
                                        <h3 style={styles.sessionPlate}>{vehicleData.plate}</h3>
                                    </div>

                                    {[
                                        { label: 'Entry Time', value: formatDateTime(vehicleData.entry) },
                                        { label: 'Exit Time', value: vehicleData.exit ? formatDateTime(vehicleData.exit) : '—' },
                                        { label: 'Duration', value: formatDuration(vehicleData.duration) },
                                        {
                                            label: 'Status', value: (
                                                <span style={statusBadge(vehicleData.status)}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: vehicleData.status === 'Parked' ? '#00ff88' : '#f9d006', display: 'inline-block' }} />
                                                    {vehicleData.status}
                                                </span>
                                            )
                                        },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={styles.infoRow}>
                                            <span style={styles.infoLabel}>{label}</span>
                                            <span style={styles.infoValue}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing card */}
                                <div style={styles.pricingCard}>
                                    <div style={styles.pricingTitle}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
                                        Pricing Info
                                    </div>
                                    <p style={styles.pricingText}>
                                        First 30 minutes are <strong>FREE</strong>.<br />
                                        ₹20 per hour thereafter.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT — Plate + amount */}
                            <div style={styles.rightCard}>
                                <div style={styles.rightCardHead}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#475569' }}>
                                        Vehicle Details
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: vehicleData.status === 'Parked' ? '#00ff88' : '#f9d006',
                                            boxShadow: vehicleData.status === 'Parked' ? '0 0 8px #00ff88' : 'none',
                                        }} />
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                                            {vehicleData.status === 'Parked' ? 'IN PREMISES' : 'EXITED'}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.rightCardBody}>
                                    {/* Plate */}
                                    <div style={styles.plateDisplay}>{vehicleData.plate}</div>

                                    {/* Amount — only for exited */}
                                    {vehicleData.status === 'Exited' && (
                                        <div style={styles.amountBlock}>
                                            <p style={styles.amountLabel}>Amount Due</p>
                                            <p style={styles.amountValue}>₹{vehicleData.amount || 0}</p>
                                        </div>
                                    )}

                                    {/* Parked notice */}
                                    {vehicleData.status === 'Parked' && (
                                        <div style={styles.parkedAlert}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#f9d006', display: 'block', marginBottom: '10px' }}>
                                                hourglass_empty
                                            </span>
                                            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                                                Your vehicle is currently parked.<br />
                                                Amount will be calculated upon exit.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {vehicleData.status === 'Exited' && (
                                    <div style={styles.rightCardFoot}>
                                        <span className="material-symbols-outlined" style={{ color: '#f9d006', fontSize: '20px' }}>directions_car</span>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Vehicle has exited the premises</p>
                                            <p style={{ fontSize: '12px', color: '#475569' }}>Please proceed to pay via UPI QR code</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Checkout bar — only for exited ── */}
                        {vehicleData.status === 'Exited' && (
                            <div style={styles.checkoutBar}>
                                {/* BG icon */}
                                <span className="material-symbols-outlined" style={{
                                    position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '120px', opacity: 0.04, pointerEvents: 'none', color: '#f9d006'
                                }}>
                                    payments
                                </span>

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 style={styles.checkoutTitle}>Ready to checkout?</h3>
                                    <p style={styles.checkoutSub}>Scan the QR code at the gate — no paper ticket needed.</p>
                                    <p style={styles.checkoutAmount}>Total: ₹{vehicleData.amount || 0}</p>
                                </div>

                                <button
                                    onClick={handlePayNow}
                                    style={styles.payBtn}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 50px rgba(249,208,6,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,208,6,0.28)'; }}
                                >
                                    PAY NOW
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        )}

                        {/* Secondary Actions */}
                        <div style={styles.quadGrid}>
                            {[
                                { icon: 'history', label: 'Parking History', sub: 'View past sessions' },
                                { icon: 'support_agent', label: 'Need Help?', sub: 'Contact garage admin' },
                                { icon: 'receipt_long', label: 'Download VAT', sub: 'Monthly reports' },
                                { icon: 'settings', label: 'Preferences', sub: 'Profile & Vehicles' },
                            ].map(({ icon, label, sub }) => (
                                <div
                                    key={label}
                                    style={styles.quadCard}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,208,6,0.4)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                                >
                                    <span className="material-symbols-outlined" style={styles.quadIcon}>{icon}</span>
                                    <p style={styles.quadLabel}>{label}</p>
                                    <p style={styles.quadSub}>{sub}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* ── Footer ── */}
            <footer style={styles.footer}>
                <div style={styles.footerCopy}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>copyright</span>
                    2024 ParkPortal Systems Inc.
                </div>
                <div style={styles.footerLinks}>
                    {['TERMS', 'PRIVACY', 'COOKIES'].map(item => (
                        <a key={item} href="#" style={styles.footerLink}
                            onMouseEnter={e => (e.target.style.color = '#f9d006')}
                            onMouseLeave={e => (e.target.style.color = '#334155')}>
                            {item}
                        </a>
                    ))}
                </div>
            </footer>

            {/* Responsive style override */}
            <style>{`
                @media (max-width: 768px) {
                    .hide-mobile { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default UserParkingInfo;
