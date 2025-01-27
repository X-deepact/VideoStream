import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService,
  FindAndCountResponse,
  SuccessResponse,
} from '@/data/api';
import {
  SubscriptionListRequest,
  SubscriptionResponse,
} from '@/data/dto/subscription';
import { mapToQueryString } from '@/lib/utils';
import { liveStreamApi } from './utils';

const SUBSCRIPTION_API = '/subscribe';
const SUBSCRIPTION_LIST_API = SUBSCRIPTION_API + '/list';
const NOTIFICATION_MUTE_API = `${SUBSCRIPTION_API}/mute`;

export const apiFetchSubscriptionList = async (
  payload: SubscriptionListRequest
): Promise<ApiResult<FindAndCountResponse<SubscriptionResponse>>> => {
  const { page, limit } = payload;

  const queryString = mapToQueryString<SubscriptionListRequest>({
    page,
    limit,
  });

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: `${SUBSCRIPTION_LIST_API}?${queryString}`,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: FindAndCountResponse<SubscriptionResponse> = {};
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiToggleMuteNotificationsFromChannel = async (
  isMute: boolean,
  streamerId: number
): Promise<ApiResult<SuccessResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: NOTIFICATION_MUTE_API,
    method: API_METHOD.PUT,
    data: { is_mute: isMute, streamer_id: streamerId },
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
