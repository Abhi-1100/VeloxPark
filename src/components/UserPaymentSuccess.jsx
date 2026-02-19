import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatDateTime, formatDuration } from '../utils/parkingUtils';
import jsPDF from 'jspdf';

const UserPaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rating, setRating] = useState(4);
    const [hoverRating, setHoverRating] = useState(0);

    const state = location.state;

    // Guard
    if (!state || !state.vehicleData) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#231f0f', fontFamily: "'Space Grotesk', sans-serif", color: '#fff'
            }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#f9d006', display: 'block', marginBottom: '16px' }}>error_outline</span>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>No Session Data Found</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Please start a new search.</p>
                    <button onClick={() => navigate('/user')} style={{
                        background: '#f9d006', color: '#231f0f', border: 'none', borderRadius: '12px',
                        padding: '14px 32px', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>Go to Search</button>
                </div>
            </div>
        );
    }

    const { vehicleData, upiConfig } = state;

    // Generate a receipt ID based on timestamp
    const receiptId = `VX-${String(Date.now()).slice(-5)}`;

    // ── PDF Receipt Download ──
    const downloadReceipt = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a5' });
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();

        // Dark background
        doc.setFillColor(35, 31, 15);
        doc.rect(0, 0, W, H, 'F');

        // Top yellow stripe
        doc.setFillColor(249, 208, 6);
        doc.rect(0, 0, W, 6, 'F');

        // Brand name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(249, 208, 6);
        doc.text('VELOXPARK', W / 2, 52, { align: 'center' });

        // Subtitle
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.text('DIGITAL PARKING RECEIPT', W / 2, 70, { align: 'center' });

        // Receipt ID + PAID badge
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(receiptId, 50, 98);

        doc.setFillColor(249, 208, 6);
        doc.roundedRect(W - 100, 84, 54, 18, 3, 3, 'F');
        doc.setTextColor(35, 31, 15);
        doc.setFontSize(8);
        doc.text('PAID', W - 73, 97, { align: 'center' });

        // Dashed separator
        doc.setDrawColor(60, 55, 30);
        doc.setLineWidth(0.5);
        doc.setLineDashPattern([4, 4], 0);
        doc.line(50, 112, W - 50, 112);
        doc.setLineDashPattern([], 0);

        // Details
        const rows = [
            ['Vehicle Number', vehicleData.plate],
            ['Entry Time', formatDateTime(vehicleData.entry)],
            ['Exit Time', vehicleData.exit ? formatDateTime(vehicleData.exit) : '—'],
            ['Total Duration', formatDuration(vehicleData.duration)],
            ['Status', 'PAID'],
            ['UPI ID', upiConfig?.upiId || 'parking@upi'],
            ['Merchant', upiConfig?.upiName || 'VeloxPark'],
        ];

        let y = 136;
        doc.setFontSize(10);
        rows.forEach(([label, value]) => {
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text(label, 50, y);

            doc.setTextColor(240, 240, 240);
            doc.setFont('helvetica', 'bold');
            doc.text(String(value), W - 50, y, { align: 'right' });

            doc.setDrawColor(50, 46, 25);
            doc.setLineWidth(0.3);
            doc.line(50, y + 9, W - 50, y + 9);
            y += 28;
        });

        // Amount highlight
        doc.setLineDashPattern([4, 4], 0);
        doc.setDrawColor(60, 55, 30);
        doc.line(50, y + 6, W - 50, y + 6);
        doc.setLineDashPattern([], 0);

        doc.setFillColor(249, 208, 6);
        doc.roundedRect(40, y + 16, W - 80, 48, 5, 5, 'F');
        doc.setTextColor(35, 31, 15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(17);
        doc.text(`TOTAL PAID: ₹${vehicleData.amount || 0}`, W / 2, y + 46, { align: 'center' });

        // Rating
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(`Your Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`, W / 2, y + 82, { align: 'center' });

        // Footer text
        doc.setFontSize(8);
        doc.text(`Receipt: ${receiptId}  |  ${new Date().toLocaleString('en-IN')}`, W / 2, y + 100, { align: 'center' });
        doc.text('Thank you for parking with VeloxPark!', W / 2, y + 116, { align: 'center' });

        // Bottom stripe
        doc.setFillColor(249, 208, 6);
        doc.rect(0, H - 6, W, 6, 'F');

        doc.save(`VeloxPark_Receipt_${vehicleData.plate}_${receiptId}.pdf`);
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
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 80px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(35,31,15,0.6)', backdropFilter: 'blur(12px)',
                position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', background: '#f9d006', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#231f0f',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>local_parking</span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>VeloxPark</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {['Dashboard', 'My Bookings', 'Settings'].map(item => (
                            <a key={item} href="#" style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8', textDecoration: 'none' }}
                                onMouseEnter={e => (e.target.style.color = '#f9d006')}
                                onMouseLeave={e => (e.target.style.color = '#94a3b8')}>
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '2px solid rgba(249,208,6,0.25)', background: '#3a3318',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#f9d006', fontWeight: 700, fontSize: '14px',
                    }}>U</div>
                </div>
            </header>

            {/* ── Main ── */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '48px 16px',
                background: 'linear-gradient(180deg, rgba(249,208,6,0.05) 0%, transparent 40%)',
            }}>

                {/* Success Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(249,208,6,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#f9d006', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#231f0f', boxShadow: '0 8px 24px rgba(249,208,6,0.3)',
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '32px', fontVariationSettings: "'FILL' 1, 'wght' 700"
                            }}>check</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
                        Payment Successful
                    </h1>
                    <p style={{ color: '#64748b', fontWeight: 500, fontSize: '15px' }}>
                        Thank you for parking with us! Your session is now closed.
                    </p>
                </div>

                {/* ── Digital Receipt Card ── */}
                <div style={{ width: '100%', maxWidth: '448px', position: 'relative' }}>
                    {/* Glow */}
                    <div style={{
                        position: 'absolute', inset: '-4px',
                        background: 'linear-gradient(135deg, rgba(249,208,6,0.2), rgba(249,208,6,0.06))',
                        borderRadius: '16px', filter: 'blur(8px)', opacity: 0.4,
                        transition: 'opacity 0.3s', zIndex: 0,
                    }} />

                    <div style={{
                        position: 'relative', zIndex: 1,
                        background: '#2d2816', borderRadius: '14px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        overflow: 'hidden',
                    }}>
                        {/* Ticket Header */}
                        <div style={{
                            padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            borderBottom: '1px dashed rgba(255,255,255,0.1)',
                        }}>
                            <div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', fontWeight: 700 }}>
                                    Digital Parking Receipt
                                </span>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{receiptId}</h3>
                            </div>
                            <div style={{
                                background: 'rgba(249,208,6,0.12)', color: '#f9d006',
                                padding: '4px 12px', borderRadius: '6px',
                                fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                                border: '1px solid rgba(249,208,6,0.25)',
                            }}>
                                Paid
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div style={{ padding: '24px' }}>

                            {/* Location strip */}
                            <div style={{
                                display: 'flex', gap: '16px', alignItems: 'center',
                                background: 'rgba(0,0,0,0.2)', padding: '16px',
                                borderRadius: '10px', marginBottom: '24px',
                            }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '8px', flexShrink: 0,
                                    background: 'linear-gradient(135deg, #3a3318, #1e1a0a)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(249,208,6,0.15)',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#f9d006' }}>local_parking</span>
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        VeloxPark Facility
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                                        Smart Parking System
                                    </p>
                                </div>
                            </div>

                            {/* Session Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 16px', marginBottom: '24px' }}>
                                {[
                                    { label: 'Entry Time', value: formatDateTime(vehicleData.entry) },
                                    { label: 'Exit Time', value: vehicleData.exit ? formatDateTime(vehicleData.exit) : '—' },
                                    { label: 'Total Time', value: formatDuration(vehicleData.duration) || '—' },
                                    { label: 'Vehicle', value: vehicleData.plate },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                                            {label}
                                        </p>
                                        <p style={{ fontSize: '15px', fontWeight: 500, color: '#e2e8f0' }}>{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Total Amount */}
                            <div style={{
                                paddingTop: '20px',
                                borderTop: '1px dashed rgba(255,255,255,0.1)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Total Amount Paid</p>
                                <p style={{ fontSize: '32px', fontWeight: 800, color: '#f9d006', letterSpacing: '-1px' }}>
                                    ₹{vehicleData.amount || 0}
                                </p>
                            </div>
                        </div>

                        {/* Perforated bottom edge */}
                        <div style={{
                            height: '16px',
                            backgroundImage: 'radial-gradient(circle, #231f0f 2px, transparent 2.5px)',
                            backgroundSize: '12px 100%',
                            backgroundRepeat: 'repeat-x',
                            opacity: 0.5,
                        }} />
                    </div>
                </div>

                {/* ── Feedback Section ── */}
                <div style={{ marginTop: '48px', width: '100%', maxWidth: '448px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#64748b', marginBottom: '16px' }}>
                        Rate your experience
                    </p>

                    {/* Star Rating */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        {[1, 2, 3, 4, 5].map(star => {
                            const active = (hoverRating || rating) >= star;
                            return (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        width: '48px', height: '48px', borderRadius: '10px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: active ? '#f9d006' : 'rgba(255,255,255,0.04)',
                                        color: active ? '#231f0f' : '#475569',
                                        transition: 'all 0.15s ease',
                                        transform: active ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '24px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        star
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Download PDF */}
                        <button
                            onClick={downloadReceipt}
                            style={{
                                width: '100%', height: '56px',
                                background: '#f9d006', color: '#231f0f',
                                border: 'none', borderRadius: '12px',
                                fontSize: '15px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', cursor: 'pointer',
                                boxShadow: '0 8px 30px rgba(249,208,6,0.2)',
                                transition: 'box-shadow 0.2s, transform 0.15s',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,208,6,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(249,208,6,0.2)'; e.currentTarget.style.transform = 'none'; }}
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                            Download PDF Receipt
                        </button>

                        {/* Back to Dashboard */}
                        <button
                            onClick={() => navigate('/user')}
                            style={{
                                width: '100%', height: '56px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e2e8f0', borderRadius: '12px',
                                fontSize: '15px', fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', cursor: 'pointer',
                                transition: 'background 0.2s',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        >
                            Back to Dashboard
                        </button>
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

export default UserPaymentSuccess;
