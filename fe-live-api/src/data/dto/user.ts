export interface User2FACheckResponse {
  secret: string;
  qr_code: string;
  is2fa_enabled: boolean;
}

export interface User2FAVerityResponse {
  is_verified: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileInfoUpdateRequest {
  displayName: string;
  avatarFile?: File | null | string;
  avatarPreview?: string | null;
}

export interface UserProfileInfoUpdateResponse {
  username: string;
  display_name: string;
  avatar_file_url: string;
  email: string;
  role_type: string;
}

export type ChangePasswordResponse = UserProfileInfoUpdateResponse;
