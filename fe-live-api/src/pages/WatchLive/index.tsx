import useVideoDetails from '@/hooks/useVideoDetails';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LiveIndicator from '../LiveStream/LiveIndicator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  BellOff,
  BellRing,
  LetterText,
  MessageSquare,
  Share2,
} from 'lucide-react';
import StreamDetailsCard from '../LiveStream/Webcam/StreamDetailsCard';
import { Fragment, useEffect, useState } from 'react';
import { getFormattedDate } from '@/lib/date-time';
import {
  convertToHashtagStyle,
  getAvatarFallbackText,
  getCorrectUnit,
  KMBformatter,
} from '@/lib/utils';
import VideoCategory from '@/components/VideoCategory';
import VideoPlayerFLV from '@/components/VideoPlayerFLV';
import { retrieveAuthToken } from '@/data/model/userAccount';
import Chat from '@/components/Chat';
import useUserAccount from '@/hooks/useUserAccount';
import { useIsMobile } from '@/hooks/useMobile';
import { NotifyModalType } from '@/components/UITypes';
import {
  NotificationModalProps,
  NotifyModal,
} from '@/components/NotificationModal';
import FullscreenLoading from '@/components/FullscreenLoading';
import { useLiveChatWebSocket } from '@/hooks/webSocket/useLiveChatWebSocket';
import {
  getFEUrl,
  NOT_FOUND_PATH,
  RESOURCE_ID,
  STREAMER_PROFILE_PATH,
  WATCH_LIVE_PATH,
  WATCH_VIDEO_PATH,
} from '@/data/route';
import { modalTexts } from '@/data/stream';
import { fetchImageWithAuth } from '@/api/image';
import { CONTENT_STATUS } from '@/data/types/stream';
import { API_ERROR } from '@/data/api';
import AppAvatar from '@/components/AppAvatar';
import { subscribeUnsubscribe } from '@/services/stream';
import { toggleMuteNotificationsFromChannel } from '@/services/subscription';
import { toast } from 'sonner';
import AppButton from '@/components/AppButton';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import DefaultThumbnail from '@/assets/images/video-thumbnail.jpg';
import SubscribeButton from '@/components/SubscribeButton';

const WatchLive = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const currentUser = useUserAccount();
  const { id: videoId } = useParams<{ id: string }>();

  const [subscribedCount, setSubscribedCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotiMuted, setIsNotiMuted] = useState(true);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState<string>('');
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number | string;
    height: number | string;
  }>({
    width: 0,
    height: 0,
  });
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps>({
    type: NotifyModalType.SUCCESS,
    isOpen: false,
    title: '',
    description: '',
    onClose: undefined,
  });

  const [copiedText, copy] = useCopyToClipboard();

  // fetch video details
  const {
    videoDetails,
    isLoading: isFetching,
    error: apiError,
  } = useVideoDetails({
    id: videoId || null,
  });
  // work with live chat and reaction
  const {
    isChatVisible,
    // isStreamStarted,
    isLiveEndEventReceived,
    liveInitialStats,
    liveViewersCount,
    liveSharesCount,
    setIsChatVisible,
    toggleChat,
    sendReaction,
    sendComment,
    sendShare,
  } = useLiveChatWebSocket(
    videoId || null,
    isStreamStarted,
    setIsStreamStarted
  );

  const handleSubscribeUnsubscribe = async () => {
    if (videoDetails && videoDetails?.user_id) {
      const isSuccess = await subscribeUnsubscribe(videoDetails?.user_id);
      if (isSuccess) {
        if (isSubscribed) {
          setSubscribedCount((prev) => prev - 1);
        } else {
          setSubscribedCount((prev) => prev + 1);
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
        streamerId: Number(videoDetails?.user_id),
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

  const handleAddShareWs = async () => {
    if (videoDetails && videoDetails?.id) {
      sendShare();
      copy(
        window.location.origin +
          getFEUrl(WATCH_LIVE_PATH, videoDetails.id.toString())
      );
      if (copiedText) toast.success('Copied to clipboard!');
    }
  };

  // calculate video width and height
  useEffect(() => {
    const calculateVideoDimensions = () => {
      const containerWidth = window.innerWidth;

      if (isMobile) {
        const width = containerWidth - 50;
        const height = (width * 9) / 16; // maintain 16:9 aspect ratio
        setVideoDimensions({ width, height });
      } else {
        const containerHeight = window.innerHeight;
        const chatWidth = isChatVisible ? containerWidth / 4 : 0;
        const availableWidth = containerWidth - chatWidth - 120; // padding and offsets
        const availableHeight = containerHeight - 140; // padding and offsets

        setVideoDimensions({
          width: availableWidth,
          height: availableHeight,
        });
      }
    };

    // calculate dimensions on mount, chat visibility toggle, or window resize
    calculateVideoDimensions();
    window.addEventListener('resize', calculateVideoDimensions);

    return () => {
      window.removeEventListener('resize', calculateVideoDimensions);
    };
  }, [isChatVisible, isMobile]);

  // show modal alert when live ends
  useEffect(() => {
    if (videoDetails && isLiveEndEventReceived) {
      openNotifyModal(
        NotifyModalType.SUCCESS,
        modalTexts.stream.forceEnd.title,
        modalTexts.stream.forceEnd.description,
        () =>
          navigate(
            WATCH_VIDEO_PATH.replace(':id', videoDetails?.id?.toString())
          )
      );
    }
  }, [isLiveEndEventReceived, videoDetails, navigate]);

  // fetch authed thumbnail img
  useEffect(() => {
    const fetchAuthThumbnail = async () => {
      if (videoDetails && !isFetching) {
        const blobUrl = await fetchImageWithAuth(videoDetails?.thumbnail_url);
        if (blobUrl) setThumbnailSrc(blobUrl);
      }
    };
    fetchAuthThumbnail();
  }, [videoDetails, isFetching]);

  // check if this id is still live, (for coming from noti click)
  useEffect(() => {
    if (
      !videoId ||
      (videoId && isNaN(Number(videoId))) ||
      (apiError && apiError === API_ERROR.NOT_FOUND)
    ) {
      navigate(NOT_FOUND_PATH);
    } else if (
      videoDetails &&
      videoDetails?.status === CONTENT_STATUS.UPCOMING
    ) {
      //
    } else if (videoDetails && videoDetails?.status !== CONTENT_STATUS.LIVE) {
      navigate(getFEUrl(WATCH_VIDEO_PATH, videoDetails?.id.toString()));
    } else {
      if (videoDetails?.status === CONTENT_STATUS.LIVE) {
        setIsStreamStarted(true);
        setIsChatVisible(true);
        setSubscribedCount(videoDetails?.subscriptions);
        setIsSubscribed(videoDetails?.is_subscribed);
        setIsNotiMuted(videoDetails?.is_mute);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDetails, apiError]);

  // Modal dialogs
  const openNotifyModal = (
    type: NotifyModalType,
    title: string,
    description: string | JSX.Element,
    onClose?: () => void
  ): void => {
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

  if (isFetching) return <FullscreenLoading />;

  return (
    <div>
      <div className='flex flex-col w-full h-full gap-3 overflow-hidden box-border'>
        <div className='flex w-full lg:h-full items-center justify-center overflow-hidden'>
          {/* Video and Chat Layout */}
          <div className='flex flex-col lg:flex-row w-full h-full gap-3'>
            {/* Webcam View */}
            <div className='flex-1 flex items-center justify-center border rounded-md overflow-hidden relative'>
              {/* Live indicators */}
              {isStreamStarted && (
                <div className='absolute top-3 left-3 z-20'>
                  <LiveIndicator
                    isStreamStarted
                    startedAt={videoDetails?.started_at}
                    likeCount={
                      liveInitialStats.like_count ||
                      videoDetails?.likes?.total ||
                      0
                    }
                    commentCount={
                      liveInitialStats.comments?.length ||
                      videoDetails?.comments ||
                      0
                    }
                    viewerCount={liveViewersCount || videoDetails?.views || 0}
                    sharedCount={liveSharesCount || videoDetails?.shares || 0}
                  />
                </div>
              )}
              {/* video */}
              <div
                style={{
                  width: `${videoDimensions.width}px`,
                  height: `${videoDimensions.height}px`,
                }}
              >
                <VideoPlayerFLV
                  videoDetails={
                    videoDetails
                      ? {
                          url: videoDetails?.broadcast_url,
                          status: videoDetails?.status,
                          scheduledAt: videoDetails?.scheduled_at || '',
                        }
                      : null
                  }
                  token={retrieveAuthToken() || ''}
                  poster={thumbnailSrc || DefaultThumbnail}
                  videoWidth={videoDimensions.width}
                  videoHeight={videoDimensions.height}
                />
              </div>
            </div>

            {/* Chat */}
            {isStreamStarted && isChatVisible && (
              <div className='w-full lg:w-1/4 flex flex-col h-[50vh] md:h-full border rounded-md overflow-hidden'>
                <Chat
                  currentUser={currentUser}
                  initialStats={liveInitialStats}
                  onToggleVisibility={toggleChat}
                  onReactOnLive={sendReaction}
                  onCommentOnLive={sendComment}
                />
              </div>
            )}
          </div>
        </div>

        {/* Control bars */}
        <div className='bottom-0 flex items-center md:justify-center mt-3'>
          {/* Stream details card */}
          {isStreamStarted && videoDetails?.id && (
            <>
              <div className='hidden md:inline-block absolute left-5 mt-2'>
                <div className='flex gap-3 items-center'>
                  <div className='flex items-center space-x-2 flex-1'>
                    <Link
                      to={STREAMER_PROFILE_PATH.replace(
                        RESOURCE_ID,
                        videoDetails?.user_id?.toString() || ''
                      )}
                    >
                      <AppAvatar
                        url={videoDetails?.avatar_file_url || 'Unknown'}
                        fallback={getAvatarFallbackText(
                          videoDetails?.display_name || 'PF'
                        )}
                        classes='w-10 h-10'
                      />
                    </Link>
                    <div>
                      <Link
                        to={STREAMER_PROFILE_PATH.replace(
                          RESOURCE_ID,
                          videoDetails?.user_id?.toString() || ''
                        )}
                      >
                        <h3 className='text-md font-medium'>
                          {videoDetails?.display_name}
                        </h3>
                      </Link>
                      <p className='text-muted-foreground text-xs'>
                        {KMBformatter(subscribedCount)} Subscribers
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      {!videoDetails?.is_owner && (
                        <SubscribeButton
                          className='ml-2'
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
                            isNotiMuted
                              ? 'Unmute Notification'
                              : 'Mute Notification'
                          }
                          tooltipOnSmallScreens
                          size='icon'
                          variant='secondary'
                          onClick={() => handleToggleMuteNotifications()}
                        />
                      )}
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger>
                      <Button variant='outline' size='sm'>
                        <LetterText />
                        Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side='bottom'>
                      <StreamDetailsCard
                        data={{
                          id: videoDetails?.id,
                          title: videoDetails?.title,
                          description: videoDetails?.description,
                          thumbnail_url: videoDetails?.thumbnail_url,
                          broadcast_url: videoDetails?.broadcast_url,
                          push_url: null,
                          started_at: videoDetails?.started_at,
                          category_ids: videoDetails?.categories?.map(
                            (category) => category.id
                          ),
                        }}
                        categories={videoDetails?.categories}
                      />
                    </PopoverContent>
                  </Popover>
                  <AppButton
                    Icon={Share2}
                    label={`${
                      liveSharesCount > 0 ? liveSharesCount : ''
                    } ${getCorrectUnit(liveSharesCount || 0, 'Share')}`}
                    tooltipOnSmallScreens
                    size='sm'
                    variant='outline'
                    onClick={handleAddShareWs}
                  />
                </div>
              </div>
              {/* Start - Mobile stream details card */}
              {!isChatVisible && isStreamStarted && (
                <div className='block w-full md:hidden'>
                  <div className='flex justify-between items-start'>
                    {/* Streamer info */}
                    <div className='flex items-center space-x-2 flex-1'>
                      <Link
                        to={STREAMER_PROFILE_PATH.replace(
                          RESOURCE_ID,
                          videoDetails?.user_id?.toString() || ''
                        )}
                      >
                        <AppAvatar
                          url={videoDetails?.avatar_file_url || 'Unknown'}
                          fallback={getAvatarFallbackText(
                            videoDetails?.display_name || 'PF'
                          )}
                          classes='w-10 h-10'
                        />
                      </Link>
                      <div>
                        <Link
                          to={STREAMER_PROFILE_PATH.replace(
                            RESOURCE_ID,
                            videoDetails?.user_id?.toString() || ''
                          )}
                        >
                          <h3 className='text-md font-medium'>
                            {videoDetails?.display_name}
                          </h3>
                        </Link>
                        <p className='text-muted-foreground text-xs'>
                          {KMBformatter(subscribedCount)} Subscribers
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        {!videoDetails?.is_owner && (
                          <SubscribeButton
                            className='ml-2'
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
                              isNotiMuted
                                ? 'Unmute Notification'
                                : 'Mute Notification'
                            }
                            tooltipOnSmallScreens
                            size='icon'
                            variant='secondary'
                            onClick={() => handleToggleMuteNotifications()}
                          />
                        )}
                      </div>
                    </div>
                    <Button onClick={toggleChat} variant='outline' size='sm'>
                      <MessageSquare /> Show Chat
                    </Button>
                  </div>
                  <div className='mt-3 bg-muted p-4 rounded-lg'>
                    <p className='text-xl font-semibold'>
                      {videoDetails?.title || ''}
                    </p>
                    <p className='text-xs'>
                      <span className='text-muted-foreground'>
                        Streamed live at
                      </span>{' '}
                      {getFormattedDate(
                        new Date(videoDetails?.started_at || new Date()),
                        true
                      )}
                    </p>

                    <div className='flex gap-2'>
                      {videoDetails?.categories?.map((category) => (
                        <Fragment key={category.id}>
                          <VideoCategory
                            id={category.id}
                            label={convertToHashtagStyle(category.name)}
                          />
                        </Fragment>
                      ))}
                    </div>

                    <p className='mt-2'>{videoDetails?.description || ''}</p>
                  </div>
                </div>
              )}
              {/* End - Mobile stream details card */}
            </>
          )}

          {/* Chat toggle button */}
          <div className='hidden md:inline-block absolute right-5'>
            {isStreamStarted && (
              <Button variant='ghost' size='sm' onClick={toggleChat}>
                <MessageSquare /> {isChatVisible ? 'Hide' : 'Show'} chat
              </Button>
            )}
          </div>
        </div>
      </div>

      <NotifyModal
        type={notifyModal.type}
        isOpen={notifyModal.isOpen}
        title={notifyModal.title}
        description={notifyModal.description}
        onClose={closeNotifyModal}
      />
    </div>
  );
};

export default WatchLive;
