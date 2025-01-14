import _ from 'lodash';
import {
  apiAddView,
  apiCreateComment,
  apiDeleteComment,
  apiFetchCommentsList,
  apiFetchVideoDetails,
  apiFetchVideosList,
  apiCreateStream,
  apiReactOnVideo,
  apiSubscribeUnSubscribe,
  apiUpdateComment,
  apiUpdateStreamDetails,
  apiBookmarkVideo,
  apiUnBookmarkVideo,
} from '@/api/stream';
import {
  ApiResult,
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
import { STREAM_TYPE, StreamDetailsUpdateRequest } from '@/data/types/stream';
import { MAX_CATEGORY_COUNT, StreamDetailsRules } from '@/data/validations';
import { Reaction, ReactionStats } from '@/data/chat';
import { FORM_MODE } from '@/data/types/ui/form';

export enum StreamInitializeError {
  INVALID_TITLE = 'INVALID_TITLE',
  INVALID_DESCRIPTION = 'INVALID_DESCRIPTION',
  INVALID_CATEGORY = 'INVALID_CATEGORY',
  INVALID_STREAM_TYPE = 'INVALID_STREAM_TYPE',
  INVALID_THUMBNAIL_IMAGE = 'INVALID_THUMBNAIL_IMAGE',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

type ApiFunction = (
  params: StreamDetailsUpdateRequest
) => Promise<ApiResult<StreamDetailsResponse | null>>;

export const saveVideoOrStream = async (
  payload: StreamDetailsUpdateRequest,
  mode: FORM_MODE
): Promise<ServiceResponse<StreamDetailsResponse, StreamInitializeError>> => {
  const {
    title,
    description,
    categories,
    streamType,
    thumbnailImage,
    thumbnailPreview,
  } = payload;

  let apiFunction: ApiFunction | null = null;

  if (mode === FORM_MODE.CREATE) apiFunction = apiCreateStream;
  else if (mode === FORM_MODE.EDIT) apiFunction = apiUpdateStreamDetails;

  let errors: Partial<Record<StreamInitializeError, boolean>> = {};
  const invalidTitle =
    !title ||
    title.length < StreamDetailsRules.title.min ||
    title.length > StreamDetailsRules.title.max;
  const invalidDescription =
    !description ||
    description.length < StreamDetailsRules.description.min ||
    description.length > StreamDetailsRules.description.max;
  const invalidCategories =
    !categories ||
    categories.length === 0 ||
    categories?.length > MAX_CATEGORY_COUNT;
  const invalidThumbnail = !thumbnailImage && !thumbnailPreview;
  const invalidStreamType = !Object.values(STREAM_TYPE)?.includes(streamType);

  let result: StreamDetailsResponse | undefined = undefined;
  let msg: string = '';
  if (
    !invalidTitle &&
    !invalidDescription &&
    !invalidCategories &&
    !invalidThumbnail &&
    !invalidStreamType
  ) {
    if (apiFunction) {
      const { data, error, message } = await apiFunction({
        id: mode === FORM_MODE.EDIT ? payload?.id : undefined,
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
    }
  } else {
    errors[StreamInitializeError.INVALID_TITLE] = invalidTitle;
    errors[StreamInitializeError.INVALID_DESCRIPTION] = invalidDescription;
    errors[StreamInitializeError.INVALID_CATEGORY] = invalidCategories;
    errors[StreamInitializeError.INVALID_STREAM_TYPE] = invalidStreamType;
    errors[StreamInitializeError.INVALID_THUMBNAIL_IMAGE] = invalidThumbnail;
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

export const bookmarkVideo = async (
  videoId: number
): Promise<SuccessResponse> => {
  const { data } = await apiBookmarkVideo(videoId);
  return {
    success: data && data!.success,
  };
};

export const unBookmarkVideo = async (
  videoId: number
): Promise<SuccessResponse> => {
  const { data } = await apiUnBookmarkVideo(videoId);
  return {
    success: data && data!.success,
  };
};
