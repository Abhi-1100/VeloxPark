/**
 * UsersPage.jsx
 * -------------
 * User Management dashboard for Velox OS.
 */
import { useState } from 'react';
import useDashboardData from '../hooks/useDashboardData';
import Sidebar from './dashboard/Sidebar';
import Topbar from './dashboard/Topbar';
import { logoutAdmin } from '../services/firebaseService';
import './UsersPage.css';

// Mock data for demonstration purposes
const MOCK_USERS = [
    { id: 'usr_001', name: 'Lead Administrator', email: 'admin@veloxpark.com', role: 'System Admin', status: 'Active', lastActive: 'Just now' },
    { id: 'usr_002', name: 'John Doe', email: 'jdoe@veloxpark.com', role: 'Operator', status: 'Active', lastActive: '2m ago' },
    { id: 'usr_003', name: 'Sarah Connor', email: 'sconnor@veloxpark.com', role: 'Technician', status: 'Active', lastActive: '4h ago' },
    { id: 'usr_004', name: 'Mike Ross', email: 'mross@veloxpark.com', role: 'Operator', status: 'Suspended', lastActive: '2d ago' },
];

const UsersPage = ({ user }) => {
    const { searchTerm, setSearchTerm, dateFilter, setDateFilter } = useDashboardData();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const adminName = user?.email?.split('@')[0] || 'Admin';

    return (
        <div className="pf-root" style={{ fontFamily: "'Space Grotesk', sans-serif", background: '#0a0a0a', color: '#e7e2d9' }}>
            <Sidebar
                adminName={adminName}
                onLogout={logoutAdmin}
                activePage="users"
                isMobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <main className="pf-main">
                <Topbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onOpenEntry={() => {}}
                    onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                />

                <div className="pf-body">
                    <header className="pf-usr-header">
                        <div>
                            <h1 className="pf-page-title">User Management</h1>
                            <p className="pf-page-subtitle">Total Users: {MOCK_USERS.length}</p>
                        </div>
                        <button className="pf-btn-ignition pf-add-usr-btn">
                            <span className="material-symbols-outlined pf-add-icon">person_add</span>
                            ADD NEW USER
                        </button>
                    </header>

                    <div className="pf-usr-table-container">
                        <table className="pf-usr-table">
                            <thead>
                                <tr>
                                    <th>USER</th>
                                    <th>ROLE</th>
                                    <th>SYSTEM ACCESS</th>
                                    <th>RECENT ACTIVITY</th>
                                    <th className="pf-text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_USERS.map((u, i) => (
                                    <tr key={u.id} className={i % 2 === 0 ? 'pf-row-even' : 'pf-row-odd'}>
                                        <td>
                                            <div className="pf-usr-info">
                                                <div className="pf-usr-avatar">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="pf-usr-name-wrap">
                                                    <span className="pf-usr-name">{u.name}</span>
                                                    <span className="pf-usr-email">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="pf-usr-role">{u.role}</span>
                                        </td>
                                        <td>
                                            <span className={`pf-usr-status ${u.status === 'Active' ? 'pf-stat-active' : 'pf-stat-susp'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="pf-usr-activity">{u.lastActive}</span>
                                        </td>
                                        <td className="pf-text-right">
                                            <button className="pf-btn-ghost pf-icon-btn">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UsersPage;
