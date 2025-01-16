import { ROLE } from '@/type/role.ts';
import {
  FileChartColumn,
  FileChartColumnIncreasing,
  FileVideo,
  Podcast,
  Radio,
  Users,
} from 'lucide-react';

export const APP_PREFIX_PATH = '/';
export const APP_LOGIN_PATH = '/login';
export const APP_RESET_PASSWORD_PATH = '/reset-password';
export const APP_FORGOT_PASSWORD_PATH = '/forgot-password';

export const APP_DASHBOARD_PATH = '/dashboard';
export const APP_PROFILE_PATH = `${APP_DASHBOARD_PATH}/profile`;
export const APP_ACCOUNT_LIST_PATH = `${APP_DASHBOARD_PATH}/account-list`;
export const APP_ACCOUNT_LOG_PATH = `${APP_DASHBOARD_PATH}/account-log`;
export const APP_UPCOMING_SESSION_PATH = `${APP_DASHBOARD_PATH}/upcoming-session`;
export const APP_LIVE_SESSION_PATH = `${APP_DASHBOARD_PATH}/live-session`;
export const APP_LIVE_CATEGORY_PATH = `${APP_DASHBOARD_PATH}/live-category`;
export const APP_VIDEO_LIBRARY_PATH = `${APP_DASHBOARD_PATH}/video-library`;
export const APP_VIDEO_STATISTIC_PATH = `${APP_DASHBOARD_PATH}/video-statistic`;
export const APP_LIVE_STATISTIC_PATH = `${APP_DASHBOARD_PATH}/live-statistic`;
export const APP_USER_STATISTICS_PATH = `${APP_DASHBOARD_PATH}/user-statistic`;

// For any authorization workflow in the future, please apply and adjust the following
export const APP_SIDEBAR_ITEMS: Record<ROLE, string[]> = {
  [ROLE.SUPERADMIN]: [
    APP_ACCOUNT_LIST_PATH,
    APP_ACCOUNT_LOG_PATH,
    APP_LIVE_SESSION_PATH,
    APP_LIVE_CATEGORY_PATH,
    APP_VIDEO_LIBRARY_PATH,
    APP_LIVE_STATISTIC_PATH,
    APP_VIDEO_STATISTIC_PATH,
    APP_USER_STATISTICS_PATH,
  ],
  [ROLE.ADMIN]: [
    APP_ACCOUNT_LIST_PATH,
    APP_ACCOUNT_LOG_PATH,
    APP_LIVE_SESSION_PATH,
    APP_LIVE_CATEGORY_PATH,
    APP_VIDEO_LIBRARY_PATH,
    APP_LIVE_STATISTIC_PATH,
    APP_VIDEO_STATISTIC_PATH,
    APP_USER_STATISTICS_PATH,
  ],
  [ROLE.USER]: [],
  [ROLE.STREAMER]: [],
};

export const ITEM_INFO = {
  APP_ACCOUNT_LIST_PATH: {
    title: 'Account List',
    url: APP_ACCOUNT_LIST_PATH,
    icon: Users,
  },
  APP_ACCOUNT_LOG_PATH: {
    title: 'Account Log',
    url: APP_ACCOUNT_LOG_PATH,
    icon: Users,
  },
  APP_LIVE_SESSION_PATH: {
    title: 'Live Session',
    url: APP_LIVE_SESSION_PATH,
    icon: Radio,
  },
  APP_LIVE_CATEGORY_PATH: {
    title: 'Category List',
    url: APP_LIVE_CATEGORY_PATH,
    icon: Radio,
  },
  APP_VIDEO_LIBRARY_PATH: {
    title: 'Video Library',
    url: APP_VIDEO_LIBRARY_PATH,
    icon: FileVideo,
  },
  APP_LIVE_STATISTIC_PATH: {
    title: 'Live Statistic',
    url: APP_LIVE_STATISTIC_PATH,
    icon: FileChartColumn,
  },
  APP_VIDEO_STATISTIC_PATH: {
    title: 'Video Statistic',
    url: APP_VIDEO_STATISTIC_PATH,
    icon: FileChartColumnIncreasing,
  },
  APP_USER_STATISTICS_PATH: {
    title: 'User Statistic',
    url: APP_USER_STATISTICS_PATH,
    icon: FileChartColumnIncreasing,
  },
  APP_UPCOMING_SESSION_PATH: {
    title: 'Upcoming Session',
    url: APP_UPCOMING_SESSION_PATH,
    icon: Podcast,
  },
};
