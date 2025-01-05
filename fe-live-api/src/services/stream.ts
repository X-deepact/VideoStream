import _ from 'lodash';
import {
  apiAddView,
  apiCreateComment,
  apiDeleteComment,
  apiFetchCommentsList,
  apiFetchVideoDetails,
  apiFetchVideosList,
  apiInitializeStream,
  apiReactOnVideo,
  apiSubscribeUnSubscribe,
  apiUpdateComment,
} from '@/api/stream';
import {
  FindAndCountResponse,
  ServiceResponse,
  SuccessResponse,
} from '@/data/api';
import {
  StreamDetailsResponse,
  StreamsResponse,
  CommentsListRequest,
  CommentsResponse,
  VideoDetailsResponse,
  VideosListRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  AddViewResponse,
} from '@/data/dto/stream';
import { STREAM_TYPE } from '@/data/types/stream';
import { MAX_CATEGORY_COUNT, StreamInitializeRules } from '@/data/validations';
import { StreamInitializeFields } from '@/data/types/stream';
import { Reaction, ReactionStats } from '@/data/chat';

export enum StreamInitializeError {
  INVALID_TITLE = 'INVALID_TITLE',
  INVALID_DESCRIPTION = 'INVALID_DESCRIPTION',
  INVALID_CATEGORY = 'INVALID_CATEGORY',
  INVALID_STREAM_TYPE = 'INVALID_STREAM_TYPE',
  INVALID_THUMBNAIL_IMAGE = 'INVALID_THUMBNAIL_IMAGE',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export const initializeStream = async ({
  title,
  description,
  categories,
  streamType,
  thumbnailImage,
}: StreamInitializeFields): Promise<
  ServiceResponse<StreamDetailsResponse, StreamInitializeError>
> => {
  let errors: Partial<Record<StreamInitializeError, boolean>> = {};
  let titleFailure = false,
    descriptionFailure = false,
    categoryFailure = false,
    streamTypeFailure = false,
    thumbnailImageFailure = false;

  if (
    !title ||
    title.length < StreamInitializeRules.title.min ||
    title.length > StreamInitializeRules.title.max
  )
    titleFailure = true;
  if (!description || description.length === 0) descriptionFailure = true;
  if (
    !categories ||
    categories.length === 0 ||
    categories?.length > MAX_CATEGORY_COUNT
  )
    categoryFailure = true;
  if (!Object.values(STREAM_TYPE)?.includes(streamType))
    streamTypeFailure = true;
  if (thumbnailImage === null) thumbnailImageFailure = true;

  let result: StreamDetailsResponse | undefined = undefined;
  let msg: string = '';
  if (
    !titleFailure &&
    !descriptionFailure &&
    !streamTypeFailure &&
    !thumbnailImageFailure
  ) {
    const { data, error, message } = await apiInitializeStream({
      title,
      description,
      categories,
      streamType,
      thumbnailImage,
    });
    if (!error && !_.isEmpty(data)) {
      errors = {};
      const {
        id,
        title,
        description,
        thumbnail_url,
        push_url,
        broadcast_url,
        category_ids,
      } = data; // code, message, data

      result = {
        id,
        title,
        description,
        category_ids,
        thumbnail_url,
        push_url,
        broadcast_url,
      };
    } else {
      msg = message;
    }
  } else {
    errors[StreamInitializeError.INVALID_TITLE] = titleFailure;
    errors[StreamInitializeError.INVALID_DESCRIPTION] = descriptionFailure;
    errors[StreamInitializeError.INVALID_CATEGORY] = categoryFailure;
    errors[StreamInitializeError.INVALID_STREAM_TYPE] = streamTypeFailure;
    errors[StreamInitializeError.INVALID_THUMBNAIL_IMAGE] =
      thumbnailImageFailure;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<StreamInitializeError, boolean>)
      : undefined,
    message: msg,
  };
};

export const fetchVideosList = async (
  payload: VideosListRequest
): Promise<FindAndCountResponse<StreamsResponse>> => {
  const { data, error } = await apiFetchVideosList(payload);
  if (data && !error) return data;

  return [];
};

export const fetchVideoDetails = async (
  id: string
): Promise<VideoDetailsResponse | null> => {
  const response = await apiFetchVideoDetails(id);
  if (response && response?.data) {
    return response?.data;
  }

  return null;
};

export const subscribeUnsubscribe = async (
  streamerId: number
): Promise<SuccessResponse> => {
  const { data } = await apiSubscribeUnSubscribe(streamerId);
  return {
    success: data && data!.success,
  };
};

export const addView = async (
  videoId: number
): Promise<AddViewResponse | null> => {
  const { data } = await apiAddView(videoId);
  if (data) return data;
  return null;
};

export const reactOnVideo = async ({
  videoId,
  likeStatus,
  likeType,
}: {
  videoId: number;
  likeStatus: boolean;
  likeType: Reaction;
}): Promise<ReactionStats | null> => {
  const response = await apiReactOnVideo({ videoId, likeStatus, likeType });
  if (response && response?.data) {
    return response?.data;
  }

  return null;
};

export const fetchCommentsList = async (
  payload: CommentsListRequest
): Promise<FindAndCountResponse<CommentsResponse>> => {
  const { data, error } = await apiFetchCommentsList(payload);
  if (data && !error) return data;

  return [];
};

export const createComment = async ({
  videoId,
  content,
}: CreateCommentRequest): Promise<CommentsResponse | null> => {
  const response = await apiCreateComment({ videoId, content });
  if (response && response?.data) {
    return response?.data;
  }

  return null;
};

export const deleteComment = async (
  commentId: number
): Promise<SuccessResponse> => {
  const { data } = await apiDeleteComment(commentId);
  return {
    success: data && data!.success,
  };
};

export const updateComment = async ({
  commentId,
  content,
}: UpdateCommentRequest): Promise<CommentsResponse | null> => {
  const response = await apiUpdateComment({ commentId, content });
  if (response && response?.data) {
    return response?.data;
  }

  return null;
};
