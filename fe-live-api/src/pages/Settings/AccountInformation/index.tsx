import AppAlert from '@/components/AppAlert';
import {
  ConfirmationModalProps,
  ConfirmModal,
} from '@/components/ConfirmationModal';
import FormErrorMessage from '@/components/FormErrorMsg';
import ImageUpload from '@/components/ImageUpload';
import {
  NotificationModalProps,
  NotifyModal,
} from '@/components/NotificationModal';
import RequiredInput from '@/components/RequiredInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { NotifyModalType } from '@/components/UITypes';
import { UserProfileInfoUpdateRequest } from '@/data/dto/user';
import { updateAccountProfile } from '@/data/model/userAccount';
import { modalTexts } from '@/data/user';
import useUserAccount from '@/hooks/useUserAccount';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import { updateUserProfileInfo, UserInfoUpdateError } from '@/services/user';
import { useEffect, useState } from 'react';

const validationRules = {
  displayName: 'Required, max 50 characters.',
  avatar: 'Required, max 1 MB size.',
  common: 'Something went wrong. Please try again.',
};

type UserInfoUpdateFormError = {
  displayNameFailure: boolean;
  avatarImageFailure: boolean;
  actionFailure: boolean;
};

const AccountInformation = () => {
  const currentUser = useUserAccount();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarImage, setAvatarImage] = useState<{
    file: null | File;
    preview: null | string;
  }>({
    file: null,
    preview: null,
  });
  const [formError, setFormError] = useState<UserInfoUpdateFormError>({
    displayNameFailure: false,
    avatarImageFailure: false,
    actionFailure: false,
  });
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps>({
    type: NotifyModalType.SUCCESS,
    isOpen: false,
    title: '',
    description: '',
    onClose: undefined,
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

  const handleDisplayNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDisplayName(e.target.value);

    const error = {
      displayNameFailure: false,
      actionFailure: false,
    };

    setFormError((prevState: UserInfoUpdateFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleImagesChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
      setFormError((prevError: UserInfoUpdateFormError) => ({
        ...prevError,
        actionFailure: false,
        avatarImageFailure: false,
      }));
    } else {
      setAvatarImage({ file: null, preview: null });
      setFormError((prevError: UserInfoUpdateFormError) => ({
        ...prevError,
        avatarImageFailure: true,
      }));
    }
  };

  const handleFormSubmit = async (
    event: React.SyntheticEvent
  ): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    const { data, errors: _errors } = await updateUserProfileInfo({
      displayName,
      avatarFile: avatarImage.file || null,
      avatarPreview: avatarImage.preview || null,
    });

    if (!!data && !_errors) {
      // set ui according to response
      setDisplayName(data?.display_name);

      // clear errors
      setFormError({
        displayNameFailure: false,
        avatarImageFailure: false,
        actionFailure: false,
      });

      // update ls to reflect across the app
      updateAccountProfile(data?.display_name, data?.avatar_file_url);

      // emit an event so that header profile can update
      EventEmitter.emit(EVENT_EMITTER_NAME.USER_PROFILE_UPDATE, {
        displayName,
        avatarFile: data?.avatar_file_url,
      } as UserProfileInfoUpdateRequest);

      openNotifyModal(
        NotifyModalType.SUCCESS,
        modalTexts.updateInfo.success.title,
        modalTexts.updateInfo.success.description
      );
    } else {
      if (_errors) {
        const formError: UserInfoUpdateFormError = {
          displayNameFailure:
            _errors?.[UserInfoUpdateError.INVALID_DISPLAY_NAME] || false,
          avatarImageFailure:
            _errors?.[UserInfoUpdateError.AVATAR_FILE_ERROR] || false,
          actionFailure: _errors?.[UserInfoUpdateError.ACTION_FAILURE] || false,
        };

        const { displayNameFailure, avatarImageFailure } = formError;
        setFormError((prevError: UserInfoUpdateFormError) => ({
          ...prevError,
          displayNameFailure,
          avatarImageFailure,
        }));
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setDisplayName(currentUser?.display_name || '');
    setAvatarImage((prevData) => ({
      ...prevData,
      preview: currentUser?.avatar_file_name || '',
    }));
  }, [currentUser]);

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
    description: string | JSX.Element,
    onClose?: () => void
  ): void => {
    closeConfirmationModal();
    setNotifyModal({
      type,
      title,
      description,
      isOpen: true,
      onClose,
    });
  };
  const closeNotifyModal = (): void => {
    if (notifyModal.onClose) {
      notifyModal.onClose();
    }

    setNotifyModal({
      type: NotifyModalType.SUCCESS,
      title: '',
      description: '',
      isOpen: false,
      onClose: undefined,
    });
  };

  const { actionFailure, displayNameFailure, avatarImageFailure } = formError;
  let invalidDisplayNameError = null,
    invalidAvatarImageError = null,
    somethingWrongError = null;
  if (displayNameFailure) invalidDisplayNameError = validationRules.displayName;
  if (avatarImageFailure) invalidAvatarImageError = validationRules.avatar;
  if (actionFailure) {
    somethingWrongError = validationRules.common;
    invalidDisplayNameError = '';
    invalidAvatarImageError = '';
  }

  const displayNameInputInvalid = displayNameFailure || actionFailure;
  const avatarInputInvalid = avatarImageFailure || actionFailure;

  return (
    <div>
      <div className="p-4 pt-0 px-0 rounded-md">
        <div className="p-5 border rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg md:text-xl font-medium">
              Update your information
            </h3>
          </div>
          <Separator className="my-3" />

          <form
            className="flex flex-col gap-4 pt-2"
            onSubmit={handleFormSubmit}
          >
            {somethingWrongError && (
              <AppAlert
                variant="destructive"
                title="Error"
                description={validationRules.common}
              />
            )}

            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-start gap-4 lg:gap-8 lg:w-1/2">
              {/* Input Fields */}
              <div className="flex flex-col flex-1 gap-4">
                {/* Display Name */}
                <div className="grid gap-3">
                  <Label htmlFor="displayName">
                    Display Name <RequiredInput />
                  </Label>
                  <Input
                    value={displayName}
                    onChange={handleDisplayNameChange}
                    id="displayName"
                    type="text"
                    placeholder="..."
                    disabled={isLoading}
                    className={`${
                      displayNameInputInvalid
                        ? 'ring-red-500 border-red-500'
                        : ''
                    } w-full`}
                  />
                  {invalidDisplayNameError && (
                    <FormErrorMessage
                      classes="-mt-2"
                      message={invalidDisplayNameError}
                    />
                  )}
                </div>

                {/* Username */}
                <div className="flex flex-col gap-2 mt-2">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    value={currentUser?.username || 'NA'}
                    disabled
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground -mt-1">
                    Your username can be used to login to the system and
                    searched by others.
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2 mt-2">
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={currentUser?.email || 'NA'}
                    disabled
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground -mt-1">
                    Your email is private. You can also use your email to login.
                  </span>
                </div>
              </div>

              {/* Avatar Image Uploader */}
              <div className="grid gap-3 lg:items-start">
                <Label htmlFor="description">
                  Profile Photo <RequiredInput />
                </Label>
                <span className="text-xs text-muted-foreground -mt-1">
                  The maximum file size allowed is 1 MB.
                </span>
                <ImageUpload
                  isError={avatarInputInvalid}
                  isDisabled={isLoading}
                  width="w-40"
                  height="h-40"
                  preview={avatarImage.preview || ''}
                  onFileChange={(file) => {
                    if (file) handleImagesChange(file);
                    else handleImagesChange(null);
                  }}
                />
                {invalidAvatarImageError && (
                  <FormErrorMessage
                    classes="-mt-2"
                    message={invalidAvatarImageError}
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'} profile
              </Button>
            </div>
          </form>
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
    </div>
  );
};

export default AccountInformation;
