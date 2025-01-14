import _ from 'lodash';
import { apiForgotPassword, apiLogin, apiRegister } from '@/api/auth';
import { ServiceResponse, SuccessResponse } from '@/data/api';
import {
  ForgotPasswordRequest,
  LoginUserResponse,
  RegisterUserResponse,
} from '@/data/dto/auth';
import { authAccount } from '@/data/model/userAccount';
import { RegisterAccountFields } from '@/data/types/auth';
import { PasswordRules } from '@/data/validations';
import moment from 'moment';

export enum LoginError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
}

export enum RegisterError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_DISPLAY_NAME = 'INVALID_DISPLAY_NAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_CONFIRM_PASSWORD = 'INVALID_CONFIRM_PASSWORD',
  REGISTER_FAILED = 'REGISTER_FAILED',
  ACCOUNT_EXISTED = 'ACCOUNT_EXISTED',
}

export enum ForgotPasswordError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_OTP_CODE = 'INVALID_OTP_CODE',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export const login = async (
  emailOrUsername: string,
  pwd: string
): Promise<ServiceResponse<LoginUserResponse, LoginError>> => {
  let errors: Partial<Record<LoginError, boolean>> = {};
  let usernameFailure = false,
    passwordFailure = false;
  if (!emailOrUsername) usernameFailure = true;
  if (!pwd) passwordFailure = true;

  let result: LoginUserResponse | undefined = undefined;
  let msg: string = '';
  if (!usernameFailure && !passwordFailure) {
    const { data, message, error } = await apiLogin(emailOrUsername, pwd);
    if (!error && !_.isEmpty(data)) {
      errors = {};
      const {
        id,
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,
        token,
        expiration_time,
      } = data;

      authAccount(
        id || '',
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,
        token,
        moment(expiration_time)
      );
      result = {
        id,
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,

        token,
        expiration_time,
      };
    } else {
      msg = message;
      errors[LoginError.LOGIN_FAILED] = true;
    }
  } else {
    errors[LoginError.INVALID_USERNAME] = usernameFailure;
    errors[LoginError.INVALID_PASSWORD] = passwordFailure;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<LoginError, boolean>)
      : undefined,
    message: msg,
  };
};

export const register = async ({
  username,
  email,
  displayName,
  password,
  confirmPassword,
}: RegisterAccountFields): Promise<
  ServiceResponse<RegisterUserResponse, RegisterError>
> => {
  let errors: Partial<Record<RegisterError, boolean>> = {};
  let emailFailure = false,
    usernameFailure = false,
    displayNameFailure = false,
    passwordFailure = false,
    confirmPasswordFailure = false;

  if (!email) emailFailure = true;
  if (!username) usernameFailure = true;
  if (!displayName || displayName?.includes('-')) displayNameFailure = true;
  if (!password || password.length < PasswordRules.min) passwordFailure = true;
  if (!confirmPassword || password !== confirmPassword)
    confirmPasswordFailure = true;

  let result: RegisterUserResponse | undefined = undefined;
  let msg: string = '';
  if (
    !emailFailure &&
    !usernameFailure &&
    !displayNameFailure &&
    !passwordFailure &&
    !confirmPasswordFailure
  ) {
    const { data, error, message } = await apiRegister({
      email,
      username,
      displayName,
      password,
    });
    if (!error && !_.isEmpty(data)) {
      errors = {};
      const {
        id,
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,
        token,
        expiration_time,
      } = data; // code, message, data

      authAccount(
        id || '',
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,
        token,
        moment(expiration_time)
      );
      result = {
        id,
        email,
        username,
        display_name,
        avatar_file_url,
        role_type,

        token,
        expiration_time,
      };
    } else {
      msg = message;
    }
  } else {
    errors[RegisterError.INVALID_EMAIL] = emailFailure;
    errors[RegisterError.INVALID_USERNAME] = usernameFailure;
    errors[RegisterError.INVALID_DISPLAY_NAME] = displayNameFailure;
    errors[RegisterError.INVALID_PASSWORD] = passwordFailure;
    errors[RegisterError.INVALID_CONFIRM_PASSWORD] = confirmPasswordFailure;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<RegisterError, boolean>)
      : undefined,
    message: msg,
  };
};

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ServiceResponse<SuccessResponse, ForgotPasswordError>> => {
  const errors: Partial<Record<ForgotPasswordError, boolean>> = {};

  const result: SuccessResponse = {
    success: false,
  };
  let msg: string = '';
  const { data, message } = await apiForgotPassword(payload);

  if (data && !data?.success) {
    msg = message;
  } else {
    result.success = true;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<ForgotPasswordError, boolean>)
      : undefined,
    message: msg,
  };
};
