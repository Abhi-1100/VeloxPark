import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoadingScreen from '../components/LoadingScreen';

function ProtectedRoute({ children, role: requiredRole }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  return children;
}

export default ProtectedRoute;
