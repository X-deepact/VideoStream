import { AppPagination } from '@/components/AppPagination';
import InlineLoading from '@/components/InlineLoading';
import NotFoundCentered from '@/components/NotFoundCentered';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';
import useSubscriptions from '@/hooks/useSubscriptions';
import LayoutHeading from '@/layouts/LayoutHeading';
import { UsersRound } from 'lucide-react';
import { useState } from 'react';
import SubscriptionItem from './SubscriptionItem';
import {
  ConfirmationModalProps,
  ConfirmModal,
} from '@/components/ConfirmationModal';
import { modalTexts } from '@/data/subscription';
import { subscribeUnsubscribe } from '@/services/stream';
import { toast } from 'sonner';
import ApiFetchingError from '@/components/ApiFetchingError';
import { toggleMuteNotificationsFromChannel } from '@/services/subscription';
import { RESOURCE_ID, STREAMER_PROFILE_PATH } from '@/data/route';
import { useNavigate } from 'react-router-dom';

const title = 'Subscriptions';

const Subscriptions = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalProps>({
    isDanger: false,
    isOpen: false,
    title: '',
    description: '',
    proceedBtnText: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // fetch subscriptions
  const {
    subscriptions,
    totalItems,
    isLoading,
    error: isFetchingError,
    setSubscriptions,
    setTotalItems,
    refetchSubscriptions,
  } = useSubscriptions({
    isInfiniteList: false,
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
  });

  const handleUnsubscribe = async (streamerId: number) => {
    openConfirmModal(
      modalTexts.unsubscribe.confirm.title,
      modalTexts.unsubscribe.confirm.description,
      () => handleUnsubscribeConfirmed(streamerId),
      true,
      'Confirm to Unsubscribe'
    );
  };
  const handleUnsubscribeConfirmed = async (streamerId: number) => {
    const isSuccess = await subscribeUnsubscribe(streamerId);
    if (isSuccess) {
      setSubscriptions((prev) => {
        const oldPrev = prev;
        return oldPrev.filter((d) => d.streamer_id !== streamerId);
      });
      setTotalItems((prev) => prev - 1);
      toast.success('Subscription Removed!');
    }
  };

  const handleToggleMuteNotifications = async (
    streamerId: number,
    isMute: boolean
  ) => {
    const oldData = isMute;
    const newData = !oldData;
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.streamer_id === streamerId ? { ...sub, is_mute: newData } : sub
      )
    );

    try {
      const isSuccess = await toggleMuteNotificationsFromChannel({
        isMute: newData,
        streamerId,
      });

      if (isSuccess?.success) {
        const action = newData ? 'muted' : 'turned on';
        toast.success(`Notification ${action}!`);
      } else {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.streamer_id === streamerId ? { ...sub, is_mute: oldData } : sub
          )
        );
        toast.error(
          `Failed to ${newData ? 'mute' : 'turn on'} the notification.`
        );
      }
    } catch {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.streamer_id === streamerId ? { ...sub, is_mute: oldData } : sub
        )
      );
      toast.error(
        `An error occurred while ${
          newData ? 'muting' : 'unmuting'
        } the notification.`
      );
    }
  };

  const handleGoToChannel = (id: number) => {
    navigate(STREAMER_PROFILE_PATH.replace(RESOURCE_ID, id?.toString()));
  };

  // Modal dialogs
  const openConfirmModal = (
    title: string,
    description: string | JSX.Element,
    onConfirm: () => void,
    isDanger?: boolean,
    proceedBtnText?: string
  ): void => {
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

  return (
    <div>
      <div className='flex flex-col justify-center items-center max-w-4xl mx-auto'>
        <div className='w-full'>
          <LayoutHeading title={`${title} (${totalItems})`} />
        </div>

        {!isLoading && !isFetchingError && (
          <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-x-10 w-full mt-6'>
            {subscriptions?.map((sub) => (
              <div key={sub.id}>
                <SubscriptionItem
                  avatarUrl={sub.streamer_avatar_url}
                  displayName={sub.streamer_name}
                  subscriptionsCount={sub.num_subscribed}
                  videosCount={sub.num_video}
                  isNotiMute={sub.is_mute}
                  onSubUnsub={() => handleUnsubscribe(sub.streamer_id)}
                  onToggleMuteNotifications={() =>
                    handleToggleMuteNotifications(sub.streamer_id, sub.is_mute)
                  }
                  onNavigateChannel={() => handleGoToChannel(sub.streamer_id)}
                />
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isFetchingError && subscriptions.length > 0 && (
          <div className='flex justify-center mt-6'>
            <AppPagination
              actions={{
                pages: {
                  totalCount: totalItems,
                  currentPage: currentPage,
                  limit: 10,
                  handlePageChange: (page) => setCurrentPage(page),
                },
              }}
            />
          </div>
        )}
      </div>

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && subscriptions.length === 0 && (
        <NotFoundCentered
          Icon={<UsersRound className='text-white' />}
          title='No Subscription Found!'
          description='Subscribe to your favorite streamers not to miss their contents.'
        />
      )}

      {isFetchingError && (
        <ApiFetchingError
          label="Sorry, can't fetch subscriptions right now!"
          isLoading={isLoading}
          onRefetch={refetchSubscriptions}
        />
      )}

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

export default Subscriptions;
