import { z } from 'zod';

export const MAX_CATEGORY_COUNT = 3;
export const AUTH2FA_OTP_LENGTH = 6;
export const FORGOT_PASSWORD_OTP_LENGTH = 6;
export const MAX_DISPLAY_NAME_COUNT = 50;
export const MAX_IMAGE_SIZE_IN_MB = 1;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

// pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DATA_API_LIMIT = {
  sm: 5,
  md: 8,
  lg: 12,
};

export const RECORD_VIEW_AFTER_SECONDS = 10; // 10 seconds

export const PasswordRules = {
  min: 8,
};

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty('Current password is required'),
    newPassword: z
      .string()
      .min(
        PasswordRules.min,
        `New password must be at least ${PasswordRules.min} characters`
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z
  .object({
    usernameOrEmail: z.string().nonempty('Username or Email is required'),
    otpCode: z.string().min(6, {
      message: 'Your OTP must be 6 characters.',
    }),
    newPassword: z
      .string()
      .min(
        PasswordRules.min,
        `New password must be at least ${PasswordRules.min} characters`
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const StreamDetailsRules = {
  title: {
    min: 1,
    max: 100,
  },
  description: {
    min: 1,
    max: 500,
  },
};
