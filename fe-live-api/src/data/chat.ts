import { z } from 'zod';

// Live Emote Type
export enum Reaction {
  'LIKE' = 'like',
  'DISLIKE' = 'dislike',
  'LAUGH' = 'laugh',
  'HEART' = 'heart',
  'WOW' = 'wow',
  'SAD' = 'sad',
}

export const ReactionIcons = {
  [Reaction.LIKE]: '👍',
  [Reaction.DISLIKE]: '👎',
  [Reaction.LAUGH]: '😂',
  [Reaction.SAD]: '😢',
  [Reaction.WOW]: '😮',
  [Reaction.HEART]: '❤️',
};

export const ReactionStatsSchema = z.object({
  total: z.number().optional(),
  like: z.number().optional(),
  dislike: z.number().optional(),
  laugh: z.number().optional(),
  sad: z.number().optional(),
  wow: z.number().optional(),
  heart: z.number().optional(),
});

export type ReactionStats = z.infer<typeof ReactionStatsSchema>;

export const isReactionStatsObj = (obj: unknown): obj is ReactionStats => {
  return ReactionStatsSchema.safeParse(obj).success;
};
