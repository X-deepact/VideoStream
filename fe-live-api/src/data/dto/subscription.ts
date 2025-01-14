export interface SubscriptionResponse {
  id: number;
  streamer_id: number;
  streamer_name: string;
  streamer_avatar_url: string;
  num_subscribed: number;
  num_video: number;
}

export type SubscriptionListRequest = {
  page?: number;
  limit?: number;
  isInfiniteList?: boolean;
};
