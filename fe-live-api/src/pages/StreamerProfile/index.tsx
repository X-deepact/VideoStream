import ApiFetchingError from '@/components/ApiFetchingError';
import AppAvatar from '@/components/AppAvatar';
import AppButton from '@/components/AppButton';
import EndOfResults from '@/components/EndOfResults';
import InlineLoading from '@/components/InlineLoading';
import NotFoundCentered from '@/components/NotFoundCentered';
import { getLoggedInUserInfo } from '@/data/model/userAccount';
import { USER_ROLE } from '@/data/types/role';
import { DATA_API_LIMIT, DEFAULT_PAGE } from '@/data/validations';
import useStreamerDetails from '@/hooks/useStreamerDetails';
import useVideosList from '@/hooks/useVideosList';
import LayoutHeading from '@/layouts/LayoutHeading';
import {
  getAvatarFallbackText,
  getCorrectUnit,
  KMBformatter,
} from '@/lib/utils';
import { bookmarkVideo, subscribeUnsubscribe } from '@/services/stream';
import { toggleMuteNotificationsFromChannel } from '@/services/subscription';
import {
  BellOff,
  BellRing,
  Eye,
  MessageSquare,
  Share2,
  ThumbsUp,
  VideoOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import NotFound from '../NotFound';
import SubscribeButton from '@/components/SubscribeButton';
import VideoList from '../Feed/VideoList';
import { debounce } from 'lodash';
import { useScreenSize } from '@/hooks/useScreenSize';
import { StreamsResponse } from '@/data/dto/stream';

const StreamerProfile = () => {
  const screenSize = useScreenSize();

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
    setVideos,
  } = useVideosList({
    page: currentPage,
    limit: DATA_API_LIMIT[screenSize],
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

  const handleBookmarkVideo = async (video: StreamsResponse) => {
    if (video && video.id) {
      const previousVideos = [...videos];

      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, is_saved: !v.is_saved } : v
        )
      );

      const isSuccess = await bookmarkVideo(video.id);

      if (!isSuccess) {
        setVideos(previousVideos);
        toast.error('Error saving to Bookmark videos');
      } else {
        const message = video.is_saved
          ? 'Removed from Bookmark videos!'
          : 'Saved to Bookmark videos!';
        toast.success(message);
      }
    }
  };

  const handleScroll = debounce(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    const bottom = scrollTop + clientHeight + 10 >= scrollHeight; // 10 tolerence

    if (bottom && hasMore && !isLoading) setCurrentPage((prev) => prev + 1);
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (streamerDetails === null && !isStreamerDetailsFetching)
    return <NotFound />;

  return (
    <div className='md:container lg:px-[10rem] md:mx-auto flex flex-col justify-center'>
      <div className='w-full mb-3'>
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
        <div className='flex gap-3 border-b pb-5 pt-2'>
          {/* avatar */}
          <AppAvatar
            url={streamerDetails.streamer_avatar_url}
            classes='w-28 h-28'
            fallback={getAvatarFallbackText(streamerDetails.streamer_name)}
          />
          {/* details */}
          <div>
            <p className='text-lg font-semibold'>
              {streamerDetails.streamer_name}
            </p>
            <div className='flex gap-2 text-sm text-muted-foreground'>
              <p>
                {KMBformatter(subscribedCount)}
                {getCorrectUnit(subscribedCount, 'subscriber')}
              </p>
              •
              <p>
                {KMBformatter(streamerDetails.total_video)}
                {getCorrectUnit(streamerDetails.total_video, 'video')}
              </p>
            </div>
            {/* subscribe and noti */}
            <div className='flex gap-2 mt-3 ml-0'>
              {!streamerDetails?.is_me && (
                <SubscribeButton
                  isSubscribed={isSubscribed}
                  onSubscribeUnsubscribe={handleSubscribeUnsubscribe}
                />
              )}
              {isSubscribed && (
                <AppButton
                  className='rounded-full'
                  Icon={isNotiMuted ? BellOff : BellRing}
                  isIconActive={false}
                  label={
                    isNotiMuted ? 'Unmute Notification' : 'Mute Notification'
                  }
                  tooltipOnSmallScreens
                  size='icon'
                  variant='secondary'
                  onClick={() => handleToggleMuteNotifications()}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {streamerDetails && (
        <div className='flex gap-2 p-3 border-b text-xs font-medium'>
          <div className='flex gap-1 items-center justify-center text-green-500 bg-green-100 dark:bg-transparent px-2 py-1.5'>
            <ThumbsUp className='w-3 h-3' />
            {KMBformatter(streamerDetails.total_like)}{' '}
            {getCorrectUnit(streamerDetails.total_like, 'like')}
          </div>
          <div className='flex gap-1 items-center justify-center text-purple-500 bg-purple-100 dark:bg-transparent px-2 py-1.5'>
            <MessageSquare className='w-3 h-3' />
            {KMBformatter(streamerDetails.total_comment)}
            {getCorrectUnit(streamerDetails.total_comment, 'comment')}
          </div>
          <div className='flex gap-1 items-center justify-center text-orange-500 bg-orange-100 dark:bg-transparent px-2 py-1.5'>
            <Eye className='w-3 h-3' />
            {KMBformatter(streamerDetails.total_view)}
            {getCorrectUnit(streamerDetails.total_view, 'view')}
          </div>
          <div className='flex gap-1 items-center justify-center text-yellow-500 bg-yellow-100 dark:bg-transparent px-2 py-1.5'>
            <Share2 className='w-3 h-3' />
            {KMBformatter(streamerDetails.total_share)}
            {getCorrectUnit(streamerDetails.total_share, 'share')}
          </div>
        </div>
      )}

      <div className='w-full my-3'>
        <LayoutHeading title={`Videos (${streamerDetails?.total_video})`} />
      </div>
      <div className='flex flex-col justify-center gap-8 md:gap-4 mb-3'>
        {!isFetchingError && videos?.length > 0 && (
          <VideoList videos={videos} onBookmarkVideo={handleBookmarkVideo} />
        )}
      </div>

      {!isFetchingError && !isLoading && !hasMore && videos?.length > 0 && (
        <EndOfResults />
      )}

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && videos.length === 0 && (
        <div className='mt-5'>
          <NotFoundCentered
            Icon={<VideoOff className='text-white' />}
            title='No Video Found!'
            description='Streamed videos will appear here.'
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
