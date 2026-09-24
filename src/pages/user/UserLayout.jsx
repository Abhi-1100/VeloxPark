import { Outlet } from 'react-router-dom';
import UserMobileDock from '../../components/user/UserMobileDock';

function UserLayout({ children }) {
  return (
    <>
      {children || <Outlet />}
      <UserMobileDock />
    </>
  );
}

export default UserLayout;
