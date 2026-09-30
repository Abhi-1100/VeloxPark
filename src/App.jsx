import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import Home from './pages/Home';

// Centralized User Mobile Pages
import {
  UserLayout,
  Dashboard,
  SearchLocation,
  BookSlot,
  MapView,
  BookingDetails,
  Payment,
  Profile,
  History,
} from './pages/user';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import Settings from './pages/admin/Settings';
import ZoneMapPage from './pages/admin/ZoneMapPage';
import UsersPage from './pages/admin/UsersPage';
import NotFound from './pages/NotFound';
import './App.css';

import UserParkingInfo from './pages/user/UserParkingInfo';
import UserPaymentPage from './pages/user/UserPaymentPage';
import UserPaymentSuccess from './pages/user/UserPaymentSuccess';

function UserRoute({ children }) {
  return <ProtectedRoute role="user">{children}</ProtectedRoute>;
}

function AdminRoute({ children }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}

function RootRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Home />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return (
    <UserRoute>
      <UserLayout>
        <UserParkingInfo />
      </UserLayout>
    </UserRoute>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public & Root Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RootRoute />} />

              {/* User Side Responsive Pages */}
              <Route path="/user" element={<UserLayout><UserParkingInfo /></UserLayout>} />
              <Route path="/user/payment" element={<UserPaymentPage />} />
              <Route path="/user/payment/success" element={<UserPaymentSuccess />} />

              {/* User Pages */}
              <Route element={<UserRoute><UserLayout /></UserRoute>}>
                <Route path="/dashboard" element={<UserParkingInfo />} />
                <Route path="/search" element={<SearchLocation />} />
                <Route path="/book" element={<BookSlot />} />
                <Route path="/map" element={<MapView />} />
                {/* Redirect old /confirm page directly to /map with popup open */}
                <Route path="/confirm" element={<Navigate to="/map" replace state={{ openPopup: true }} />} />
                <Route path="/booking/:id" element={<BookingDetails />} />
                <Route path="/booking/:id/pay" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
              </Route>

              {/* Admin Pages */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
              <Route path="/admin/map" element={<AdminRoute><ZoneMapPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />

              {/* Fallback Routes */}
              <Route path="/select" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
