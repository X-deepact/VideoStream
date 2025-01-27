export type NotificationCountResponse = {
  num: number;
};

export type NotificationResponse = {
  id: number;
  avatar_url: string;
  content: string;
  thumbnail_url: string;
  stream_id: number;
  type: NOTIFICATION_TYPE;
  is_read: boolean;
  is_mute: boolean;
  streamer_id: number | string;
  created_at: string;
};

export type NotificationReadResponse = {
  is_read: boolean;
};

export enum NOTIFICATION_TYPE {
  SUBSCRIBE_VIDEO = 'subscribe_video',
  SUBSCRIBE_LIVE = 'subscribe_live',
  ACCOUNT_BLOCKED = 'account_blocked',
}
