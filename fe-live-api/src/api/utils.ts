import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  API_ERROR_CODE,
  ApiRequest,
  ApiResponse,
  ApiService,
} from '@/data/api';
import { retrieveAuthToken } from '@/data/model/userAccount';

const smsInstance = axios.create({ baseURL: import.meta.env.VITE_BE_API_URL });

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

  let instance: AxiosInstance = smsInstance;
  let secret = null;
  switch (service) {
    case ApiService.liveStream:
      instance = smsInstance;
      if (authToken) secret = retrieveAuthToken();
      break;
  }

  let success = false,
    apiResponse = null,
    code = null,
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
      };
      if (timeout) {
        config['timeout'] = timeout;
      } else {
        config['timeout'] = 10000;
      }
      if (download) {
        config['responseType'] = 'blob';
      }

      const { data: responseData } = await instance.request(config);

      success = true;
      apiResponse = responseData;
    } catch (e: unknown) {
      success = false;

      if (e instanceof AxiosError) {
        const errorResponse = e.response?.data; // message, code
        if (errorResponse) {
          code = errorResponse?.code;
          message = errorResponse.message;
        }
      } else if (e instanceof Error) {
        console.error(`Unexpected error: ${e.message}`);
      } else {
        console.error('An unknown error occurred.');
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
    code,
    message,
  };
};

export { liveStreamApi };
