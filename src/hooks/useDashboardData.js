/**
 * useDashboardData.js
 * -------------------
 * Custom hook that owns ALL dashboard state, Firebase subscription, and the
 * filter / stats derivation logic that previously lived inside AdminDashboard.
 *
 * WHY: Keeps AdminDashboard.jsx as a pure layout file.  Business logic is
 * testable in isolation and can be reused by other views without touching UI.
 *
 * WHAT WAS MOVED HERE (from AdminDashboard.jsx lines 19-145):
 *   • All useState declarations
 *   • useEffect #1 — Firebase subscription + local JSON fallback
 *   • useEffect #2 — filter / stats derivation
 *
 * FUNCTIONALITY: 100% identical to the original code; only the location changed.
 */

import { useState, useEffect } from 'react';
import { isSameDate, getTodayDateStr } from '../utils/parkingUtils';
import {
    subscribeToNumberplates,
    loadLocalFallback,
} from '../services/firebaseService';

const useDashboardData = () => {
    // ── State ──────────────────────────────────────────────────────────────────
    const [parkingData, setParkingData]       = useState([]);
    const [processedData, setProcessedData]   = useState([]);
    const [visibleData, setVisibleData]       = useState([]);
    const [searchTerm, setSearchTerm]         = useState('');
    const [dateFilter, setDateFilter]         = useState(getTodayDateStr());
    const [statusFilter, setStatusFilter]     = useState('All');
    const [loading, setLoading]               = useState(true);
    const [stats, setStats]                   = useState({
        total: 0,
        parked: 0,
        exited: 0,
        revenue: 0,
    });

    // ── Effect 1: Firebase subscription (unchanged logic) ──────────────────────
    useEffect(() => {
        const handleSuccess = ({ rawData, processedData: pd }) => {
            setParkingData(rawData);
            setProcessedData(pd);
            setLoading(false);
        };

        const handleError = () => {
            // Firebase failed — try local JSON fallback
            loadLocalFallback(
                ({ rawData, processedData: pd }) => {
                    setParkingData(rawData);
                    setProcessedData(pd);
                    setLoading(false);
                },
                () => setLoading(false)
            );
        };

        const unsubscribe = subscribeToNumberplates(handleSuccess, handleError);
        return unsubscribe; // calls off(numberplateRef) on unmount
    }, []);

    // ── Effect 2: Apply filters + compute stats (unchanged logic) ──────────────
    useEffect(() => {
        let filtered = processedData;

        if (dateFilter) {
            filtered = filtered.filter(
                (v) =>
                    isSameDate(v.entry, dateFilter) ||
                    isSameDate(v.exit, dateFilter)
            );
        }

        if (searchTerm) {
            filtered = filtered.filter((v) =>
                v.plate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter((v) => v.status === statusFilter);
        }

        setVisibleData(filtered);

        const parked  = filtered.filter((v) => v.status === 'Parked').length;
        const exited  = filtered.filter((v) => v.status === 'Exited').length;

        let revenue = 0;
        if (dateFilter) {
            revenue = filtered
                .filter((v) => v.exit && isSameDate(v.exit, dateFilter))
                .reduce((sum, v) => sum + (v.amount || 0), 0);
        } else {
            const today = getTodayDateStr();
            revenue = processedData
                .filter((v) => v.exit && isSameDate(v.exit, today))
                .reduce((sum, v) => sum + (v.amount || 0), 0);
        }

        setStats({ total: filtered.length, parked, exited, revenue });
    }, [processedData, searchTerm, dateFilter, statusFilter]);

    return {
        // Data
        parkingData,
        processedData,
        visibleData,
        loading,
        stats,
        // Filters (values + setters so components can read/write)
        searchTerm,
        setSearchTerm,
        dateFilter,
        setDateFilter,
        statusFilter,
        setStatusFilter,
    };
};

export default useDashboardData;
