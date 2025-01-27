import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService,
  SuccessResponse,
} from '@/data/api';
import {
  ForgotPasswordRequest,
  LoginUserResponse,
  RegisterUserResponse,
} from '@/data/dto/auth';
import { liveStreamApi } from './utils';
import { RegisterAccountFields } from '@/data/types/auth';

const AUTH_API = '/auth';
const LOGIN_API = AUTH_API + '/login';
const REGISTER_API = AUTH_API + '/register';
const FORGOT_PASSWORD_API = AUTH_API + '/forgot-password';

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
  const requestBody = {
    email,
    username,
    display_name: displayName,
    password,
  };

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: REGISTER_API,
    method: API_METHOD.POST,
    data: requestBody,
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

export const apiForgotPassword = async ({
  usernameOrEmail,
  otpCode,
  newPassword,
}: ForgotPasswordRequest): Promise<ApiResult<SuccessResponse>> => {
  const payload = {
    username: usernameOrEmail,
    otp: otpCode,
    password: newPassword,
  };

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: FORGOT_PASSWORD_API,
    method: API_METHOD.PUT,
    authToken: false,
    data: payload,
  };

  const apiResponse = await liveStreamApi(request);
  const { data, code, message } = apiResponse; // success -> data: { message: 'Successful', code: 200 }

  return {
    data: { success: data?.code === 200 },
    message,
    code,
  };
};
