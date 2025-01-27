import { API_METHOD, ApiRequest, ApiResult, ApiService } from '@/data/api';
import { CategoryResponse } from '@/data/dto/category';
import { liveStreamApi } from './utils';

const CATEGORY_API = '/category';
const CATEGORY_LIST_API = CATEGORY_API + '/list';

export const apiFetchCategories = async (): Promise<
  ApiResult<CategoryResponse[]>
> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: CATEGORY_LIST_API,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: CategoryResponse[] = [];
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};
