import { liveStreamApi } from './utils';
import {
  User2FACheckResponse,
  User2FAVerityResponse,
  ChangePasswordRequest,
  UserProfileInfoUpdateResponse,
  ChangePasswordResponse,
  UserProfileInfoUpdateRequest,
} from '@/data/dto/user';
import { API_METHOD, ApiRequest, ApiResult, ApiService } from '@/data/api';

const USER_API = '/user';
const USER_UPDATE_API = USER_API + '/update';
const USER_2FA_CHECK_API = USER_API + '/get-2fa';
const USER_2FA_VERIFY_API = USER_API + '/verify-2fa';
const USER_2FA_CHANGE_API = USER_API + '/change-2fa';

export const apiFetch2FactorAuth = async (): Promise<
  ApiResult<User2FACheckResponse>
> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: USER_2FA_CHECK_API,
    method: API_METHOD.GET,
    authToken: true,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: User2FACheckResponse = {
    secret: '',
    qr_code: '',
    is2fa_enabled: false,
  };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiVerity2FactorAuthWithOTP = async (
  otpCode: string
): Promise<ApiResult<User2FAVerityResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: USER_2FA_VERIFY_API,
    method: API_METHOD.POST,
    authToken: true,
    data: { otp: otpCode },
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: User2FAVerityResponse = {
    is_verified: false,
  };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiChange2FactorAuth = async (
  isEnabled: boolean
): Promise<ApiResult<User2FACheckResponse>> => {
  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: USER_2FA_CHANGE_API,
    method: API_METHOD.PUT,
    authToken: true,
    data: { is_enabled: isEnabled },
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: User2FACheckResponse = {
    secret: '',
    qr_code: '',
    is2fa_enabled: false,
  };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiChangePassword = async ({
  currentPassword,
  newPassword,
}: ChangePasswordRequest): Promise<ApiResult<ChangePasswordResponse>> => {
  const formData = new FormData();
  if (currentPassword) formData.append('password', currentPassword);
  if (newPassword) formData.append('new_password', newPassword);

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: USER_UPDATE_API,
    method: API_METHOD.PUT,
    authToken: true,
    data: formData,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: UserProfileInfoUpdateResponse = {
    username: '',
    display_name: '',
    avatar_file_url: '',
    email: '',
    role_type: '',
  };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};

export const apiUpdateUserProfileInfo = async ({
  displayName,
  avatarFile,
}: UserProfileInfoUpdateRequest): Promise<
  ApiResult<UserProfileInfoUpdateResponse>
> => {
  const formData = new FormData();
  if (displayName) formData.append('display_name', displayName);
  if (avatarFile) formData.append('avatar', avatarFile);

  const request: ApiRequest = {
    service: ApiService.liveStream,
    url: USER_UPDATE_API,
    method: API_METHOD.PUT,
    authToken: true,
    data: formData,
  };

  const apiResponse = await liveStreamApi(request);
  const { success, data: responseData, code, message } = apiResponse;

  let rp: UserProfileInfoUpdateResponse = {
    username: '',
    display_name: '',
    avatar_file_url: '',
    email: '',
    role_type: '',
  };
  if (success) {
    rp = responseData?.data;
  }

  return {
    data: rp,
    message,
    code,
  };
};
