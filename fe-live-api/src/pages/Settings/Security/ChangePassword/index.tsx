import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ChangePasswordSchema } from '@/data/validations';
import { Icons } from '@/components/Icons';
import { changePassword, ChangePasswordError } from '@/services/user';
import { z } from 'zod';
import {
  NotificationModalProps,
  NotifyModal,
} from '@/components/NotificationModal';
import {
  ConfirmationModalProps,
  ConfirmModal,
} from '@/components/ConfirmationModal';
import { NotifyModalType } from '@/components/UITypes';
import { modalTexts } from '@/data/user';
import RequiredInput from '@/components/RequiredInput';
import AppAlert from '@/components/AppAlert';

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [notifyModal, setNotifyModal] = useState<NotificationModalProps>({
    type: NotifyModalType.SUCCESS,
    isOpen: false,
    title: '',
    description: '',
  });
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalProps>({
    isDanger: false,
    isOpen: false,
    title: '',
    description: '',
    proceedBtnText: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);

    const { newPassword, currentPassword } = formData;
    const {
      data,
      errors: _errors,
      message,
    } = await changePassword({
      newPassword,
      currentPassword,
    });

    setIsLoading(false);

    if (data && data?.username && !_errors) {
      reset();
      handleToggleChangePasswordForm();

      openNotifyModal(
        NotifyModalType.SUCCESS,
        modalTexts.changePassword.success.title,
        modalTexts.changePassword.success.description
      );
    } else {
      if (_errors) {
        if (_errors[ChangePasswordError.INVALID_CURRENT_PASSWORD]) {
          setError('currentPassword', {
            type: 'manual',
            message: message || 'Current password is invalid',
          });
        } else {
          setError('currentPassword', {
            type: 'manual',
            message: 'Something went wrong. Please try again later.',
          });
        }
      }
    }
  };

  const handleToggleChangePasswordForm = () => setIsFormOpen(!isFormOpen);

  // Modal dialogs
  const closeConfirmationModal = (): void => {
    setConfirmModal({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
      onCancel: () => {},
    });
  };
  const openNotifyModal = (
    type: NotifyModalType,
    title: string,
    description: string | JSX.Element
  ): void => {
    setNotifyModal({
      type,
      title,
      description,
      isOpen: true,
    });
  };
  const closeNotifyModal = (): void => {
    setNotifyModal({
      title: '',
      description: '',
      isOpen: false,
    });
  };

  return (
    <div>
      <div className="p-5 border rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-medium">Password</h3>
          <Button
            onClick={handleToggleChangePasswordForm}
            size="sm"
            variant="outline"
          >
            {isFormOpen ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        <Separator className="my-3" />

        {!isFormOpen ? (
          <p className="text-sm text-muted-foreground mt-3">
            Strengthen your account by ensuring your password is strong
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full lg:w-1/3 md:w-1/2">
              {errors.root && (
                <AppAlert
                  variant="destructive"
                  title="Error"
                  description={errors?.root?.toString()}
                />
              )}
              <div className="flex gap-1 items-center">
                <Label htmlFor="currentPassword">Current Password</Label>
                <RequiredInput />
              </div>
              <Input
                className={`${
                  errors.currentPassword
                    ? 'ring-red-500 border border-red-500'
                    : ''
                }`}
                disabled={isLoading}
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.currentPassword.message &&
                    capitalizeFirstLetter(
                      String(errors.currentPassword.message)
                    )}
                </p>
              )}
            </div>

            <div className="w-full lg:w-1/3 md:w-1/2">
              <div className="flex gap-1 items-center">
                <Label htmlFor="newPassword">New Password</Label>
                <RequiredInput />
              </div>
              <Input
                className={`${
                  errors.newPassword ? 'ring-red-500 border border-red-500' : ''
                }`}
                disabled={isLoading}
                id="newPassword"
                type="password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword.message &&
                    String(errors.newPassword.message)}
                </p>
              )}
            </div>

            <div className="w-full lg:w-1/3 md:w-1/2">
              <div className="flex gap-1 items-center">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <RequiredInput />
              </div>
              <Input
                className={`${
                  errors.confirmPassword
                    ? 'ring-red-500 border border-red-500'
                    : ''
                }`}
                disabled={isLoading}
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message &&
                    String(errors.confirmPassword.message)}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        )}
      </div>

      <NotifyModal
        type={notifyModal.type}
        isOpen={notifyModal.isOpen}
        title={notifyModal.title}
        description={notifyModal.description}
        onClose={closeNotifyModal}
      />
      <ConfirmModal
        isDanger={confirmModal.isDanger}
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        proceedBtnText={confirmModal.proceedBtnText}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
};

export default ChangePassword;
