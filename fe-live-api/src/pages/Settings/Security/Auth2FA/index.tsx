import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User2FACheckResponse } from '@/data/dto/user';
import { change2FactorAuth, fetch2FactorAuth } from '@/services/user';
import { Check, Ellipsis, Lock, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import User2FASetupModal from './User2FASetupModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import FullscreenLoading from '@/components/FullscreenLoading';

const Content = {
  '2FA': {
    title: 'Two-factor authentication',
    description:
      'Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.',
  },
};

const Auth2FA = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2fa
  const [user2FactorAuth, setUser2FactorAuth] =
    useState<User2FACheckResponse | null>(null);
  const [isUser2FAModalOpen, setIsUser2FAModalOpen] = useState(false);
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

  const handleGenerate2FA = async () => {
    // check first-time ever enabling 2fa
    let auth2FA = await fetch2FactorAuth();

    // if user has disabled 2fa before
    if (auth2FA && !auth2FA?.qr_code) {
      auth2FA = await change2FactorAuth(true); // TODO: this true
    }

    setUser2FactorAuth(auth2FA);
  };

  const handleVerify2FactorAuthSuccess = () => {
    setIsUser2FAModalOpen(false);
    setUser2FactorAuth((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        is2fa_enabled: true,
      };
    });
    openNotifyModal(
      NotifyModalType.SUCCESS,
      modalTexts.auth2FA.successEnable.title,
      modalTexts.auth2FA.successEnable.description
    );
  };

  const handleDisable2FA = () => {
    openConfirmModal(
      modalTexts.auth2FA.confirmToDisable.title,
      modalTexts.auth2FA.confirmToDisable.description,
      () => handleDisable2FAConfirmed(),
      true,
      'Confirm to Disable'
    );
  };

  const handleDisable2FAConfirmed = async () => {
    setIsLoading(true);
    const auth2FA = await change2FactorAuth(false);
    setIsLoading(false);

    if (auth2FA) {
      setUser2FactorAuth(auth2FA);

      handle2FADisabledSuccess();
    }
  };

  // Shows notify modal
  const handle2FADisabledSuccess = () => {
    openNotifyModal(
      NotifyModalType.SUCCESS,
      modalTexts.auth2FA.successDisable.title,
      modalTexts.auth2FA.successDisable.description
    );
  };

  // Fetch 2FA
  useEffect(() => {
    handleGenerate2FA();
  }, []);

  // Modal dialogs
  const openConfirmModal = (
    title: string,
    description: string | JSX.Element,
    onConfirm: () => void,
    isDanger?: boolean,
    proceedBtnText?: string
  ): void => {
    closeNotifyModal();
    setConfirmModal({
      isDanger,
      title,
      description,
      isOpen: true,
      proceedBtnText,
      onConfirm: () => {
        closeConfirmationModal();
        onConfirm();
      },
      onCancel: closeConfirmationModal,
    });
  };
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
    closeConfirmationModal();
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
      <div className="mt-10 p-5 border rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-lg md:text-xl font-medium">
            Two-factor authentication{' '}
            {user2FactorAuth && user2FactorAuth?.is2fa_enabled && (
              <span className="md:hidden bg-green-600 text-white inline-flex rounded-full p-0.5">
                <Check className="h-4 w-4" />
              </span>
            )}
          </h3>
          {user2FactorAuth && user2FactorAuth?.is2fa_enabled && (
            <div className="flex items-center gap-3">
              <div className="hidden md:inline text-green-600 rounded-full text-xs px-2 py-1 border-green-600 border">
                Enabled
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-8 w-8 p-0" variant="ghost">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDisable2FA}
                    className="cursor-pointer"
                  >
                    <X className="text-red-500" /> Disable 2-factor
                    authentication
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        {user2FactorAuth && user2FactorAuth?.is2fa_enabled && (
          <p className="text-sm text-muted-foreground mt-3">
            {Content['2FA'].description}
          </p>
        )}

        {user2FactorAuth && !user2FactorAuth?.is2fa_enabled && (
          <div className="flex flex-col items-center justify-center text-center mt-5">
            <div className="p-2 bg-red-200 dark:bg-red-900 rounded-full">
              <Lock className="h-4 w-4 text-red-500 dark:text-red-300" />
            </div>
            <h3 className="text-lg font-medium">
              Two-factor authentication is not enabled yet.
            </h3>
            <p className="text-sm text-muted-foreground mt-3 max-w-[700px]">
              {Content['2FA'].description}
            </p>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-800 text-white mt-5"
              onClick={() => {
                setIsUser2FAModalOpen(true);
              }}
            >
              Enable two-factor authentication
            </Button>
            <User2FASetupModal
              isOpen={isUser2FAModalOpen}
              onOpenChange={setIsUser2FAModalOpen}
              data={user2FactorAuth}
              onRegenerate2FA={handleGenerate2FA}
              onVerifySuccess={handleVerify2FactorAuthSuccess}
            />
          </div>
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

      {isLoading && <FullscreenLoading />}
    </div>
  );
};

export default Auth2FA;
