import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { formatDateTime, formatDuration } from '../utils/parkingUtils';
import UserPaymentSuccessMobile from './user/UserPaymentSuccessMobile';
import UserPaymentSuccessDesktop from './user/UserPaymentSuccessDesktop';

const UserPaymentSuccess = () => {
  const location = useLocation();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const state = location.state;
  const vehicleData = state?.vehicleData;
  const upiConfig = state?.upiConfig;

  // Generate receipt ID
  const receiptId = `VX-${String(Date.now()).slice(-5)}`;

  // PDF Receipt Download
  const downloadReceipt = () => {
    if (!vehicleData) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a5' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    // Dark background
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, W, H, 'F');

    // Top yellow stripe
    doc.setFillColor(255, 215, 0);
    doc.rect(0, 0, W, 6, 'F');

    // Brand name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 215, 0);
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

    doc.setFillColor(255, 215, 0);
    doc.roundedRect(W - 100, 84, 54, 18, 3, 3, 'F');
    doc.setTextColor(10, 10, 10);
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
      ['Total Duration', formatDuration(vehicleData.duration) || '—'],
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

    doc.setFillColor(255, 215, 0);
    doc.roundedRect(40, y + 16, W - 80, 48, 5, 5, 'F');
    doc.setTextColor(10, 10, 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text(`TOTAL PAID: ₹${vehicleData.amount || 0}`, W / 2, y + 46, { align: 'center' });

    // Rating
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`, W / 2, y + 82, {
      align: 'center',
    });

    // Footer text
    doc.setFontSize(8);
    doc.text(`Receipt: ${receiptId}  |  ${new Date().toLocaleString('en-IN')}`, W / 2, y + 100, {
      align: 'center',
    });
    doc.text('Thank you for parking with VeloxPark!', W / 2, y + 116, { align: 'center' });

    // Bottom stripe
    doc.setFillColor(255, 215, 0);
    doc.rect(0, H - 6, W, 6, 'F');

    doc.save(`VeloxPark_Receipt_${vehicleData.plate}_${receiptId}.pdf`);
  };

  const sharedProps = {
    vehicleData,
    upiConfig,
    receiptId,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    onDownloadReceipt: downloadReceipt,
  };

  return (
    <>
      {/* Mobile view (< 1024px) */}
      <div className="block lg:hidden">
        <UserPaymentSuccessMobile {...sharedProps} />
      </div>

      {/* Desktop view (>= 1024px) */}
      <div className="hidden lg:block">
        <UserPaymentSuccessDesktop {...sharedProps} />
      </div>
    </>
  );
};

export default UserPaymentSuccess;
