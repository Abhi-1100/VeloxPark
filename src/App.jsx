import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import UserPanel from './components/UserPanel';
import UserParkingInfo from './components/UserParkingInfo';
import UserPaymentPage from './components/UserPaymentPage';
import UserPaymentSuccess from './components/UserPaymentSuccess';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <div className="background-grid"></div>
        <div className="loading">Loading...</div>
      </>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* User Panel - New split pages (Page 1: Info, Page 2: QR, Page 3: Success) */}
        <Route path="/user" element={<UserParkingInfo />} />
        <Route path="/user/payment" element={<UserPaymentPage />} />
        <Route path="/user/payment/success" element={<UserPaymentSuccess />} />

        {/* Legacy user panel fallback (kept for reference) */}
        <Route path="/user/legacy" element={<UserPanel />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user ? (
              <AdminDashboard user={user} />
            ) : (
              <Login onLoginSuccess={() => { }} />
            )
          }
        />

        {/* Analytics Dashboard — protected, same auth guard */}
        <Route
          path="/admin/analytics"
          element={
            user ? (
              <AnalyticsDashboard user={user} />
            ) : (
              <Login onLoginSuccess={() => { }} />
            )
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
