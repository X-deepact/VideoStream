import { AxiosRequestHeaders } from 'axios';

export enum ApiService {
  liveStream = 'liveStream',
}

export enum API_ERROR {
  VALIDATION_BODY_ERROR = 'VALIDATION_BODY_ERROR',
  VALIDATION_QUERY_PARAMS_ERROR = 'VALIDATION_QUERY_PARAMS_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  URL_NOT_FOUND_URL = 'URL_NOT_FOUND_URL',
  BAD_REQUEST = 'BAD_REQUEST',
  EXISTED_ERROR = 'EXISTED_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  BLOCKED = 'BLOCKED',
  INACTIVE = 'INACTIVE',
  DATA_INVALID = 'DATA_INVALID',
}

export enum API_METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiRequest = {
  service: ApiService;
  url: string;
  method: API_METHOD;
  params?: Record<string, unknown>;
  data?: Record<string, unknown> | FormData;
  extraHeaders?: AxiosRequestHeaders;
  authToken?: boolean;
  timeout?: number;
  download?: boolean;
};

export type ApiResult<T> = {
  data: T;
  message: string;
  code: API_ERROR | number;
  error?: API_ERROR | string | number | undefined;
};

// export type ApiResponse = {
//   success: boolean;
//   data: undefined;
//   errorCode: API_ERROR;
//   errorMsg?: string;
// };
export type ApiResponse = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any;
  message: string;
  code: number;
};

export type ServiceResponse<T, S extends string> = {
  data?: T;
  errors?: Record<S, boolean>;
  message?: string;
};

export type OptionData<T> = {
  name: string;
  value: T;
};

export interface FindAndCountResponse<T> {
  page?: T[];
  index?: number;
  current_page?: number;
  length?: number;
  total_items?: number;
  page_size?: number;
  next?: number;
}

export interface SuccessResponse {
  success: boolean;
}

export interface CountResponse {
  count: number;
}

export interface DeleteResponse {
  deletedCount: number;
}

export interface StringResponse {
  dataString: string;
}

export const API_ERROR_CODE = {
  URL_NOT_FOUND_URL: 404,
  UNAUTHORIZED: 403,
  ACCESS_DENIED: 401,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};

export const getApiErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case API_ERROR_CODE.UNAUTHORIZED.toString():
      return 'Unauthorized. Please check your credentials.';
    case API_ERROR_CODE.ACCESS_DENIED.toString():
      return 'Access Denied. You do not have permission.';
    case API_ERROR_CODE.URL_NOT_FOUND_URL.toString():
      return 'URL not found. Please check the API endpoint.';
    case API_ERROR_CODE.BAD_REQUEST.toString():
      return 'Bad request. Please try again later.';
    case API_ERROR_CODE.SERVER_ERROR.toString():
      return 'Server error. Please try again later.';

    default:
      return 'An unknown error occurred.';
  }
};

export interface CommonFilters extends Record<string, unknown> {
  page?: number;
  limit?: number;
  isInfiniteList?: boolean;
}

export type CommonFiltersType = CommonFilters;
