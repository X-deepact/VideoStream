import { USER_ROLE } from '@/types/role';
import { Frame, History, Import, Podcast, Rss, ThumbsUp } from 'lucide-react';

export const APP_PREFIX_PATH = '/app';

export const AUTH_PREFIX_PATH = '/auth';
export const LOGIN_PATH = AUTH_PREFIX_PATH + '/login';
export const REGISTRATION_PATH = AUTH_PREFIX_PATH + '/register';
export const LOGOUT_PATH = AUTH_PREFIX_PATH + '/logout';

export const HOME_PATH = APP_PREFIX_PATH + '';
export const SUBSCRIPTIONS_PATH = APP_PREFIX_PATH + '/subscriptions';
export const HISTORY_PATH = APP_PREFIX_PATH + '/history';
export const LIKED_VIDEOS_PATH = APP_PREFIX_PATH + '/liked';
export const SAVED_VIDEOS_PATH = APP_PREFIX_PATH + '/saved';
export const LIVE_STREAM_PATH = APP_PREFIX_PATH + '/live';
export const LIVE_STREAM_WEBCAM_PATH = LIVE_STREAM_PATH + '/webcam';
export const LIVE_STREAM_SOFTWARE_PATH = LIVE_STREAM_PATH + '/software';
export const SETTINGS_PATH = APP_PREFIX_PATH + '/settings';

// Testings
export const TEST_LIVE_STREAM_PATH = APP_PREFIX_PATH + '/test-live-stream';
export const PUBLIC_PATH = '/p';
export const PRIVACY_DOCS_PATH = PUBLIC_PATH + '/privacy';
export const TERMS_OF_SERVICES_DOCS_PATH = PUBLIC_PATH + '/terms-of-services';

export const LEFT_MAIN_MENU: Record<USER_ROLE, string[]> = {
  [USER_ROLE.STREAMER]: [
    HOME_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,

    LIVE_STREAM_PATH,
    LIVE_STREAM_WEBCAM_PATH,
    LIVE_STREAM_SOFTWARE_PATH,
  ],
  [USER_ROLE.USER]: [
    HOME_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,
  ],
  [USER_ROLE.ADMIN]: [
    HOME_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,
  ],
  [USER_ROLE.SUPERADMIN]: [
    HOME_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,
  ],
};

export type RouteInfo = {
  path: string;
  title: string;
  Icon: JSX.Element;
};

export const ROUTE_PATH_INFO = {
  [HOME_PATH]: {
    path: HOME_PATH,
    title: 'Home',
    Icon: <Frame />,
  },
  [SUBSCRIPTIONS_PATH]: {
    path: SUBSCRIPTIONS_PATH,
    title: 'Subscriptions',
    Icon: <Rss />,
  },
  [HISTORY_PATH]: {
    path: HISTORY_PATH,
    title: 'History',
    Icon: <History />,
  },
  [LIKED_VIDEOS_PATH]: {
    path: LIKED_VIDEOS_PATH,
    title: 'Liked Videos',
    Icon: <ThumbsUp />,
  },
  [SAVED_VIDEOS_PATH]: {
    path: SAVED_VIDEOS_PATH,
    title: 'Saved Videos',
    Icon: <Import />,
  },
  [LIVE_STREAM_PATH]: {
    path: LIVE_STREAM_PATH,
    title: 'Live Stream',
    Icon: <Podcast />,
  },
};
