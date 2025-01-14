import { isAuthenticated, isAuthorized } from '@/data/model/userAccount';
import { FEED_PATH, LOGIN_PATH } from '@/data/route';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  redirectTo = LOGIN_PATH,
}) => {
  const location = useLocation();

  if (isAuthenticated()) {
    if (isAuthorized(location.pathname)) return element;
    return <Navigate to={FEED_PATH} />;
  }
  return <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
