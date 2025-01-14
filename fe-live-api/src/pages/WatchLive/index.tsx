import useVideoDetails from '@/hooks/useVideoDetails';
import AppLayout from '@/layouts/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import LiveIndicator from '../LiveStream/Webcam/LiveIndicator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LetterText, MessageSquare } from 'lucide-react';
import StreamDetailsCard from '../LiveStream/Webcam/StreamDetailsCard';
import { Fragment, useEffect, useState } from 'react';
import StreamerAvatar from '@/components/StreamerAvatar';
import { getFormattedDate } from '@/lib/date-time';
import { convertToHashtagStyle } from '@/lib/utils';
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
import { WATCH_VIDEO_PATH } from '@/data/route';
import { modalTexts } from '@/data/stream';
import { fetchImageWithAuth } from '@/api/image';

const WatchLive = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const currentUser = useUserAccount();
  const { id: videoId } = useParams<{ id: string }>();

  // fetch video details
  const { videoDetails, isLoading: isFetching } = useVideoDetails({
    id: videoId || null,
  });
  // work with live chat and reaction
  const {
    isChatVisible,
    isStreamStarted,
    isLiveEndEventReceived,
    liveInitialStats,
    liveViewersCount,
    toggleChat,
    sendReaction,
    sendComment,
  } = useLiveChatWebSocket(videoId || null);

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
    <AppLayout>
      <div className="flex flex-col w-full h-full gap-3 overflow-hidden box-border">
        <div className="flex w-full lg:h-full items-center justify-center overflow-hidden">
          {/* Video and Chat Layout */}
          <div className="flex flex-col lg:flex-row w-full h-full gap-3">
            {/* Webcam View */}
            <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden relative">
              {/* Live indicators */}
              {isStreamStarted && (
                <div className="absolute top-3 left-3 z-20">
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
                  url={videoDetails?.broadcast_url}
                  token={retrieveAuthToken() || ''}
                  poster={thumbnailSrc}
                  videoWidth={videoDimensions.width}
                  videoHeight={videoDimensions.height}
                />
              </div>
            </div>

            {/* Chat */}
            {isStreamStarted && isChatVisible && (
              <div className="w-full lg:w-1/4 flex flex-col h-[50vh] md:h-full border rounded-md overflow-hidden">
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
        <div className="bottom-0 flex items-center md:justify-center mt-3">
          {/* Stream details card */}
          {isStreamStarted && videoDetails?.id && (
            <>
              <div className="hidden md:inline-block absolute left-5">
                <Popover>
                  <PopoverTrigger>
                    <Button variant="ghost" size="sm">
                      <LetterText />
                      Details
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom">
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
              </div>
              {/* Start - Mobile stream details card */}
              {!isChatVisible && isStreamStarted && (
                <div className="block w-full md:hidden">
                  <div className="flex justify-between items-start">
                    <StreamerAvatar />
                    <Button onClick={toggleChat} variant="outline" size="sm">
                      <MessageSquare /> Show Chat
                    </Button>
                  </div>
                  <div className="mt-3 bg-muted p-4 rounded-lg">
                    <p className="text-xl font-semibold">
                      {videoDetails?.title || ''}
                    </p>
                    <p className="text-xs">
                      <span className="text-muted-foreground">
                        Streamed live at
                      </span>{' '}
                      {getFormattedDate(
                        new Date(videoDetails?.started_at || new Date()),
                        true
                      )}
                    </p>

                    <div className="flex gap-2">
                      {videoDetails?.categories?.map((category) => (
                        <Fragment key={category.id}>
                          <VideoCategory
                            id={category.id}
                            label={convertToHashtagStyle(category.name)}
                          />
                        </Fragment>
                      ))}
                    </div>

                    <p className="mt-2">{videoDetails?.description || ''}</p>
                  </div>
                </div>
              )}
              {/* End - Mobile stream details card */}
            </>
          )}

          {/* Chat toggle button */}
          <div className="hidden md:inline-block absolute right-5">
            {isStreamStarted && (
              <Button variant="ghost" size="sm" onClick={toggleChat}>
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
    </AppLayout>
  );
};

export default WatchLive;
