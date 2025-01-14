import { AppPagination } from '@/components/AppPagination';
import InlineLoading from '@/components/InlineLoading';
import NotFoundCentered from '@/components/NotFoundCentered';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';
import useSubscriptions from '@/hooks/useSubscriptions';
import AppLayout from '@/layouts/AppLayout';
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

const title = 'Subscriptions';

const Subscriptions = () => {
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
    setSubscriptions,
    totalItems,
    isLoading,
    error: isFetchingError,
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
      toast.success('Subscription Removed!');
    }
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
    <AppLayout>
      <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
        <div className="w-full">
          <LayoutHeading title={`${title} (${totalItems})`} />
        </div>

        {!isLoading && !isFetchingError && (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-x-10 w-full mt-6">
            {subscriptions?.map((sub) => (
              <div key={sub.id}>
                <SubscriptionItem
                  avatarUrl={sub.streamer_avatar_url}
                  displayName={sub.streamer_name}
                  subscriptionsCount={sub.num_subscribed}
                  videosCount={sub.num_video}
                  onSubUnsub={() => handleUnsubscribe(sub.streamer_id)}
                />
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isFetchingError && subscriptions.length > 0 && (
          <div className="flex justify-center mt-6">
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
          Icon={<UsersRound className="text-white" />}
          title="No Subscription Found!"
          description="Subscribe to your favorite streamers not to miss their contents."
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
    </AppLayout>
  );
};

export default Subscriptions;
