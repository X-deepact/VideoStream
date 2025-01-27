import {
  apiChange2FactorAuth,
  apiFetch2FactorAuth,
  apiChangePassword,
  apiVerity2FactorAuthWithOTP,
  apiUpdateUserProfileInfo,
} from '@/api/user';
import { ServiceResponse } from '@/data/api';
import {
  User2FACheckResponse,
  User2FAVerityResponse,
  ChangePasswordRequest,
  UserProfileInfoUpdateResponse,
  ChangePasswordResponse,
  UserProfileInfoUpdateRequest,
} from '@/data/dto/user';
import { MAX_DISPLAY_NAME_COUNT, AUTH2FA_OTP_LENGTH } from '@/data/validations';

export enum Verity2FAError {
  INVALID_OTP = 'INVALID_OTP',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export enum UserInfoUpdateError {
  INVALID_DISPLAY_NAME = 'INVALID_DISPLAY_NAME',
  AVATAR_FILE_ERROR = 'AVATAR_FILE_ERROR',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export enum ChangePasswordError {
  INVALID_CURRENT_PASSWORD = 'INVALID_CURRENT_PASSWORD',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export const fetch2FactorAuth = async (): Promise<User2FACheckResponse> => {
  const { data } = await apiFetch2FactorAuth();
  return data;
};

export const verity2FactorAuthWithOTP = async (
  otpCode: string
): Promise<ServiceResponse<User2FAVerityResponse, Verity2FAError>> => {
  const errors: Partial<Record<Verity2FAError, boolean>> = {};
  let otpFailure = false;

  if (!otpCode || otpCode.length !== AUTH2FA_OTP_LENGTH) otpFailure = true;

  let result: User2FAVerityResponse | undefined = undefined;
  let msg: string = '';
  if (!otpFailure) {
    const { data, message, code } = await apiVerity2FactorAuthWithOTP(otpCode);
    if (data && code !== 500) {
      result = { is_verified: data.is_verified };
    } else {
      msg = message;
      if (code === 500) errors[Verity2FAError.INVALID_OTP] = true;
    }
  } else {
    errors[Verity2FAError.INVALID_OTP] = otpFailure;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<Verity2FAError, boolean>)
      : undefined,
    message: msg,
  };
};

export const change2FactorAuth = async (
  isEnabled: boolean
): Promise<User2FACheckResponse> => {
  const { data } = await apiChange2FactorAuth(isEnabled);
  return data;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<ServiceResponse<ChangePasswordResponse, ChangePasswordError>> => {
  const errors: Partial<Record<ChangePasswordError, boolean>> = {};

  let result: ChangePasswordResponse | undefined = undefined;
  let msg: string = '';
  const { data, message, code } = await apiChangePassword(payload);
  if (data && code !== 500) {
    result = {
      display_name: data.display_name,
      username: data.username,
      email: data.email,
      avatar_file_url: data.avatar_file_url,
      role_type: data.role_type,
    };
  } else {
    msg = message;
    if (code === 500) {
      errors[ChangePasswordError.INVALID_CURRENT_PASSWORD] = true;
    }
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<ChangePasswordError, boolean>)
      : undefined,
    message: msg,
  };
};

export const updateUserProfileInfo = async (
  payload: UserProfileInfoUpdateRequest
): Promise<
  ServiceResponse<UserProfileInfoUpdateResponse, UserInfoUpdateError>
> => {
  const { displayName, avatarFile, avatarPreview } = payload;

  const errors: Partial<Record<UserInfoUpdateError, boolean>> = {};
  const invalidDisplayName =
    !displayName || displayName.length > MAX_DISPLAY_NAME_COUNT;
  const invalidAvatar = !avatarFile && !avatarPreview;

  let result: UserProfileInfoUpdateResponse | undefined = undefined;
  let msg: string = '';
  if (!invalidDisplayName && !invalidAvatar) {
    const { data, message, code } = await apiUpdateUserProfileInfo(payload);

    if (data && code !== 500) {
      result = {
        display_name: data.display_name,
        username: data.username,
        email: data.email,
        avatar_file_url: data.avatar_file_url,
        role_type: data.role_type,
      };
    } else {
      msg = message;
      errors[UserInfoUpdateError.ACTION_FAILURE] = true;
    }
  } else {
    errors[UserInfoUpdateError.INVALID_DISPLAY_NAME] = invalidDisplayName;
    errors[UserInfoUpdateError.AVATAR_FILE_ERROR] = invalidAvatar;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<UserInfoUpdateError, boolean>)
      : undefined,
    message: msg,
  };
};
