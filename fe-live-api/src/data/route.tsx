import { USER_ROLE } from '@/data/types/role';
import {
  Bookmark,
  Frame,
  History,
  Radio,
  Rss,
  Settings2,
  ThumbsUp,
} from 'lucide-react';

export const RESOURCE_ID = ':id';

export const RESULTS_PATH_KEYWORD = 'results';
export const SEARCH_QUERY_KEYWORD = 'q';
export const CATEGORY_FILTER_KEYWORD = 'category';

export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const LOGIN_PATH = AUTH_PREFIX_PATH + '/login';
export const REGISTRATION_PATH = AUTH_PREFIX_PATH + '/register';
export const LOGOUT_PATH = AUTH_PREFIX_PATH + '/logout';
export const FORGOT_PASSWORD_PATH = AUTH_PREFIX_PATH + '/forgot-password';

export const FEED_PATH = APP_PREFIX_PATH + '/feed';
export const FEED_SEARCH_PATH = FEED_PATH + '/' + RESULTS_PATH_KEYWORD;
export const SUBSCRIPTIONS_PATH = APP_PREFIX_PATH + '/subscriptions';
export const HISTORY_PATH = APP_PREFIX_PATH + '/history';
export const LIKED_VIDEOS_PATH = APP_PREFIX_PATH + '/liked';
export const SAVED_VIDEOS_PATH = APP_PREFIX_PATH + '/saved';
export const LIVE_STREAM_PATH = APP_PREFIX_PATH + '/live';
export const LIVE_STREAM_WEBCAM_PATH = LIVE_STREAM_PATH + '/webcam';
export const LIVE_STREAM_SOFTWARE_PATH = LIVE_STREAM_PATH + '/software';

export const STREAMER_PROFILE_PATH =
  APP_PREFIX_PATH + '/channel/' + RESOURCE_ID;

export const WATCH_VIDEO_PATH = APP_PREFIX_PATH + '/watch/' + RESOURCE_ID;
export const WATCH_LIVE_PATH = APP_PREFIX_PATH + '/watch/live/' + RESOURCE_ID;

export const SETTINGS_PATH = APP_PREFIX_PATH + '/settings';

export const NOT_FOUND_PATH = 'not-found';

export const PUBLIC_PATH = '/p';
export const PRIVACY_DOCS_PATH = PUBLIC_PATH + '/privacy';
export const TERMS_OF_SERVICES_DOCS_PATH = PUBLIC_PATH + '/terms-of-services';

export const LEFT_MAIN_MENU: Record<USER_ROLE, string[]> = {
  [USER_ROLE.STREAMER]: [
    FEED_PATH,
    WATCH_VIDEO_PATH,
    WATCH_LIVE_PATH,
    SUBSCRIPTIONS_PATH,

    LIVE_STREAM_PATH,
    LIVE_STREAM_WEBCAM_PATH,
    LIVE_STREAM_SOFTWARE_PATH,

    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,

    SETTINGS_PATH,

    STREAMER_PROFILE_PATH,
  ],
  [USER_ROLE.USER]: [
    FEED_PATH,
    WATCH_VIDEO_PATH,
    WATCH_LIVE_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,

    SETTINGS_PATH,

    STREAMER_PROFILE_PATH,
  ],
  [USER_ROLE.ADMIN]: [
    FEED_PATH,
    WATCH_VIDEO_PATH,
    WATCH_LIVE_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,

    STREAMER_PROFILE_PATH,
  ],
  [USER_ROLE.SUPERADMIN]: [
    FEED_PATH,
    WATCH_VIDEO_PATH,
    WATCH_LIVE_PATH,
    SUBSCRIPTIONS_PATH,
    HISTORY_PATH,
    LIKED_VIDEOS_PATH,
    SAVED_VIDEOS_PATH,

    STREAMER_PROFILE_PATH,
  ],
};

export type RouteInfo = {
  path: string;
  title: string;
  Icon: JSX.Element;
};

export const ROUTE_PATH_INFO = {
  [FEED_PATH]: {
    path: FEED_PATH,
    title: 'Feed',
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
    title: 'Bookmark Videos',
    Icon: <Bookmark />,
  },
  [LIVE_STREAM_PATH]: {
    path: LIVE_STREAM_PATH,
    title: 'Live Stream',
    Icon: <Radio />,
  },
  [SETTINGS_PATH]: {
    path: SETTINGS_PATH,
    title: 'Settings',
    Icon: <Settings2 />,
  },
};

export const GLOBAL_CONTENT_UNSEARCHABLE_PAGES = [SETTINGS_PATH];
export const GLOBAL_CATEGORY_FILTERABLE_PAGES = [FEED_PATH, FEED_SEARCH_PATH];

export const getFEUrl = (path: string, id: string) => {
  if (path && id) return path.replace(RESOURCE_ID, id);
  return path;
};
