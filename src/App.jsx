import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Settings from './components/Settings';
import UserParkingInfo from './components/UserParkingInfo';
import UserPaymentPage from './components/UserPaymentPage';
import UserPaymentSuccess from './components/UserPaymentSuccess';
import NotFound from './components/NotFound';
import ZoneMapPage from './components/ZoneMapPage';
import UsersPage from './components/UsersPage';
import LoadingScreen from './components/LoadingScreen';
import RoleSelect from './components/RoleSelect';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Temporary auth bypass for development so you can see the dashboard directly
      setUser({ email: 'admin@veloxpark.com', role: 'admin' });
      setLoading(false);
      // setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Role Selection Page */}
          <Route path="/select" element={<RoleSelect />} />

          {/* User Panel - New split pages (Page 1: Info, Page 2: QR, Page 3: Success) */}
          <Route path="/user" element={<UserParkingInfo />} />
          <Route path="/user/payment" element={<UserPaymentPage />} />
          <Route path="/user/payment/success" element={<UserPaymentSuccess />} />

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

          {/* Settings — protected, same auth guard */}
          <Route
            path="/admin/settings"
            element={
              user ? (
                <Settings user={user} />
              ) : (
                <Login onLoginSuccess={() => { }} />
              )
            }
          />

          {/* Zone Map — protected */}
          <Route
            path="/admin/map"
            element={
              user ? (
                <ZoneMapPage user={user} />
              ) : (
                <Login onLoginSuccess={() => { }} />
              )
            }
          />

          {/* Users — protected */}
          <Route
            path="/admin/users"
            element={
              user ? (
                <UsersPage user={user} />
              ) : (
                <Login onLoginSuccess={() => { }} />
              )
            }
          />

          {/* 404 Page - Catch all unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
