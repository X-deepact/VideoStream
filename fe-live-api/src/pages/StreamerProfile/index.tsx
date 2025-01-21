import ApiFetchingError from '@/components/ApiFetchingError';
import AppAvatar from '@/components/AppAvatar';
import AppButton from '@/components/AppButton';
import EndOfResults from '@/components/EndOfResults';
import InlineLoading from '@/components/InlineLoading';
import NotFoundCentered from '@/components/NotFoundCentered';
import { Button } from '@/components/ui/button';
import VideoItem from '@/components/VideoItem';
import { getLoggedInUserInfo } from '@/data/model/userAccount';
import { USER_ROLE } from '@/data/types/role';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';
import useStreamerDetails from '@/hooks/useStreamerDetails';
import useVideosList from '@/hooks/useVideosList';
import LayoutHeading from '@/layouts/LayoutHeading';
import {
  formatKMBCount,
  getAvatarFallbackText,
  getCorrectUnit,
} from '@/lib/utils';
import { subscribeUnsubscribe } from '@/services/stream';
import { toggleMuteNotificationsFromChannel } from '@/services/subscription';
import {
  BellOff,
  BellRing,
  Eye,
  MessageSquare,
  Share2,
  Sparkles,
  ThumbsUp,
  VideoOff,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const StreamerProfile = () => {
  const currentUser = getLoggedInUserInfo();

  const { id: streamerId } = useParams<{ id: string }>();

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const {
    data: streamerDetails,
    subscribedCount,
    isSubscribed,
    isNotiMuted,
    isLoading: isStreamerDetailsFetching,
    setSubscribedCount,
    setIsSubscribed,
    setIsNotiMuted,
  } = useStreamerDetails(streamerId || null);
  const {
    videos,
    hasMore,
    isLoading,
    error: isFetchingError,
    refetchVideos,
  } = useVideosList({
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
    // is_me: false,
    streamer_id: Number(streamerId),
  });

  const handleSubscribeUnsubscribe = async () => {
    if (streamerDetails && streamerDetails?.id) {
      const isSuccess = await subscribeUnsubscribe(streamerDetails?.id);
      if (isSuccess) {
        if (isSubscribed) {
          setSubscribedCount((prev) => prev - 1);
          toast.success(`Subscription Removed!`);
        } else {
          setSubscribedCount((prev) => prev + 1);
          toast.success(`Subscription Added!`);
        }

        setIsSubscribed(!isSubscribed);
      }
    }
  };

  const handleToggleMuteNotifications = async () => {
    const oldData = isNotiMuted;
    const newData = !oldData;
    setIsNotiMuted(newData);

    try {
      const isSuccess = await toggleMuteNotificationsFromChannel({
        isMute: newData,
        streamerId: Number(streamerDetails?.id),
      });

      if (isSuccess?.success) {
        const action = newData ? 'muted' : 'turned on';
        toast.success(`Notification ${action}!`);
      } else {
        setIsNotiMuted(oldData);
        toast.error(
          `Failed to ${newData ? 'mute' : 'turn on'} the notification.`
        );
      }
    } catch {
      setIsNotiMuted(oldData);
      toast.error(
        `An error occurred while ${
          newData ? 'muting' : 'unmuting'
        } the notification.`
      );
    }
  };

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node); // Observe the last element in the list
    },
    [isLoading, hasMore]
  );

  return (
    <div className="md:container lg:px-[10rem] md:mx-auto flex flex-col justify-center">
      <div className="w-full mb-3">
        <LayoutHeading
          title={`${
            currentUser?.role_type === USER_ROLE.STREAMER &&
            Number(currentUser.id) === Number(streamerId)
              ? 'My'
              : ''
          } Channel`}
        />
      </div>

      {/* profile */}
      {!isStreamerDetailsFetching && streamerDetails && (
        <div className="flex gap-3 border-b pb-5 pt-2">
          {/* avatar */}
          <AppAvatar
            url={streamerDetails.streamer_avatar_url}
            classes="w-28 h-28"
            fallback={getAvatarFallbackText(streamerDetails.streamer_name)}
          />
          {/* details */}
          <div>
            <p className="text-lg font-semibold">
              {streamerDetails.streamer_name}
            </p>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <p>
                {formatKMBCount(subscribedCount)}
                {getCorrectUnit(subscribedCount, 'subscriber')}
              </p>
              •
              <p>
                {formatKMBCount(streamerDetails.total_video)}
                {getCorrectUnit(streamerDetails.total_video, 'video')}
              </p>
            </div>
            {/* stats */}
            {/* <div className="flex gap-3 bg-muted/50 rounded-lg px-3 py-2 mt-2">
              <div className="flex gap-1 items-center justify-center text-xs">
                <ThumbsUp className="w-3 h-3" />
                {formatKMBCount(streamerDetails.total_like)} likes
              </div>
              <div className="flex gap-1 items-center justify-center text-xs">
                <MessageSquare className="w-3 h-3" />
                {formatKMBCount(streamerDetails.total_comment)} comments
              </div>
              <div className="flex gap-1 items-center justify-center text-xs">
                <Eye className="w-3 h-3" />
                {formatKMBCount(streamerDetails.total_view)} views
              </div>
              <div className="flex gap-1 items-center justify-center text-xs">
                <Share2 className="w-3 h-3" />
                {formatKMBCount(streamerDetails.total_share)} shares
              </div>
            </div> */}
            {/* subscribe and noti */}
            <div className="flex gap-2 mt-3 ml-0">
              {!streamerDetails?.is_me && (
                <Button
                  onClick={handleSubscribeUnsubscribe}
                  variant={`${isSubscribed ? 'secondary' : 'default'}`}
                  className="px-4 py-2 rounded-full"
                >
                  {isSubscribed ? (
                    <>
                      <Sparkles className="fill-primary text-primary" />
                      Subscribed
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              )}
              {isSubscribed && (
                <AppButton
                  className="rounded-full"
                  Icon={isNotiMuted ? BellOff : BellRing}
                  isIconActive={false}
                  label={
                    isNotiMuted ? 'Unmute Notification' : 'Mute Notification'
                  }
                  tooltipOnSmallScreens
                  size="icon"
                  variant="secondary"
                  onClick={() => handleToggleMuteNotifications()}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {streamerDetails && (
        <div className="flex gap-3 p-3 border-b">
          <div className="flex gap-1 items-center justify-center text-xs text-green-500">
            <ThumbsUp className="w-3 h-3" />
            {formatKMBCount(streamerDetails.total_like)}{' '}
            {getCorrectUnit(streamerDetails.total_like, 'like')}
          </div>
          <div className="flex gap-1 items-center justify-center text-xs text-purple-500">
            <MessageSquare className="w-3 h-3" />
            {formatKMBCount(streamerDetails.total_comment)}
            {getCorrectUnit(streamerDetails.total_comment, 'comment')}
          </div>
          <div className="flex gap-1 items-center justify-center text-xs text-orange-500">
            <Eye className="w-3 h-3" />
            {formatKMBCount(streamerDetails.total_view)}
            {getCorrectUnit(streamerDetails.total_view, 'view')}
          </div>
          <div className="flex gap-1 items-center justify-center text-xs text-yellow-500">
            <Share2 className="w-3 h-3" />
            {formatKMBCount(streamerDetails.total_share)}
            {getCorrectUnit(streamerDetails.total_share, 'share')}
          </div>
        </div>
      )}

      <div className="w-full my-3">
        <LayoutHeading title={`Videos (${streamerDetails?.total_video})`} />
      </div>
      <div className="flex flex-col justify-center gap-8 md:gap-4 mb-3">
        {!isFetchingError &&
          videos.length > 0 &&
          videos.map((video, index) => {
            if (videos.length === index + 1)
              return (
                <div key={index} ref={lastVideoElementRef}>
                  <VideoItem video={video} />
                </div>
              );
            else
              return (
                <div key={index}>
                  <VideoItem video={video} />
                </div>
              );
          })}
      </div>

      {!isFetchingError && !isLoading && !hasMore && videos?.length > 0 && (
        <EndOfResults />
      )}

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && videos.length === 0 && (
        <div className="mt-5">
          <NotFoundCentered
            Icon={<VideoOff className="text-white" />}
            title="No Video Found!"
            description="Streamed videos will appear here."
          />
        </div>
      )}

      {isFetchingError && (
        <ApiFetchingError
          label="Sorry, can't fetch your videos right now!"
          isLoading={isLoading}
          onRefetch={refetchVideos}
        />
      )}
    </div>
  );
};

export default StreamerProfile;
