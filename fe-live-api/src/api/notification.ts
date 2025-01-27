import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService,
  CommonFilters,
  CommonFiltersType,
  FindAndCountResponse,
  SuccessResponse,
} from '@/data/api';
import { liveStreamApi } from './utils';
import {
  NotificationCountResponse,
  NotificationResponse,
} from '@/data/dto/notification';
import { mapToQueryString } from '@/lib/utils';

const RESOURCE_ID = ':notiId';
const NOTIFICATION_API = '/notification';
const NOTIFICATION_LIST_API = '/notification/list';
const NOTIFICATION_COUNT_API = `${NOTIFICATION_API}/num`;
const NOTIFICATION_COUNT_RESET_API = `${NOTIFICATION_API}/reset-num`;
const NOTIFICATION_READ_API = `${NOTIFICATION_API}/${RESOURCE_ID}/read`;
const NOTIFICATION_HIDE_API = `${NOTIFICATION_API}/${RESOURCE_ID}/hidden`;

export const apiFetchNotificationsCount = async (): Promise<
  ApiResult<NotificationCountResponse>
> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: NOTIFICATION_COUNT_API,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: NotificationCountResponse = { num: 0 };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiResetNotificationsCount = async (): Promise<
  ApiResult<NotificationCountResponse>
> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: NOTIFICATION_COUNT_RESET_API,
    method: API_METHOD.PUT,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: NotificationCountResponse = { num: 0 };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiFetchNotificationsList = async (
  payload: CommonFilters
): Promise<ApiResult<FindAndCountResponse<NotificationResponse>>> => {
  const { page, limit } = payload;
  const queryString = mapToQueryString<CommonFiltersType>({
    page,
    limit,
  });

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: `${NOTIFICATION_LIST_API}?${queryString}`,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: FindAndCountResponse<NotificationResponse> = {};
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiReadNotification = async (
  id: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: NOTIFICATION_READ_API.replace(RESOURCE_ID, id.toString()),
    method: API_METHOD.PUT,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.is_read },
    message,
    code,
  };
};

export const apiHideNotification = async (
  id: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: NOTIFICATION_HIDE_API.replace(RESOURCE_ID, id.toString()),
    method: API_METHOD.PUT,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: code === 200 },
    message,
    code,
  };
};
