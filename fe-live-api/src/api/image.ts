import { liveStreamApi } from './utils';
import { API_METHOD, ApiRequest, ApiResponse, ApiService } from '@/data/api';

export const fetchImageWithAuth = async (url: string): Promise<string> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url,
    method: API_METHOD.GET,
    authToken: true,
    download: true,
  };

  const response: ApiResponse = await liveStreamApi(request);

  if (response.success && response.data) {
    const contentType = response?.headers?.['content-type'] || 'image/jpeg';
    const blob = new Blob([response.data], { type: contentType });
    return URL.createObjectURL(blob);
  } else {
    throw new Error(response.message || 'Failed to fetch image');
  }
};
