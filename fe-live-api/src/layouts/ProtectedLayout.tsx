import { isAuthenticated, isAuthorized } from '@/data/model/userAccount';
import { FEED_PATH, LOGIN_PATH } from '@/data/route';
import { Navigate, useLocation } from 'react-router-dom';
import AppLayout from './AppLayout';
import { NotificationWSProvider } from '@/context/NotificationContext';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to={LOGIN_PATH} state={{ from: location }} />;
  }

  if (!isAuthorized(location.pathname)) {
    // Redirect to the feed (home) page if not authorized for the current route
    return <Navigate to={FEED_PATH} />;
  }

  return (
    <NotificationWSProvider>
      <AppLayout>{children}</AppLayout>
    </NotificationWSProvider>
  );
};

export default ProtectedLayout;
