import { Reaction, ReactionStats } from '../chat';
import { CONTENT_STATUS } from '../types/stream';
import { CategoryResponse } from './category';

export interface StreamDetailsResponse {
  id: number | null;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  broadcast_url: string | null;
  push_url: string | null;
  started_at?: string | null;
  category_ids: number[];
}

export type VideosListRequest = {
  page?: number;
  limit?: number;
  status?: CONTENT_STATUS;
  title?: string;
  categoryId1?: number;
  categoryId2?: number;
  categoryId3?: number;
  is_me?: boolean;
  is_liked?: boolean;
  is_history?: boolean;
  is_saved?: boolean;
};

export interface StreamsResponse {
  id: number;
  title: string;
  thumbnail_url: string;
  status: CONTENT_STATUS;
  broadcast_url: string;
  video_url: string;
  started_at: string;
  scheduled_at?: string;
  user_id: number;
  display_name: string;
  avatar_file_url: string;
  views: number;
  likes: number;
  comments: number;
  duration: number;
  is_saved: boolean;
}

export interface VideoDetailsResponse {
  id: number;

  title: string;
  description: string;
  thumbnail_url: string;
  broadcast_url: string;
  video_url: string;
  status: CONTENT_STATUS;
  created_at: string;
  started_at: string;

  user_id: number;
  display_name: string;
  avatar_file_url: string;
  subscriptions: number;

  views: number;
  comments: number;
  likes: ReactionStats;
  current_like_type: Reaction | null;
  is_current_like: boolean;
  is_owner: boolean;
  is_subscribed: boolean;
  is_saved: boolean;
  duration: number;

  categories: CategoryResponse[];
}

export type CommentsListRequest = {
  page?: number;
  limit?: number;
  videoId: number;
};

export interface CommentsResponse {
  id: number;
  display_name: string;
  avatar_url: string;
  content: string;
  created_at: string;
  is_me: boolean;
  is_edited: boolean;
}

export type CreateCommentRequest = {
  videoId: number;
  content: string;
};

export type UpdateCommentRequest = {
  commentId: number;
  content: string;
};

export interface AddViewResponse {
  is_added: boolean;
}
