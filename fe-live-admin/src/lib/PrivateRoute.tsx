import { Outlet, Navigate, type Path, useLocation } from "react-router-dom";
import { useAuth } from "./auth-util";
import { encode } from "js-base64";
import { USER_STATUS } from "@/type/users.ts";

export default function PrivateRoute({
	                                     loginUrl,
                                     }: {
	loginUrl: string | Partial<Path>;
}) {
	const {isAuthenticated, status} = useAuth();
	const {pathname} = useLocation();
	
	return isAuthenticated || localStorage.getItem("IsAuth") || status === USER_STATUS.BLOCKED ? (
		<Outlet/>
	) : (
		<Navigate to={`${loginUrl}?redirect=${encode(pathname)}`} replace/>
	);
}
