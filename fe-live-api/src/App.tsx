import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import History from './pages/History';
import Home from './pages/Home';
import Subscriptions from './pages/Subscriptions';
import LikedVideos from './pages/LikedVideos';
import SavedVideos from './pages/SavedVideos';
import NotFound from './pages/NotFound';
import {
  HISTORY_PATH,
  HOME_PATH,
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
import Advanced from './components/Settings/Advanced';
import Settings from './pages/Settings';
import Authentication from './components/Settings/Authentication';
import Info from './components/Settings/Info';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={LOGIN_PATH} />} />

        <Route
          path={HOME_PATH}
          element={<ProtectedRoute element={<Home />} />}
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
        <Route path={LOGOUT_PATH} element={<LogoutPage />} />
        
        {/* Settings */}
        <Route path={SETTINGS_PATH} element={<Settings />}>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<Info />} />
          <Route path="authentication" element={<Authentication />} />
          <Route path="advanced" element={<Advanced />} />
        </Route>
        <Route path={LOGOUT_PATH} element={<LogoutPage />} />

        {/* Testings */}
        <Route path={TEST_LIVE_STREAM_PATH} element={<TestLiveStream />} />

        <Route path={LOGIN_PATH} element={<Login />} />
        <Route path={REGISTRATION_PATH} element={<Register />} />
        <Route path={PRIVACY_DOCS_PATH} element={<Privacy />} />
        <Route
          path={TERMS_OF_SERVICES_DOCS_PATH}
          element={<TermsOfServices />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default React.memo(App);
