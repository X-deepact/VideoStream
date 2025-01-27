import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  API_ERROR_CODE,
  ApiRequest,
  ApiResponse,
  ApiService,
} from '@/data/api';
import { retrieveAuthToken } from '@/data/model/userAccount';
import logger from '@/lib/logger';

const apiInstance = axios.create({ baseURL: import.meta.env.VITE_BE_API_URL });

const liveStreamApi = async (request: ApiRequest): Promise<ApiResponse> => {
  const {
    service,
    url,
    method,
    params,
    data,
    extraHeaders,
    authToken,
    download,
    timeout,
  } = request;

  const headers = { ...extraHeaders };

  let instance: AxiosInstance = apiInstance;
  let secret = null;

  switch (service) {
    case ApiService.liveStream:
      instance = apiInstance;
      if (authToken) secret = retrieveAuthToken();
      break;
  }

  let success = false,
    apiResponse = null,
    code = null,
    resHeaders = null,
    message = null;

  if (authToken) {
    if (secret) {
      switch (service) {
        case ApiService.liveStream:
          headers['Authorization'] = 'Bearer ' + secret;
          break;
      }
    } else {
      code = API_ERROR_CODE.UNAUTHORIZED;
    }
  }

  if (!code) {
    try {
      const config: AxiosRequestConfig = {
        url,
        method,
        params,
        data,
        headers,
        timeout: timeout || 10000,
        responseType: download ? 'blob' : undefined,
      };

      const axiosResponse = await instance.request(config);

      success = true;
      apiResponse = axiosResponse.data;
      resHeaders = axiosResponse.headers;
      code = axiosResponse?.status;
    } catch (e: unknown) {
      success = false;

      if (e instanceof AxiosError) {
        const errorResponse = e.response?.data; // message, code
        if (errorResponse) {
          code = errorResponse?.code;
          message = errorResponse.message;
        }
      } else if (e instanceof Error) {
        logger.error(`Unexpected error: ${e.message}`);
      } else {
        logger.error('An unknown error occurred.');
      }

      if (!code) {
        code = API_ERROR_CODE.SERVER_ERROR;
        message = 'Please try again later.';
      }
    }
  }

  return {
    success,
    data: apiResponse,
    headers: resHeaders,
    code,
    message,
  };
};

export { liveStreamApi };
