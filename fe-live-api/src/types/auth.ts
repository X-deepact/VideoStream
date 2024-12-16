export type RegisterAccountFields = {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword?: string;
};

export interface TwoFAResponse {
  secret?: string;
  qr_code?: string;
  is2fa_enabled: boolean;
}

export interface VerifyTwoFAResponse {
  is_verified: boolean;
}
