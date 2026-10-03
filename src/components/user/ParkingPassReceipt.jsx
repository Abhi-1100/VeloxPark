import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { useAuth } from '../../context/useAuth';
import './ParkingPassReceipt.css';

export default function ParkingPassReceipt({
  booking,
  vehicleData,
  payment,
  selectedMethod,
  receiptId: propReceiptId,
  onReturn,
  onViewMap,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  // Normalize source data
  const data = booking || vehicleData || {};

  // Formatted Pass / Receipt ID
  const passId =
    propReceiptId ||
    (data.id && typeof data.id === 'string' && data.id.length > 5
      ? `VX-${data.id.slice(-6).toUpperCase()}`
      : `VX-${String(Date.now()).slice(-6)}`);

  // Parking station & location
  const rawAddress = data.address || data.stationName || 'Station Road Covered Deck (Vadodara)';
  let stationName = data.stationName || '';
  let stationLocation = '';

  if (rawAddress.includes('(')) {
    const parts = rawAddress.split('(');
    stationName = stationName || parts[0].trim();
    stationLocation = parts[1].replace(')', '').trim() + ', Gujarat';
  } else {
    stationName = stationName || rawAddress;
    stationLocation = data.city ? `${data.city}, Gujarat` : 'Vadodara, Gujarat';
  }

  // Amount
  const amountVal = Number(data.amount || 120.0).toFixed(2);

  // Times
  const entryTime = data.entryTime || data.entry || '11:15 AM';
  const exitTime = data.exitTime || data.exit || '01:15 PM';

  // Duration
  let durationDisplay = '2h 00m';
  if (data.duration) {
    if (typeof data.duration === 'number') {
      const hrs = Math.floor(data.duration / 60);
      const mins = data.duration % 60;
      durationDisplay = `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : '00m'}`;
    } else {
      durationDisplay = String(data.duration);
    }
  }

  // Vehicle Plate
  const vehiclePlate =
    data.plate ||
    data.vehiclePlate ||
    (Array.isArray(user?.vehiclePlates) && user.vehiclePlates[0]) ||
    'GJ 23 AB 1234';

  // Slot label
  const slotName =
    data.slotLabel ||
    (data.slotId ? `Slot ${data.slotId}` : 'Slot H1 221');

  // Today's date formatted (e.g. FRI, 02 OCT 2026)
  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  // Payment Method Display
  const methodKey = payment?.method || selectedMethod || data.paymentMethod || 'razorpay';
  let methodBrand = 'UPI';
  let methodTitle = 'UPI · Google Pay';
  let methodSub = 'Instant ANPR Verification';
  let methodPillCls = 'pay-pill-upi';

  if (methodKey === 'card') {
    methodBrand = 'VISA';
    methodTitle = 'Visa Card •••• 4242';
    methodSub = 'Expiry: 12/28 · Auth #9482';
    methodPillCls = 'pay-pill-card';
  } else if (methodKey === 'wallet') {
    methodBrand = 'WALLET';
    methodTitle = 'VeloxPark Wallet';
    methodSub = 'Auto-Deducted Balance';
    methodPillCls = 'pay-pill-wallet';
  } else if (methodKey === 'fastag') {
    methodBrand = 'FASTag';
    methodTitle = 'FASTag Auto-Debit';
    methodSub = 'NHAI Netc Linked';
    methodPillCls = 'pay-pill-fastag';
  } else {
    methodBrand = 'RAZORPAY';
    methodTitle = 'Razorpay · Google Pay / UPI';
    methodSub = `Txn: ${payment?.razorpayPaymentId || `rzp_live_${String(Date.now()).slice(-6)}`}`;
    methodPillCls = 'pay-pill-upi';
  }

  // QR Code payload
  const qrValue = `VELOXPARK-PASS:${passId}:${data.slotId || 'H1221'}:${vehiclePlate}`;

  // Download PDF Receipt
  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a5' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Top brand accent
      doc.setFillColor(254, 203, 53);
      doc.rect(0, 0, W, 8, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39);
      doc.text('VELOXPARK', W / 2, 46, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('OFFICIAL DIGITAL PARKING PASS & RECEIPT', W / 2, 62, { align: 'center' });

      // Pass ID and PAID chip
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text(`PASS ID: ${passId}`, 40, 96);

      doc.setFillColor(16, 185, 129);
      doc.roundedRect(W - 90, 82, 50, 18, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('PAID', W - 65, 94, { align: 'center' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.setLineDashPattern([3, 3], 0);
      doc.line(40, 110, W - 40, 110);
      doc.setLineDashPattern([], 0);

      // Rows
      const rows = [
        ['Parking Station', stationName],
        ['Station Location', stationLocation],
        ['Assigned Slot', slotName],
        ['Vehicle Plate', vehiclePlate],
        ['Entry Time', entryTime],
        ['Exit Time', exitTime],
        ['Duration', durationDisplay],
        ['Payment Method', methodTitle],
        ['Date Issued', todayDateStr],
      ];

      let y = 138;
      rows.forEach(([lbl, val]) => {
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(lbl, 40, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 24, 39);
        doc.text(String(val), W - 40, y, { align: 'right' });

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.5);
        doc.line(40, y + 8, W - 40, y + 8);
        y += 24;
      });

      // Total Paid Box
      y += 10;
      doc.setFillColor(254, 203, 53);
      doc.roundedRect(40, y, W - 80, 44, 6, 6, 'F');
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(`TOTAL AMOUNT PAID: ₹${amountVal}`, W / 2, y + 27, { align: 'center' });

      // Barrier Note
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Touchless barrier access authorized via high-speed ANPR camera.',
        W / 2,
        y + 68,
        { align: 'center' }
      );
      doc.text('Toll-free Helpdesk: 1800-233-VELOX  |  Gujarat Smart Mobility', W / 2, y + 82, {
        align: 'center',
      });

      doc.save(`VeloxPark_Pass_${passId}.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pay-success-container">
      {/* ── Top Rosette Success Icon (Reference Image 2) ── */}
      <div className="pay-rosette-badge" aria-hidden="true">
        <div className="pay-rosette-outer">
          <div className="pay-rosette-inner">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Headings */}
      <h2 className="pay-success-title">Payment Confirmed!</h2>
      <p className="pay-success-sub">
        Thank you! Your parking pass is active and barrier gate access has been authorized.
      </p>

      {/* ── Realistic Ticket Pass Voucher Card (Reference Images 2 & 3) ── */}
      <div className="pay-ticket-voucher">
        {/* Ticket Top Header Bar */}
        <div className="pay-ticket-top-bar">
          <div className="pay-ticket-station-badge">
            <span className="material-symbols-outlined pay-badge-car-icon">directions_car</span>
            <span className="pay-ticket-code">{slotName}</span>
          </div>
          <span className="pay-ticket-date-tag">{todayDateStr}</span>
        </div>

        {/* Parking Station & Location Section */}
        <div className="pay-ticket-station-block">
          <div className="pay-station-header-row">
            <div>
              <span className="pay-micro-tag">PARKING STATION</span>
              <h3 className="pay-station-name">{stationName}</h3>
            </div>
            <span className="pay-status-confirmed-pill">
              <span className="pay-pulse-dot" />
              CONFIRMED
            </span>
          </div>

          <div className="pay-station-loc-row">
            <span className="material-symbols-outlined pay-loc-pin">location_on</span>
            <span className="pay-station-loc-text">{stationLocation}</span>
          </div>
        </div>

        {/* ── Transit Route Timeline: Entry ── [Duration] ── Exit (Reference Image 3) ── */}
        <div className="pay-ticket-timeline-card">
          {/* Entry Column */}
          <div className="pay-timeline-col pay-timeline-entry">
            <span className="pay-timeline-lbl">ENTRY</span>
            <div className="pay-time-big-wrap">
              <span className="pay-time-big">{entryTime.split(' ')[0]}</span>
              <span className="pay-time-ampm">{entryTime.split(' ')[1] || 'AM'}</span>
            </div>
            <span className="pay-timeline-sub">Barrier Open</span>
          </div>

          {/* Center Connector */}
          <div className="pay-timeline-center">
            <div className="pay-timeline-track">
              <span className="pay-timeline-dot start" />
              <div className="pay-timeline-dashed-line" />
              <div className="pay-timeline-duration-pill">
                <span className="material-symbols-outlined">schedule</span>
                <span>{durationDisplay}</span>
              </div>
              <div className="pay-timeline-dashed-line" />
              <span className="pay-timeline-dot end" />
            </div>
            <span className="pay-timeline-status-pill">
              <span className="pay-dot-green" />
              On Time &amp; Reserved
            </span>
          </div>

          {/* Exit Column */}
          <div className="pay-timeline-col pay-timeline-exit">
            <span className="pay-timeline-lbl">EXIT</span>
            <div className="pay-time-big-wrap">
              <span className="pay-time-big">{exitTime.split(' ')[0]}</span>
              <span className="pay-time-ampm">{exitTime.split(' ')[1] || 'PM'}</span>
            </div>
            <span className="pay-timeline-sub">Grace +15m</span>
          </div>
        </div>

        {/* ── Ticket Cutouts / Notches Perforated Divider (Reference Image 2) ── */}
        <div className="pay-ticket-perforation-wrap">
          <div className="pay-ticket-notch left" />
          <div className="pay-ticket-perforation-line" />
          <div className="pay-ticket-notch right" />
        </div>

        {/* ── Receipt Key Details Strip ── */}
        <div className="pay-ticket-details-grid">
          <div className="pay-detail-tile">
            <span className="pay-detail-lbl">BILL / PASS NUMBER</span>
            <span className="pay-detail-val font-mono">{passId}</span>
          </div>

          <div className="pay-detail-tile text-right">
            <span className="pay-detail-lbl">VEHICLE PLATE</span>
            <div className="pay-mini-hsrp-plate">
              <span className="pay-mini-hsrp-ind">IND</span>
              <span className="pay-mini-hsrp-num">{vehiclePlate}</span>
            </div>
          </div>
        </div>

        {/* Amount Paid Highlight */}
        <div className="pay-amount-row">
          <div>
            <span className="pay-amount-lbl">TOTAL AMOUNT PAID</span>
            <span className="pay-amount-tax-hint">Inclusive of municipal parking fee &amp; GST</span>
          </div>
          <div className="pay-amount-price-wrap">
            <span className="pay-currency-sym">₹</span>
            <span className="pay-amount-price">{amountVal}</span>
          </div>
        </div>

        {/* ── Payment Method Box (Reference Image 2) ── */}
        <div className="pay-method-receipt-box">
          <div className="pay-method-receipt-top">
            <span className="pay-method-lbl">PAYMENT METHOD</span>
            <span className="pay-method-verified-tag">
              <span className="material-symbols-outlined">verified</span>
              Verified Paid
            </span>
          </div>

          <div className="pay-method-row">
            <div className="pay-method-badge-icon">
              <span className={`pay-method-badge-text ${methodPillCls}`}>{methodBrand}</span>
            </div>
            <div className="pay-method-info">
              <span className="pay-method-title">{methodTitle}</span>
              <span className="pay-method-sub">{methodSub}</span>
            </div>
          </div>
        </div>

        {/* ── Access QR Code & Barrier Scanner Box (Reference Images 1 & 3) ── */}
        <div className="pay-barrier-access-block">
          <div className="pay-barrier-info-col">
            <div className="pay-barrier-pill">
              <span className="material-symbols-outlined">sensor_occupied</span>
              <span>Barrier Gate 01 · Fast Lane</span>
            </div>
            <h4 className="pay-barrier-title">Touchless ANPR Entry</h4>
            <p className="pay-barrier-desc">
              Cameras scan your license plate for auto barrier lift. Alternatively, hold this QR
              code facing the gate scanner.
            </p>
          </div>

          <div className="pay-qr-wrapper">
            <div className="pay-qr-card">
              <QRCodeSVG value={qrValue} size={118} level="H" includeMargin={false} />
            </div>
            <span className="pay-qr-caption">Scan at barrier scanner</span>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="pay-success-actions">
        <button
          type="button"
          className="pay-btn-primary"
          onClick={() => (onReturn ? onReturn() : navigate('/dashboard'))}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Return to Dashboard</span>
        </button>

        <button
          type="button"
          className="pay-btn-secondary"
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          <span className="material-symbols-outlined">download</span>
          <span>{downloading ? 'Generating PDF…' : 'Download Receipt (PDF)'}</span>
        </button>

        <button
          type="button"
          className="pay-btn-secondary pay-btn-map"
          onClick={() => (onViewMap ? onViewMap() : navigate('/map'))}
        >
          <span className="material-symbols-outlined">map</span>
          <span>View on Live Map</span>
        </button>
      </div>
    </div>
  );
}
