/**
 * useExportPDF.js
 * ---------------
 * Custom hook that encapsulates the PDF export handler.
 *
 * WHY: The handleExportPDF function (originally ~80 lines inside AdminDashboard)
 * is pure business logic with no UI concerns.  Extracting it here keeps
 * AdminDashboard.jsx clean and makes the export logic independently testable.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 150-227):
 *   • handleExportPDF — jsPDF + autoTable report generation
 *
 * FUNCTIONALITY: 100% identical to the original; only the location changed.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateTime, formatDuration } from '../utils/parkingUtils';

/**
 * @param {object} params
 * @param {Array}  params.visibleData  The currently filtered vehicle records.
 * @param {string} params.dateFilter   The active date filter string (yyyy-mm-dd).
 * @returns {{ handleExportPDF: function }}
 */
const useExportPDF = ({ visibleData, dateFilter }) => {
    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            // Title
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.text('Smart Parking - Vehicle Records Report', 14, 18);

            // Subtitle
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

            if (dateFilter) {
                const label = new Date(
                    dateFilter + 'T00:00:00'
                ).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                });
                doc.text(`Date Filter: ${label}`, 14, 32);
            }

            // Table data — use "Rs." instead of "₹" to avoid font encoding issues
            const tableData = visibleData.map((v) => [
                v.plate,
                formatDateTime(v.entry),
                v.exit ? formatDateTime(v.exit) : '-',
                formatDuration(v.duration),
                `Rs. ${v.amount || 0}`,
                v.status,
            ]);

            // jspdf-autotable v5: call autoTable(doc, options) — NOT doc.autoTable()
            autoTable(doc, {
                startY: dateFilter ? 38 : 32,
                head: [
                    [
                        'Plate Number',
                        'Entry Time',
                        'Exit Time',
                        'Duration',
                        'Amount',
                        'Status',
                    ],
                ],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [249, 208, 6],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    fontSize: 10,
                    halign: 'center',
                },
                bodyStyles: {
                    textColor: [30, 30, 30],
                    fontSize: 9,
                    fillColor: [255, 255, 255],
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
                columnStyles: {
                    0: { fontStyle: 'bold' },
                    5: { halign: 'center' },
                },
                didDrawPage: (data) => {
                    const pageWidth  = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(
                        `Page ${data.pageNumber}  |  Smart Parking System`,
                        pageWidth / 2,
                        pageHeight - 8,
                        { align: 'center' }
                    );
                },
            });

            doc.save(`parking-report-${Date.now()}.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert(`PDF generation failed: ${error.message}`);
        }
    };

    return { handleExportPDF };
};

export default useExportPDF;
