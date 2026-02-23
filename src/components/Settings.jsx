/**
 * Settings.jsx
 * ------------
 * Admin settings page for managing parking rates and system configuration.
 * Allows updating hourly rates for different vehicle types.
 * New rates only apply to future entries - existing records keep their original rates.
 */

import { useState, useEffect } from 'react';
import { getCurrentRates, updateRates } from '../services/settingsService';
import { logoutAdmin } from '../services/firebaseService';
import Sidebar from './dashboard/Sidebar';
import './Settings.css';

const Settings = ({ user }) => {
    const [rates, setRates] = useState({
        car: 20,
        bike: 10,
        truck: 50,
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'
    const [permissions, setPermissions] = useState({
        guestParking: true,
        membershipDiscounts: true,
        autoVerifyPlates: false,
    });
    const [notifications, setNotifications] = useState({
        systemAlerts: true,
        vipArrival: false,
    });

    // Load current rates on mount
    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        try {
            const currentRates = await getCurrentRates();
            setRates({
                car: currentRates.car || 20,
                bike: currentRates.bike || 10,
                truck: currentRates.truck || 50,
            });
        } catch (error) {
            console.error('Failed to load rates:', error);
        }
    };

    const handleRateChange = (type, value) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setRates(prev => ({
                ...prev,
                [type]: numValue
            }));
        }
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        setLoading(true);
        
        try {
            await updateRates(rates);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Failed to save rates:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (key) => {
        setPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const adminName = user?.email?.split('@')[0] || 'Admin';

    return (
        <div className="settings-root">
            {/* Sidebar */}
            <Sidebar adminName={adminName} onLogout={logoutAdmin} activePage="settings" />

            {/* Main Content */}
            <main className="settings-main">
                {/* Header */}
                <header className="settings-header">
                    <div className="settings-header-content">
                        <div className="settings-header-left">
                            <div className="settings-logo">
                                <span className="material-symbols-outlined">local_parking</span>
                            </div>
                            <h1 className="settings-title">
                                SMART<span className="settings-title-accent">PARKING</span> ADMIN
                            </h1>
                        </div>
                        <div className="settings-header-right">
                            <nav className="settings-nav">
                                <a href="/admin" className="settings-nav-link">Dashboard</a>
                                <a href="/admin/analytics" className="settings-nav-link">Analytics</a>
                                <a href="#" className="settings-nav-link">Users</a>
                                <a href="#" className="settings-nav-link settings-nav-active">Settings</a>
                            </nav>
                            <div className="settings-header-actions">
                                <div className="settings-search">
                                    <span className="material-symbols-outlined settings-search-icon">search</span>
                                    <input type="text" placeholder="Global search..." className="settings-search-input" />
                                </div>
                                <button className="settings-notification-btn">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="settings-notification-dot"></span>
                                </button>
                                <div className="settings-avatar">
                                    <img 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL2LbOqquk7olPSDlAPgErZSjgIk1zKzE2aLWjx_QqMpQYG8jZieJmVk4Y1rCyObonPi7MFqk0AoeNAYGVqysioY5NUMbJ7BNKecWe8kIF9YRrm8S7-z1bsfQNq9bL-eal17HEoBK9eBZEAWDkc53BKpJPuQcG54heQF7QZYOmzfTrDYBWZBS3dK4UlbPveMVgbDwPc-LeQtzOfcXMt6Gx8gmrZy-Ug3fHV90V8-GdY7DWAWNBPIV8WvwG9APfFn97PhcT1gKEvnE" 
                                        alt="Admin Profile" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <div className="settings-body">
                    {/* Left Sidebar Navigation */}
                    <aside className="settings-sidebar">
                        <h2 className="settings-sidebar-heading">CONFIGURATION</h2>
                        <nav className="settings-sidebar-nav">
                            <button className="settings-sidebar-item settings-sidebar-item-active">
                                <span className="material-symbols-outlined">manage_accounts</span>
                                <span>User & Access</span>
                            </button>
                            <button className="settings-sidebar-item">
                                <span className="material-symbols-outlined">payments</span>
                                <span>Pricing</span>
                            </button>
                            <button className="settings-sidebar-item">
                                <span className="material-symbols-outlined">notifications_active</span>
                                <span>Notifications</span>
                            </button>
                            <button className="settings-sidebar-item">
                                <span className="material-symbols-outlined">security</span>
                                <span>Security</span>
                            </button>
                            <button className="settings-sidebar-item">
                                <span className="material-symbols-outlined">group</span>
                                <span>Staff Management</span>
                            </button>
                        </nav>

                        <div className="settings-health-card">
                            <p className="settings-health-label">SYSTEM HEALTH</p>
                            <div className="settings-health-status">
                                <span className="settings-health-text">OPERATIONAL</span>
                                <div className="settings-health-dot"></div>
                            </div>
                            <p className="settings-health-time">Last heartbeat: 2m ago</p>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="settings-content">
                        {/* Page Header */}
                        <div className="settings-page-header">
                            <div>
                                <h2 className="settings-page-title">User Settings & Access Control</h2>
                                <p className="settings-page-subtitle">Configure global user permissions and security protocols.</p>
                            </div>
                            <button 
                                className="settings-save-btn" 
                                onClick={handleSave}
                                disabled={loading}
                            >
                                <span className="material-symbols-outlined">
                                    {saveStatus === 'saving' ? 'sync' : saveStatus === 'success' ? 'check_circle' : 'save'}
                                </span>
                                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save All Changes'}
                            </button>
                        </div>

                        {/* User Permissions Section */}
                        <section className="settings-section">
                            <div className="settings-section-header">
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                <h3>USER PERMISSIONS</h3>
                            </div>
                            <div className="settings-section-body">
                                <div className="settings-permission-item">
                                    <div className="settings-permission-info">
                                        <span className="material-symbols-outlined">person_add</span>
                                        <div>
                                            <p className="settings-permission-title">Allow Guest Parking</p>
                                            <p className="settings-permission-desc">Enable non-registered users to book parking spots via the terminal</p>
                                        </div>
                                    </div>
                                    <label className="settings-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={permissions.guestParking}
                                            onChange={() => togglePermission('guestParking')}
                                        />
                                        <span className="settings-toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="settings-permission-item">
                                    <div className="settings-permission-info">
                                        <span className="material-symbols-outlined">card_membership</span>
                                        <div>
                                            <p className="settings-permission-title">Enable Membership Discounts</p>
                                            <p className="settings-permission-desc">Automatically apply tiered pricing for verified gold and silver members</p>
                                        </div>
                                    </div>
                                    <label className="settings-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={permissions.membershipDiscounts}
                                            onChange={() => togglePermission('membershipDiscounts')}
                                        />
                                        <span className="settings-toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="settings-permission-item">
                                    <div className="settings-permission-info">
                                        <span className="material-symbols-outlined">license</span>
                                        <div>
                                            <p className="settings-permission-title">Auto-Verify License Plates</p>
                                            <p className="settings-permission-desc">Use AI recognition to bypass manual gate entry verification for known users</p>
                                        </div>
                                    </div>
                                    <label className="settings-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={permissions.autoVerifyPlates}
                                            onChange={() => togglePermission('autoVerifyPlates')}
                                        />
                                        <span className="settings-toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* User Security Section */}
                        <section className="settings-section">
                            <div className="settings-section-header">
                                <span className="material-symbols-outlined">lock_person</span>
                                <h3>USER SECURITY</h3>
                            </div>
                            <div className="settings-section-body">
                                <div className="settings-security-grid">
                                    <div className="settings-security-card">
                                        <div>
                                            <p className="settings-security-title">Force Password Reset</p>
                                            <p className="settings-security-desc">Compel all users to update their credentials on next login. Recommended for security audits.</p>
                                        </div>
                                        <button className="settings-security-btn-outline">
                                            Initialize Reset
                                        </button>
                                    </div>
                                    <div className="settings-security-card">
                                        <div>
                                            <p className="settings-security-title">Manage API Keys</p>
                                            <p className="settings-security-desc">Provision and revoke access tokens for 3rd party navigation integrations.</p>
                                        </div>
                                        <button className="settings-security-btn-solid">
                                            Configure Endpoints
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hourly Rate Configuration Section */}
                        <section className="settings-section">
                            <div className="settings-section-header">
                                <span className="material-symbols-outlined">payments</span>
                                <h3>HOURLY RATE CONFIGURATION</h3>
                            </div>
                            <div className="settings-section-body">
                                <div className="settings-rate-grid">
                                    <div className="settings-rate-card">
                                        <div className="settings-rate-header">
                                            <span className="material-symbols-outlined">directions_car</span>
                                            <span className="settings-rate-label">STANDARD CAR</span>
                                        </div>
                                        <div className="settings-rate-input-wrapper">
                                            <span className="settings-rate-currency">₹</span>
                                            <input 
                                                type="number" 
                                                className="settings-rate-input"
                                                value={rates.car}
                                                onChange={(e) => handleRateChange('car', e.target.value)}
                                                step="0.5"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="settings-rate-card">
                                        <div className="settings-rate-header">
                                            <span className="material-symbols-outlined">two_wheeler</span>
                                            <span className="settings-rate-label">MOTORCYCLE</span>
                                        </div>
                                        <div className="settings-rate-input-wrapper">
                                            <span className="settings-rate-currency">₹</span>
                                            <input 
                                                type="number" 
                                                className="settings-rate-input"
                                                value={rates.bike}
                                                onChange={(e) => handleRateChange('bike', e.target.value)}
                                                step="0.5"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="settings-rate-card">
                                        <div className="settings-rate-header">
                                            <span className="material-symbols-outlined">local_shipping</span>
                                            <span className="settings-rate-label">HEAVY TRUCK</span>
                                        </div>
                                        <div className="settings-rate-input-wrapper">
                                            <span className="settings-rate-currency">₹</span>
                                            <input 
                                                type="number" 
                                                className="settings-rate-input"
                                                value={rates.truck}
                                                onChange={(e) => handleRateChange('truck', e.target.value)}
                                                step="0.5"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Staff Notifications Section */}
                        <section className="settings-section">
                            <div className="settings-section-header">
                                <span className="material-symbols-outlined">notifications_active</span>
                                <h3>STAFF NOTIFICATIONS</h3>
                            </div>
                            <div className="settings-section-body">
                                <div className="settings-notification-item">
                                    <div>
                                        <p className="settings-notification-title">System Performance Alerts</p>
                                        <p className="settings-notification-desc">Critical hardware and sensor malfunctions</p>
                                    </div>
                                    <label className="settings-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={notifications.systemAlerts}
                                            onChange={() => toggleNotification('systemAlerts')}
                                        />
                                        <span className="settings-toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="settings-notification-item">
                                    <div>
                                        <p className="settings-notification-title">VIP Arrival Notifications</p>
                                        <p className="settings-notification-desc">Alert staff when gold members enter the lot</p>
                                    </div>
                                    <label className="settings-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={notifications.vipArrival}
                                            onChange={() => toggleNotification('vipArrival')}
                                        />
                                        <span className="settings-toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <footer className="settings-footer">
                    <p>SMARTPARKING © 2024 ENTERPRISE MANAGEMENT SUITE</p>
                </footer>
            </main>
        </div>
    );
};

export default Settings;
