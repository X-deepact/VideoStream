import { LIVESTREAM_STATUS } from "@/lib/interface.tsx";

export interface LiveStatisticsResponse {
  title: string;
  description: string;
  stream_id: number;
  status: LIVESTREAM_STATUS;
  likes: number;
  current_viewers: number;
  total_viewers: number;
  comments: number;
}

export interface UserStatisticsResponse {
  display_name: string;
  role_type: string;
  total_comments: number;
  total_likes: number;
  total_streams: number;
  total_views: number;
  user_id: number;
  username: string;
}

export interface VideoStatisticsResponse {
  title: string;
  viewers: number;
  likes: number;
  comments: number;
  duration: number;
  shares: number;
  video_size: number;
  created_at: string;
}


export interface HoursViewStatisticResponse {
  elements: {
    time: string;
    views: number;
  }[];
  the_day_before_total_views: number;
}
