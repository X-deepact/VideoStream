import logger from '@/lib/logger';
import { liveStreamApi } from './utils';
import { API_METHOD, ApiRequest, ApiResponse, ApiService } from '@/data/api';
import { VIDEO_FETCH_STATUS_CODE } from '@/data/types/stream';

export const fetchVideoWithAuth = async (
  url: string
): Promise<{
  success: boolean;
  result: string;
  status: VIDEO_FETCH_STATUS_CODE;
}> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.GET,
    authToken: true,
    download: true,
  };

  try {
    const response: ApiResponse = await liveStreamApi(request);

    if (response.code === 202)
      return {
        success: false,
        result: 'The video is currently being encoded. Please try again later.',
        status: VIDEO_FETCH_STATUS_CODE.ENCODING,
      };
    else if (response.code === 404)
      return {
        success: false,
        result: "Not found! The video doesn't exist.",
        status: VIDEO_FETCH_STATUS_CODE.NOT_FOUND,
      };
    else if (response.success && response.data) {
      const contentType = response?.headers?.['content-type'] || 'video/mp4';
      const blob = new Blob([response.data], { type: contentType });
      return {
        success: true,
        result: URL.createObjectURL(blob),
        status: VIDEO_FETCH_STATUS_CODE.OK,
      };
    } else
      return {
        success: false,
        result: response.message || 'Failed to fetch the video.',
        status: VIDEO_FETCH_STATUS_CODE.UNKNOWN,
      };
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      result: 'An unexpected error occurred.',
      status: VIDEO_FETCH_STATUS_CODE.UNKNOWN,
    };
  }
};
