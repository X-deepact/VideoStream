interface UserResponse {
  id?: string;
  email: string;
  username: string;
  display_name: string;
  avatar_file_url: string;
  role_type: string;
}

export interface LoginUserResponse extends UserResponse {
  token: string;
  expiration_time?: string;
}

export interface RegisterUserResponse extends UserResponse {
  token: string;
  expiration_time?: string;
}

export interface ForgotPasswordRequest {
  usernameOrEmail: string;
  otpCode: string;
  newPassword: string;
}
