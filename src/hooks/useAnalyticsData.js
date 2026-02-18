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

/** Returns a Date set to noon (avoids DST/UTC-offset edge cases) for `daysAgo` days before today. */
const dayAtNoon = (daysAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(12, 0, 0, 0); // noon — safe from any UTC-offset shift
    return d;
};

/**
 * Local yyyy-mm-dd string — uses LOCAL date parts, NOT toISOString() which
 * converts to UTC and shifts the date by -5:30 in IST (causing wrong day labels).
 */
const toLocalDateStr = (d) => {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
};

/** Short day label (MON…SUN) for a Date. */
const dayLabel = (d) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];

/**
 * Returns { start, end, barCount, barLabel(i), barDate(i), prevBarDate(i) }
 * for the selected period string.
 * i=0 is always the OLDEST day, i=barCount-1 is TODAY → ascending order.
 */
const getPeriodWindow = (period) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    if (period === 'Last 30 Days') {
        // i=0 → 29 days ago (oldest), i=29 → today (newest)
        const start = dayAtNoon(29);
        return {
            start,
            end: now,
            barCount: 30,
            // Show date number every 4 bars so labels don't crowd
            barLabel: (i) => {
                const d = dayAtNoon(29 - i);
                return i % 4 === 0 ? String(d.getDate()) : '';
            },
            barDate:     (i) => dayAtNoon(29 - i),
            prevBarDate: (i) => dayAtNoon(59 - i),
        };
    }

    if (period === 'Monthly View') {
        const now2 = new Date();
        const daysElapsed = now2.getDate(); // 1-based day of month
        // i=0 → day 1 of month, i=daysElapsed-1 → today
        return {
            start: new Date(now2.getFullYear(), now2.getMonth(), 1, 12, 0, 0),
            end:   now,
            barCount: daysElapsed,
            barLabel: (i) => (i % 4 === 0 ? String(i + 1) : ''),
            barDate:     (i) => new Date(now2.getFullYear(), now2.getMonth(),     i + 1, 12, 0, 0),
            prevBarDate: (i) => new Date(now2.getFullYear(), now2.getMonth() - 1, i + 1, 12, 0, 0),
        };
    }

    // Default: Last 7 Days — i=0 → 6 days ago, i=6 → today
    const start = dayAtNoon(6);
    return {
        start,
        end: now,
        barCount: 7,
        barLabel: (i) => dayLabel(dayAtNoon(6 - i)),
        barDate:     (i) => dayAtNoon(6 - i),
        prevBarDate: (i) => dayAtNoon(13 - i),
    };
};

/** Sums revenue for vehicles whose exit falls on the same LOCAL calendar day as `targetDate`. */
const revenueForDay = (data, targetDate) => {
    const target = toLocalDateStr(targetDate);
    return data
        .filter((v) => {
            if (!v.exit) return false;
            const d = parseToDate(v.exit);
            return d && toLocalDateStr(d) === target;
        })
        .reduce((s, v) => s + (v.amount || 0), 0);
};

/** Filters processedData to vehicles whose ENTRY falls within [start, end]. */
const filterByWindow = (data, start, end) =>
    data.filter((v) => {
        const d = parseToDate(v.entry);
        // Compare using local date strings to avoid UTC-offset issues
        if (!d) return false;
        const ds = toLocalDateStr(d);
        return ds >= toLocalDateStr(start) && ds <= toLocalDateStr(end);
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
        const barChartData = Array.from({ length: barCount }, (_, i) => {
            const d = barDate(i);
            // Human-readable date for tooltip: "18 Feb"
            const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            return {
                label:    barLabel(i),
                date:     dateStr,          // ← always set, used by tooltip
                current:  revenueForDay(processedData, d),
                previous: revenueForDay(processedData, prevBarDate(i)),
            };
        });

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
        const periodLabel = `${toLocalDateStr(start)} → ${toLocalDateStr(end)}`;

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
