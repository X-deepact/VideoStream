import { API_METHOD, ApiRequest, ApiResult, ApiService } from '@/data/api';
import { LoginUserResponse, RegisterUserResponse } from '@/data/dto/auth';
import { liveStreamApi } from './utils';
import { RegisterAccountFields, VerifyTwoFAResponse, TwoFAResponse } from '@/types/auth';

const AUTH_API = '/auth';
const LOGIN_API = AUTH_API + '/login';
const REGISTER_API = AUTH_API + '/register';

export const apiLogin = async (
  emailOrUsername: string,
  password: string
): Promise<ApiResult<LoginUserResponse>> => {
  const requestBody = {
    username: emailOrUsername, // key can be username or email
    password,
  };

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: LOGIN_API,
    method: API_METHOD.POST,
    data: requestBody,
    authToken: false,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: LoginUserResponse = {} as LoginUserResponse;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiRegister = async ({
  email,
  username,
  displayName,
  password,
}: RegisterAccountFields): Promise<ApiResult<RegisterUserResponse>> => {
  // const requestBody = {
  //   email,
  //   username,
  //   display_name: displayName,
  //   password,
  //   avatar,
  // };

  // note: api changed to accept avatar, so this needs to be form data.
  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('display_name', displayName);
  formData.append('password', password);
  // formData.append('avatar', null);

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: REGISTER_API,
    method: API_METHOD.POST,
    data: formData,
    authToken: false,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: RegisterUserResponse = {} as RegisterUserResponse;
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const api2FAInfo = async (): Promise<ApiResult<TwoFAResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: '/user/get-2fa',
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  return {
    data: success ? responseData?.data : undefined,
    message,
    code,
  };
};

export const apiChange2FAStatus = async (
  isEnabled: boolean
): Promise<ApiResult<TwoFAResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: '/user/change-2fa',
    method: API_METHOD.PUT,
    data: { is_enabled: isEnabled },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  return {
    data: success ? responseData?.data : undefined,
    message,
    code,
  };
};

export const apiVerify2FA = async (
  otp: string
): Promise<ApiResult<VerifyTwoFAResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: '/user/verify-2fa',
    method: API_METHOD.POST,
    data: { otp },
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  return {
    data: success ? responseData?.data : undefined,
    message,
    code,
  };
};
