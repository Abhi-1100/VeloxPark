/**
 * useAnalyticsData.js
 * -------------------
 * Derives all analytics metrics from Firebase processedData.
 * The `period` selector NOW actually drives every metric:
 *   "Last 7 Days"  → last 7 calendar days
 *   "Last 30 Days" → last 30 calendar days
 *   "Monthly View" → current calendar month (Jan 1 → today)
 *
 * All KPI cards, bar chart, duration buckets, and PDF data
 * are filtered to the selected window.
 */

import { useState, useEffect, useMemo } from 'react';
import { parseToDate } from '../utils/parkingUtils';
import {
    subscribeToNumberplates,
    loadLocalFallback,
} from '../services/firebaseService';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Returns a Date set to midnight (start of day) for `daysAgo` days before today. */
const startOfDayOffset = (daysAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0, 0, 0, 0);
    return d;
};

/** yyyy-mm-dd string for a Date. */
const toDateStr = (d) => d.toISOString().split('T')[0];

/** Short day label (MON…SUN) for a Date. */
const dayLabel = (d) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];

/**
 * Returns { start: Date, end: Date, barCount, barLabel(i) }
 * for the selected period string.
 */
const getPeriodWindow = (period) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // end of today

    if (period === 'Last 30 Days') {
        const start = startOfDayOffset(29);
        return {
            start,
            end: now,
            barCount: 30,
            barLabel: (i) => {
                const d = startOfDayOffset(29 - i);
                // Show date number every ~5 bars to avoid crowding
                return i % 5 === 0 ? String(d.getDate()) : '';
            },
            barDate: (i) => startOfDayOffset(29 - i),
            prevBarDate: (i) => startOfDayOffset(59 - i),
        };
    }

    if (period === 'Monthly View') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const daysInMonth = now.getDate(); // days elapsed so far
        return {
            start,
            end: now,
            barCount: daysInMonth,
            barLabel: (i) => (i % 5 === 0 ? String(i + 1) : ''),
            barDate: (i) => new Date(now.getFullYear(), now.getMonth(), i + 1, 12, 0, 0),
            prevBarDate: (i) => new Date(now.getFullYear(), now.getMonth() - 1, i + 1, 12, 0, 0),
        };
    }

    // Default: Last 7 Days
    const start = startOfDayOffset(6);
    return {
        start,
        end: now,
        barCount: 7,
        barLabel: (i) => {
            const d = startOfDayOffset(6 - i);
            return dayLabel(d);
        },
        barDate: (i) => startOfDayOffset(6 - i),
        prevBarDate: (i) => startOfDayOffset(13 - i),
    };
};

/** Sums revenue for vehicles whose exit falls on the same calendar day as `targetDate`. */
const revenueForDay = (data, targetDate) => {
    const target = toDateStr(targetDate);
    return data
        .filter((v) => {
            if (!v.exit) return false;
            const d = parseToDate(v.exit);
            return d && toDateStr(d) === target;
        })
        .reduce((s, v) => s + (v.amount || 0), 0);
};

/** Filters processedData to vehicles whose ENTRY falls within [start, end]. */
const filterByWindow = (data, start, end) =>
    data.filter((v) => {
        const d = parseToDate(v.entry);
        return d && d >= start && d <= end;
    });

// ── Hook ───────────────────────────────────────────────────────────────────────

const useAnalyticsData = () => {
    const [processedData, setProcessedData] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [period, setPeriod]               = useState('Last 7 Days');

    // ── Firebase subscription ─────────────────────────────────────────────────
    useEffect(() => {
        const handleSuccess = ({ processedData: pd }) => {
            setProcessedData(pd);
            setLoading(false);
        };
        const handleError = () => {
            loadLocalFallback(
                ({ processedData: pd }) => { setProcessedData(pd); setLoading(false); },
                () => setLoading(false)
            );
        };
        const unsub = subscribeToNumberplates(handleSuccess, handleError);
        return unsub;
    }, []);

    // ── Derived analytics — recomputes when data OR period changes ────────────
    const analytics = useMemo(() => {
        const empty = {
            analyticsStats: { totalRevenue: 0, occupancyRate: 0, activeSessions: 0, avgTurnoverHrs: 0 },
            barChartData: [],
            durationBuckets: [],
            avgDurationHrs: 0,
            periodData: [],
            periodLabel: '',
        };

        if (!processedData.length) return empty;

        // ── Window boundaries ────────────────────────────────────────────────
        const window = getPeriodWindow(period);
        const { start, end, barCount, barLabel, barDate, prevBarDate } = window;

        // ── Data filtered to the selected window ─────────────────────────────
        const periodData = filterByWindow(processedData, start, end);

        // ── Bar chart: revenue per bar slot (current vs previous period) ─────
        const barChartData = Array.from({ length: barCount }, (_, i) => ({
            label:    barLabel(i),
            current:  revenueForDay(processedData, barDate(i)),
            previous: revenueForDay(processedData, prevBarDate(i)),
        }));

        // ── Total revenue for the period (sum of current bars) ───────────────
        const totalRevenue = barChartData.reduce((s, b) => s + b.current, 0);

        // ── Active sessions (currently Parked — always live, not period-scoped) ──
        const activeSessions = processedData.filter((v) => v.status === 'Parked').length;

        // ── Occupancy rate: parked within window / total within window ────────
        const windowTotal  = periodData.length;
        const windowParked = periodData.filter((v) => v.status === 'Parked').length;
        const occupancyRate = windowTotal > 0
            ? Math.round((windowParked / windowTotal) * 100)
            : 0;

        // ── Average turnover: exited vehicles within window ───────────────────
        const exitedInWindow = periodData.filter(
            (v) => v.status === 'Exited' && v.duration
        );
        const avgTurnoverHrs = exitedInWindow.length > 0
            ? +(exitedInWindow.reduce(
                (s, v) => s + (v.duration.totalMinutes || 0), 0
              ) / exitedInWindow.length / 60).toFixed(1)
            : 0;

        // ── Duration buckets (scoped to window) ───────────────────────────────
        const bucketTotal = exitedInWindow.length || 1;
        const short  = exitedInWindow.filter((v) => v.duration.totalMinutes < 120).length;
        const medium = exitedInWindow.filter(
            (v) => v.duration.totalMinutes >= 120 && v.duration.totalMinutes < 360
        ).length;
        const long   = exitedInWindow.filter((v) => v.duration.totalMinutes >= 360).length;

        const avgDurationHrs = exitedInWindow.length > 0
            ? +(exitedInWindow.reduce(
                (s, v) => s + (v.duration.totalMinutes || 0), 0
              ) / exitedInWindow.length / 60).toFixed(1)
            : 0;

        const durationBuckets = [
            { label: 'Short Stay (< 2h)',  pct: Math.round((short  / bucketTotal) * 100), color: '#f9d006' },
            { label: 'Medium Stay (2–6h)', pct: Math.round((medium / bucketTotal) * 100), color: '#334155' },
            { label: 'Long Stay (> 6h)',   pct: Math.round((long   / bucketTotal) * 100), color: '#475569' },
        ];

        // ── Human-readable period label for the header subtitle ───────────────
        const periodLabel = `${toDateStr(start)} → ${toDateStr(end)}`;

        return {
            analyticsStats: { totalRevenue, occupancyRate, activeSessions, avgTurnoverHrs },
            barChartData,
            durationBuckets,
            avgDurationHrs,
            periodData,       // used by PDF report
            periodLabel,
        };
    }, [processedData, period]); // ← period is now a real dependency

    return { ...analytics, period, setPeriod, loading, processedData };
};

export default useAnalyticsData;
