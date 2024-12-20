import { Outlet, Navigate, type Path, useLocation } from "react-router-dom";
import { useAuth } from "./auth-util";
import { encode } from "js-base64";

export default function PrivateRoute({
  loginUrl,
}: {
  loginUrl: string | Partial<Path>;
}) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  return isAuthenticated || localStorage.getItem("IsAuth") ? (
    <Outlet />
  ) : (
    <Navigate to={`${loginUrl}?redirect=${encode(pathname)}`} replace />
  );
}
