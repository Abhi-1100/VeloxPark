import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import TopBar from '../../components/ui/TopBar';

function UserLayout({ children }) {
  const { user, signOut } = useAuth();
  return (
    <div className="vp-grid min-h-screen bg-ink text-paper flex flex-col selection:bg-gold selection:text-ink">
      <TopBar userName={user?.profile?.name || user?.displayName || user?.email} onSignOut={signOut} />
      <main className="vp-page-container flex-1 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}
export default UserLayout;
