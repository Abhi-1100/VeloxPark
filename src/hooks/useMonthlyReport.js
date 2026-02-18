/**
 * useMonthlyReport.js
 * -------------------
 * Generates a monthly PDF report from the analytics data.
 * Uses the same jsPDF + autoTable stack as useExportPDF.
 *
 * PROPS (via params object):
 *   monthlyData     — processedData filtered to current month
 *   analyticsStats  — { totalRevenue, occupancyRate, activeSessions, avgTurnoverHrs }
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateTime, formatDuration } from '../utils/parkingUtils';

const useMonthlyReport = ({ monthlyData, analyticsStats }) => {
    const handleGenerateReport = () => {
        try {
            const now   = new Date();
            const month = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            // ── Title block ────────────────────────────────────────────────────
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.text('SmartPark — Monthly Analytics Report', 14, 18);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Period: ${month}`, 14, 26);
            doc.text(`Generated: ${now.toLocaleString()}`, 14, 32);

            // ── KPI summary block ──────────────────────────────────────────────
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.text('Monthly KPI Summary', 14, 42);

            autoTable(doc, {
                startY: 46,
                head: [['Metric', 'Value']],
                body: [
                    ['Total Revenue',    `Rs. ${analyticsStats.totalRevenue.toLocaleString('en-IN')}`],
                    ['Occupancy Rate',   `${analyticsStats.occupancyRate}%`],
                    ['Active Sessions',  String(analyticsStats.activeSessions)],
                    ['Avg. Turnover',    `${analyticsStats.avgTurnoverHrs} hrs`],
                    ['Total Records',    String(monthlyData.length)],
                ],
                theme: 'grid',
                headStyles: { fillColor: [249, 208, 6], textColor: [0, 0, 0], fontStyle: 'bold' },
                bodyStyles: { textColor: [30, 30, 30], fontSize: 9 },
                columnStyles: { 0: { fontStyle: 'bold' } },
                tableWidth: 120,
            });

            // ── Vehicle records table ──────────────────────────────────────────
            const afterKPI = doc.lastAutoTable?.finalY ?? 90;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.text('Vehicle Records', 14, afterKPI + 10);

            const tableData = monthlyData.map((v) => [
                v.plate,
                formatDateTime(v.entry),
                v.exit ? formatDateTime(v.exit) : '-',
                formatDuration(v.duration),
                `Rs. ${v.amount || 0}`,
                v.status,
            ]);

            autoTable(doc, {
                startY: afterKPI + 14,
                head: [['Plate', 'Entry', 'Exit', 'Duration', 'Amount', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [249, 208, 6], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 9 },
                bodyStyles: { textColor: [30, 30, 30], fontSize: 8, fillColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                columnStyles: { 0: { fontStyle: 'bold' }, 5: { halign: 'center' } },
                didDrawPage: (data) => {
                    const pw = doc.internal.pageSize.getWidth();
                    const ph = doc.internal.pageSize.getHeight();
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(
                        `Page ${data.pageNumber}  |  SmartPark Analytics`,
                        pw / 2, ph - 8, { align: 'center' }
                    );
                },
            });

            doc.save(`smartpark-monthly-report-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf`);
        } catch (err) {
            console.error('Monthly Report Error:', err);
            alert(`Report generation failed: ${err.message}`);
        }
    };

    return { handleGenerateReport };
};

export default useMonthlyReport;
