import _ from 'lodash';
import { liveStreamApi } from './utils';
import { StreamDetailsUpdateRequest } from '@/data/types/stream';
import {
  CommentsResponse,
  StreamDetailsResponse,
  StreamsResponse,
  CommentsListRequest,
  VideoDetailsResponse,
  VideosListRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  AddViewResponse,
} from '@/data/dto/stream';
import {
  API_ERROR,
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService,
  FindAndCountResponse,
  SuccessResponse,
} from '@/data/api';
import { mapToQueryString } from '@/lib/utils';
import { Reaction, ReactionStats } from '@/data/chat';

const STREAM_API = '/streams';
const STREAM_CREATE_API = STREAM_API + '/start';
const VIDEO_DETAILS_API = STREAM_API + '/:videoId';
const STREAM_DETAILS_UPDATE_API = VIDEO_DETAILS_API + '/update';
const SUBSCRIBE_API = 'subscribe';
const ADD_VIEW_API = STREAM_API + '/:videoId/add-view';
const REACT_API = STREAM_API + '/:videoId/like';
const COMMENT_API = STREAM_API + '/:videoId/comments';
const COMMENT_CREATE_API = STREAM_API + '/:videoId/create-comment';
const COMMENT_DELETE_API = STREAM_API + '/delete-comment/:commentId';
const COMMENT_UPDATE_API = STREAM_API + '/update-comment';
const BOOKMARK_API = STREAM_API + '/:videoId/bookmark';

export const apiCreateStream = async ({
  title,
  description,
  categories,
  streamType,
  thumbnailImage,
}: StreamDetailsUpdateRequest): Promise<ApiResult<StreamDetailsResponse>> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description || '');
  categories?.map((category) =>
    formData.append('category_ids', JSON.stringify(Number(category)))
  );
  formData.append('stream_type', streamType);
  formData.append('thumbnail', thumbnailImage || '');

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: STREAM_CREATE_API,
    method: API_METHOD.POST,
    data: formData,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: StreamDetailsResponse = {} as StreamDetailsResponse;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiUpdateStreamDetails = async ({
  id,
  title,
  description,
  categories,
  thumbnailImage,
}: StreamDetailsUpdateRequest): Promise<
  ApiResult<StreamDetailsResponse | null>
> => {
  if (!id)
    return {
      data: null,
      message: 'Error',
      code: 401,
      error: API_ERROR.BAD_REQUEST,
    };

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description || '');
  categories?.map((category) =>
    formData.append('category_ids', JSON.stringify(Number(category)))
  );
  formData.append('thumbnail', thumbnailImage || '');

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: STREAM_DETAILS_UPDATE_API.replace(':videoId', id?.toString() || ''),
    method: API_METHOD.PUT,
    data: formData,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: StreamDetailsResponse = {} as StreamDetailsResponse;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiFetchVideosList = async (
  payload: VideosListRequest
): Promise<ApiResult<FindAndCountResponse<StreamsResponse>>> => {
  const {
    page,
    limit,
    title,
    status,
    is_me,
    is_liked,
    is_history,
    is_saved,
    categoryId1,
    categoryId2,
    categoryId3,
  } = payload;
  const queryString = mapToQueryString<VideosListRequest>({
    page,
    limit,
    title,
    status,
    is_me,
    is_liked,
    is_history,
    is_saved,
  });

  const categoriesFilter = _.compact([categoryId1, categoryId2, categoryId3])
    ?.map((category) => `category_ids=${category}`)
    .join('&');

  const url = `${STREAM_API}?${queryString}${
    categoriesFilter ? `&${categoriesFilter}` : ''
  }`;

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: FindAndCountResponse<StreamsResponse> = {};
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiFetchVideoDetails = async (
  id: string
): Promise<ApiResult<VideoDetailsResponse | null>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: VIDEO_DETAILS_API.replace(':videoId', id),
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: VideoDetailsResponse | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiSubscribeUnSubscribe = async (
  streamerId: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: SUBSCRIBE_API,
    method: API_METHOD.POST,
    data: { streamer_id: streamerId },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.code === 200 },
    message,
    code,
  };
};

export const apiAddView = async (
  videoId: number
): Promise<ApiResult<AddViewResponse | null>> => {
  const url = ADD_VIEW_API.replace(':videoId', videoId?.toString());

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.POST,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: AddViewResponse | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiReactOnVideo = async ({
  videoId,
  likeStatus,
  likeType,
}: {
  videoId: number;
  likeStatus: boolean;
  likeType: Reaction;
}): Promise<ApiResult<ReactionStats | null>> => {
  const url = REACT_API.replace(':videoId', videoId?.toString());

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.POST,
    data: {
      like_status: likeStatus,
      like_type: likeType,
    },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: ReactionStats | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiFetchCommentsList = async (
  payload: CommentsListRequest
): Promise<ApiResult<FindAndCountResponse<CommentsResponse>>> => {
  const { page, limit, videoId } = payload;
  const queryString = mapToQueryString<CommentsListRequest>({
    page,
    limit,
  });

  const url = `${COMMENT_API.replace(
    ':videoId',
    videoId?.toString()
  )}?${queryString}`;

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: FindAndCountResponse<CommentsResponse> = {};
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiCreateComment = async ({
  videoId,
  content,
}: CreateCommentRequest): Promise<ApiResult<CommentsResponse | null>> => {
  const url = COMMENT_CREATE_API.replace(':videoId', videoId?.toString());

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.POST,
    data: { content },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: CommentsResponse | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiDeleteComment = async (
  commentId: number
): Promise<ApiResult<SuccessResponse>> => {
  const url = COMMENT_DELETE_API.replace(':commentId', commentId?.toString());

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.DELETE,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.code === 200 },
    message,
    code,
  };
};

export const apiUpdateComment = async ({
  commentId,
  content,
}: UpdateCommentRequest): Promise<ApiResult<CommentsResponse | null>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: COMMENT_UPDATE_API,
    method: API_METHOD.PUT,
    data: {
      id: commentId,
      content,
    },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: CommentsResponse | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiBookmarkVideo = async (
  videoId: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: BOOKMARK_API.replace(':videoId', videoId.toString()),
    method: API_METHOD.POST,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.code === 200 },
    message,
    code,
  };
};

export const apiUnBookmarkVideo = async (
  videoId: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: BOOKMARK_API.replace(':videoId', videoId.toString()),
    method: API_METHOD.DELETE,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.code === 200 },
    message,
    code,
  };
};
