import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { House } from "lucide-react";
import { APP_DASHBOARD_PATH, APP_LOGIN_PATH } from "@/router";

const NotFound = () => {
	const navigate = useNavigate();
	const isAuth = localStorage.getItem("IsAuth") === "true";
	const onGoingBackHome = () => {
		isAuth ? navigate(APP_DASHBOARD_PATH) : navigate(APP_LOGIN_PATH);
	};

	return (
		<div className="child-center w-full">
			<div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
				<div className="flex flex-col items-center select-none">
					<h1 className="font-mono text-8xl text-slate-400">404</h1>
					<h1 className="mb-1 text-xl font-semibold">Page Not Found</h1>
					<span className="text-slate-500 text-center">
            The page you are looking for either does not exist or is
            unavailable.
          </span>
					<Button className="mt-5" onClick={onGoingBackHome}>
						<House /> {isAuth ? "Back to Dashboard" : "Back to Login Page"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
