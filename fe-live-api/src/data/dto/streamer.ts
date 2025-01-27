export interface StreamerDetailsResponse {
  id: number;
  streamer_name: string;
  streamer_avatar_url: string;

  is_subscribed: boolean;
  is_mute: boolean;
  is_me: boolean;

  created_at: string;
  total_like: number;
  total_view: number;
  total_comment: number;
  total_share: number;
  total_subscribe: number;
  total_video: number;
}
