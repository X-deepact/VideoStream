import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import History from './pages/History';
import Subscriptions from './pages/Subscriptions';
import LikedVideos from './pages/LikedVideos';
import SavedVideos from './pages/SavedVideos';
import NotFound from './pages/NotFound';
import {
  FORGOT_PASSWORD_PATH,
  HISTORY_PATH,
  FEED_PATH,
  LIKED_VIDEOS_PATH,
  LIVE_STREAM_PATH,
  LIVE_STREAM_WEBCAM_PATH,
  LOGIN_PATH,
  LOGOUT_PATH,
  PRIVACY_DOCS_PATH,
  REGISTRATION_PATH,
  SAVED_VIDEOS_PATH,
  SETTINGS_PATH,
  SUBSCRIPTIONS_PATH,
  TERMS_OF_SERVICES_DOCS_PATH,
  TEST_LIVE_STREAM_PATH,
  STREAMER_PROFILE_PATH,
  WATCH_VIDEO_PATH,
  WATCH_LIVE_PATH,
} from './data/route';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Privacy from './pages/public/Privacy';
import TermsOfServices from './pages/public/TermsOfServices';
import TestLiveStream from './pages/TestLiveStream';
import LogoutPage from './pages/Auth/Logout';
import LiveStream from './pages/LiveStream';
import LiveStreamWebcam from './pages/LiveStream/Webcam';
import React from 'react';
import Settings from './pages/Settings';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import WatchVideo from './pages/WatchVideo';
import WatchLive from './pages/WatchLive';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={LOGIN_PATH} />} />

        {/* Feed page */}
        <Route
          path={FEED_PATH}
          element={<ProtectedRoute element={<Feed />} />}
        />

        <Route
          path={SUBSCRIPTIONS_PATH}
          element={<ProtectedRoute element={<Subscriptions />} />}
        />
        <Route
          path={HISTORY_PATH}
          element={<ProtectedRoute element={<History />} />}
        />
        <Route
          path={LIKED_VIDEOS_PATH}
          element={<ProtectedRoute element={<LikedVideos />} />}
        />
        <Route
          path={SAVED_VIDEOS_PATH}
          element={<ProtectedRoute element={<SavedVideos />} />}
        />
        <Route
          path={LIVE_STREAM_PATH}
          element={<ProtectedRoute element={<LiveStream />} />}
        />
        <Route
          path={LIVE_STREAM_WEBCAM_PATH}
          element={<ProtectedRoute element={<LiveStreamWebcam />} />}
        />
        <Route
          path={SETTINGS_PATH}
          element={<ProtectedRoute element={<Settings />} />}
        />
        <Route path={LOGOUT_PATH} element={<LogoutPage />} />

        {/* Watch video */}
        <Route
          path={WATCH_VIDEO_PATH}
          element={<ProtectedRoute element={<WatchVideo />} />}
        />
        <Route
          path={WATCH_LIVE_PATH}
          element={<ProtectedRoute element={<WatchLive />} />}
        />

        {/* Streamers */}
        <Route
          path={STREAMER_PROFILE_PATH}
          element={<ProtectedRoute element={<UserProfile />} />}
        />

        {/* Testings */}
        <Route path={TEST_LIVE_STREAM_PATH} element={<TestLiveStream />} />

        <Route path={LOGIN_PATH} element={<Login />} />
        <Route path={REGISTRATION_PATH} element={<Register />} />
        <Route path={FORGOT_PASSWORD_PATH} element={<ForgotPassword />} />
        <Route path={PRIVACY_DOCS_PATH} element={<Privacy />} />
        <Route
          path={TERMS_OF_SERVICES_DOCS_PATH}
          element={<TermsOfServices />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(App);
