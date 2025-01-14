import AppAlert from '@/components/AppAlert';
import FormErrorMessage from '@/components/FormErrorMsg';
import { Icons } from '@/components/Icons';
import RequiredInput from '@/components/RequiredInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { LOGIN_PATH } from '@/data/route';
import {
  FORGOT_PASSWORD_OTP_LENGTH,
  ForgotPasswordSchema,
} from '@/data/validations';
import { capitalizeFirstLetter } from '@/lib/utils';
import { forgotPassword } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const UserAuthForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (formData: {
    usernameOrEmail: string;
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);

    const { usernameOrEmail, otpCode, newPassword } = formData;
    const { data, message } = await forgotPassword({
      usernameOrEmail,
      otpCode,
      newPassword,
    });

    setIsLoading(false);

    if (data && data?.success) {
      reset();
      setIsSuccessModalOpen(true);
    } else {
      setError('root', {
        type: 'manual',
        message,
      });
    }
  };

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate(LOGIN_PATH);
  };

  return (
    <div className="grid gap-6">
      <Dialog open={isSuccessModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Password Reset Successful</DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <DialogFooter>
            <Button onClick={handleModalClose} className="mt-4">
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2 space-y-3">
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email or Username <RequiredInput />
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="text"
              autoFocus
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('usernameOrEmail')}
              className={`${
                errors.usernameOrEmail
                  ? 'ring-red-500 border border-red-500'
                  : ''
              }`}
            />
            {errors.usernameOrEmail && (
              <FormErrorMessage
                message={capitalizeFirstLetter(
                  String(errors.usernameOrEmail?.message)
                )}
              />
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">
              OTP Code <RequiredInput />
            </Label>
            <Controller
              name="otpCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputOTP
                  {...field}
                  pattern={REGEXP_ONLY_DIGITS}
                  maxLength={FORGOT_PASSWORD_OTP_LENGTH}
                  className={
                    errors.otpCode ? 'ring-red-500 border-red-500' : ''
                  }
                >
                  <InputOTPGroup>
                    {Array.from(
                      { length: FORGOT_PASSWORD_OTP_LENGTH },
                      (_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      )
                    )}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otpCode && (
              <FormErrorMessage
                message={capitalizeFirstLetter(String(errors.otpCode?.message))}
              />
            )}
          </div>
          <div className="grid gap-1 mt-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">
                Password <RequiredInput />
              </Label>
            </div>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register('newPassword')}
              className={`${
                errors.newPassword ? 'ring-red-500 border border-red-500' : ''
              }`}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message &&
                  String(errors.newPassword.message)}
              </p>
            )}
          </div>

          <div className="grid gap-1 mt-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="confirm-password">
                Confirm Password <RequiredInput />
              </Label>
            </div>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              className={`${
                errors.confirmPassword
                  ? 'ring-red-500 border border-red-500'
                  : ''
              }`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <FormErrorMessage
                message={String(errors.confirmPassword?.message)}
              />
            )}

            {errors?.root?.message && (
              <AppAlert
                className="mt-2"
                variant="destructive"
                title="Failed to reset password!"
                description={capitalizeFirstLetter(
                  String(errors.root?.message)
                )}
              />
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="mt-3">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? 'Processing...' : 'Forgot Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserAuthForm;
