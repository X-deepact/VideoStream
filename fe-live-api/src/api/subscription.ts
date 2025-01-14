import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService,
  FindAndCountResponse,
} from '@/data/api';
import {
  SubscriptionListRequest,
  SubscriptionResponse,
} from '@/data/dto/subscription';
import { mapToQueryString } from '@/lib/utils';
import { liveStreamApi } from './utils';

const SUBSCRIPTION_API = '/subscribe';
const SUBSCRIPTION_LIST_API = SUBSCRIPTION_API + '/list';

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
