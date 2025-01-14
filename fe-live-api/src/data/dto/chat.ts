import { z } from 'zod';
import { Reaction, ReactionStats } from '../chat';

export enum LiveInteractionType {
  'COMMENT' = 'comment',
  'LIKE' = 'like',
  'INITIAL' = 'initial',
  'LIKE_INFO' = 'like_info',
  'VIEW_INFO' = 'view_info',
  'LIVE_ENDED' = 'live_ended',
}

export interface LiveComment {
  content: string;
}

export interface LiveInitialStatsResponse {
  type: LiveInteractionType;
  comments: LiveCommentInfo[];
  like_count: number;
  like_info: ReactionStats;
  current_like_type?: Reaction;
}

export interface LiveReactionRequest {
  type: LiveInteractionType;
  data: {
    like_status: boolean;
    like_type: Reaction;
  };
}

export type LiveReactionResponse = LiveReactionRequest;

export interface LiveCommentRequest {
  type: LiveInteractionType;
  data: {
    content: string;
  };
}

export const LiveCommentInfoSchema = z.object({
  id: z.number(),
  username: z.string(),
  display_name: z.string(),
  avatar_url: z.string(),
  content: z.string(),
  created_at: z.string(),
});

export type LiveCommentInfo = z.infer<typeof LiveCommentInfoSchema>;

export const isLiveCommentInfoObj = (obj: unknown): obj is LiveCommentInfo => {
  return LiveCommentInfoSchema.safeParse(obj).success;
};

export interface LiveViewResponse {
  type: LiveInteractionType.VIEW_INFO;
  data: {
    total: number;
  };
}

export interface LiveEndedResponse {
  type: LiveInteractionType.LIVE_ENDED;
}
