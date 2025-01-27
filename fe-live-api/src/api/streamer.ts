import { API_METHOD, ApiRequest, ApiResult, ApiService } from '@/data/api';
import { StreamerDetailsResponse } from '@/data/dto/streamer';
import { liveStreamApi } from './utils';

const RESOURCE_ID = ':id';
const STREAM_API = '/streams';
const STREAMER_DETAILS_API = `${STREAM_API}/channel/${RESOURCE_ID}`;

export const apiFetchStreamerDetails = async (
  streamerId: string
): Promise<ApiResult<StreamerDetailsResponse | null>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: STREAMER_DETAILS_API.replace(RESOURCE_ID, streamerId.toString()),
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: StreamerDetailsResponse | null = null;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};
