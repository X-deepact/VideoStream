import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import PrivateRoute from "@/lib/PrivateRoute";
import { Layout } from "@/app/Layout.tsx";
import AccountList from "@/components/admin-management/AccountList";
import { AuthProvider, useAuth } from "./lib/auth-util";
import Profile from "./components/admin-management/Profile";
import VideoStatistic from "@/components/statistics-management/VideoStatistic";

// import Register from "./pages/auth/Register";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/auth/ResetPassword";

import {
  APP_ACCOUNT_LIST_PATH,
  APP_ACCOUNT_LOG_PATH,
  APP_DASHBOARD_PATH,
  APP_LIVE_CATEGORY_PATH,
  APP_LIVE_SESSION_PATH,
  APP_LIVE_STATISTIC_PATH,
  APP_LOGIN_PATH,
  // APP_PREFIX_PATH,
  APP_PROFILE_PATH,
  APP_VIDEO_LIBRARY_PATH,
  APP_VIDEO_STATISTIC_PATH,
  APP_UPCOMING_SESSION_PATH,
  APP_USER_STATISTICS_PATH,
} from "@/router";
import LiveCategory from "@/components/livestream-management/CategoryList";
import LiveSession from "@/pages/live-management/LiveSession.tsx";
import UpcomingSession from "@/pages/live-management/UpcomingSession.tsx";
import LiveStatistic from "@/components/statistics-management/LiveStatistic";
import UserStatistic from "./components/statistics-management/UserStatistic";
import AccountLog from "@/components/admin-management/AccountLog";
import VideoLibrary from "./components/video-management/VideoLibrary";
import NotFound from "@/pages/NotFound.tsx";

function RedirectHome() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={APP_DASHBOARD_PATH} replace />;
  }

  return <Navigate to={APP_LOGIN_PATH} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectHome />} />
          <Route path={APP_LOGIN_PATH} element={<Login />} />
          {/* <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route element={<PrivateRoute loginUrl={APP_LOGIN_PATH} />}>
            <Route path={APP_DASHBOARD_PATH} element={<Layout />}>
              <Route index element={<Dashboard />}></Route>
              <Route path={APP_PROFILE_PATH} element={<Profile />} />
              <Route path={APP_ACCOUNT_LIST_PATH} element={<AccountList />} />
              <Route path={APP_ACCOUNT_LOG_PATH} element={<AccountLog />} />
              <Route path={APP_LIVE_SESSION_PATH} element={<LiveSession />} />
              <Route
                path={APP_UPCOMING_SESSION_PATH}
                element={<UpcomingSession />}
              />
              <Route path={APP_LIVE_CATEGORY_PATH} element={<LiveCategory />} />
              <Route path={APP_VIDEO_LIBRARY_PATH} element={<VideoLibrary />} />
              <Route
                path={APP_LIVE_STATISTIC_PATH}
                element={<LiveStatistic />}
              />
              <Route
                path={APP_VIDEO_STATISTIC_PATH}
                element={<VideoStatistic />}
              />
              <Route
                path={APP_USER_STATISTICS_PATH}
                element={<UserStatistic />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
