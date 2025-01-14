import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import DefaultPf from '@/assets/images/pf.png';
import { Button } from '@/components/ui/button';
import VideoDescriptionBox from '@/components/VideoDescriptionBox';
import useVideoDetails from '@/hooks/useVideoDetails';
import { useParams } from 'react-router-dom';
import { formatKMBCount } from '@/lib/utils';
import Reactions from '@/components/Chat/Reactions';
import { Reaction, ReactionStats } from '@/data/chat';
import {
  addView,
  bookmarkVideo,
  reactOnVideo,
  subscribeUnsubscribe,
  unBookmarkVideo,
} from '@/services/stream';
import { RECORD_VIEW_AFTER_SECONDS } from '@/data/validations';
import VideoComment from '@/components/VideoComment';
import { Bookmark, Sparkles, SquarePlay, VideoOff } from 'lucide-react';
import { FEED_PATH } from '@/data/route';
import NotFoundCentered from '@/components/NotFoundCentered';
import FullscreenLoading from '@/components/FullscreenLoading';
import VideoPlayerMP4 from '@/components/VideoPlayerMP4';
import { fetchImageWithAuth } from '@/api/image';
import AppAvatar from '@/components/AppAvatar';
import AppButton from '@/components/AppButton';
import { toast } from 'sonner';

const WatchVideo = () => {
  const { id: videoId } = useParams<{ id: string }>();

  const { videoDetails, isLoading: isFetching } = useVideoDetails({
    id: videoId || null,
  });

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const streamerAvatarRef = useRef<HTMLDivElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const [thumbnailSrc, setThumbnailSrc] = useState<string>('');
  // video ui
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // subscription
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [subscribedCount, setSubscribedCount] = useState(0);
  // view
  const [viewsCount, setViewsCount] = useState(0);
  // reaction
  const [currentReactionType, setCurrentReactionType] =
    useState<Reaction | null>(null);
  const [reactionStats, setReactionStats] = useState<ReactionStats>({});

  const handleSubscribeUnsubscribe = async () => {
    if (videoDetails && videoDetails?.user_id) {
      const isSuccess = await subscribeUnsubscribe(videoDetails?.user_id);
      if (isSuccess) {
        if (isSubscribed) setSubscribedCount((prev) => prev - 1);
        else setSubscribedCount((prev) => prev + 1);

        setIsSubscribed(!isSubscribed);
      }
    }
  };

  const handleReactOnVideo = async ({ reaction }: { reaction: Reaction }) => {
    if (videoDetails) {
      const data = await reactOnVideo({
        videoId: videoDetails?.id,
        likeStatus: currentReactionType !== reaction,
        likeType: reaction,
      });
      if (data) {
        setReactionStats(data);
        if (currentReactionType === reaction) setCurrentReactionType(null);
        else setCurrentReactionType(reaction);
      }
    }
  };

  const handleBookmarkVideo = async () => {
    if (videoDetails && videoDetails?.id) {
      if (!isSaved) {
        setIsSaved(true);

        const isSuccess = await bookmarkVideo(videoDetails?.id);
        if (!isSuccess) {
          setIsSaved(false);
          toast.error('Error saving to Bookmark videos');
        }
      } else if (isSaved) {
        setIsSaved(false);
        const isSuccess = await unBookmarkVideo(videoDetails?.id);
        if (!isSuccess) {
          setIsSaved(true);
          toast.error('Error removing from Bookmark videos');
        }
      }
    }
  };

  // make sure video is always in aspect ratio and when on lg screen sizes, title and uploader info should be appear by default in visible viewport without needing to scroll down
  useEffect(() => {
    const calculateVideoHeight = () => {
      const headerFooterOffset = 140; // offset for visible title, streamer profile, and reactions
      if (titleRef.current && streamerAvatarRef.current) {
        let videoWidth = 0;
        let videoHeight = 0;
        let availableHeight = 0;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const titleHeight = titleRef.current.offsetHeight;
        const streamerAvatarHeight = streamerAvatarRef.current.offsetHeight;

        if (viewportWidth > 1068) {
          availableHeight = Math.max(
            viewportHeight -
              headerFooterOffset -
              (titleHeight + streamerAvatarHeight),
            0
          );
        }

        // maintain a 16:9 aspect ratio
        const calculatedHeight = (9 / 16) * viewportWidth;

        if (viewportWidth < 1068) {
          const padding = 50;
          // for smaller screens, calculate dimensions based on the available viewport size
          // ensure the video fits within the width and height constraints
          videoWidth = Math.min(viewportWidth - padding, 1280); // make width does not exceed 1280px
          videoHeight = (9 / 16) * videoWidth;

          // check if calculated height exceeds available space
          if (videoHeight > viewportHeight - headerFooterOffset) {
            videoHeight = viewportHeight - headerFooterOffset;
            videoWidth = (16 / 9) * videoHeight;
          }
        } else {
          // for larger screens (1068px and above)
          videoHeight = Math.min(availableHeight, calculatedHeight);
          videoWidth = (16 / 9) * videoHeight;
        }

        setVideoDimensions({ width: videoWidth, height: videoHeight });
      }
    };

    calculateVideoHeight();

    window.addEventListener('resize', calculateVideoHeight);

    return () => {
      window.removeEventListener('resize', calculateVideoHeight);
    };
  }, [videoDetails]);

  // update subscribe button, views count, current reaction type
  useEffect(() => {
    if (videoDetails) {
      setIsSaved(videoDetails?.is_saved);
      setIsSubscribed(videoDetails?.is_subscribed);
      setSubscribedCount(videoDetails?.subscriptions);

      setViewsCount(videoDetails?.views);

      if (videoDetails?.current_like_type)
        setCurrentReactionType(videoDetails.current_like_type as Reaction);

      setReactionStats(videoDetails.likes);
    }
  }, [videoDetails]);

  // add view count, fetch thumbnail img after few seconds
  useEffect(() => {
    const addViewAfterDelay = async () => {
      if (videoDetails && videoDetails?.id && !isFetching) {
        const data = await addView(videoDetails?.id);
        if (data?.is_added) {
          setViewsCount((prev) => prev + 1);
        }
      }
    };

    const timer = setTimeout(() => {
      addViewAfterDelay();
    }, RECORD_VIEW_AFTER_SECONDS * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [videoDetails, isFetching]);

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

  if (!videoId)
    return (
      <AppLayout>
        <NotFoundCentered
          Icon={<VideoOff className="text-white" />}
          title="No Video Found!"
          description="This video is not available anymore."
          redirectTo={{
            Icon: <SquarePlay className="h-4 w-4" />,
            buttonText: 'Watch Videos',
            link: FEED_PATH,
          }}
        />
      </AppLayout>
    );

  if (!videoDetails && isFetching) {
    return (
      <AppLayout>
        <FullscreenLoading />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col pt-0 space-y-6 min-h-screen">
        {/* Video Section */}
        <div className="w-full flex justify-center bg-black border">
          <div
            ref={videoContainerRef}
            className="relative shadow-lg"
            style={{
              width: videoDimensions ? `${videoDimensions.width}px` : 'auto',
              height: videoDimensions ? `${videoDimensions.height}px` : 'auto',
            }}
          >
            <VideoPlayerMP4
              url={videoDetails?.video_url || ''}
              poster={thumbnailSrc}
            />
          </div>
        </div>

        <h1 ref={titleRef} className="title text-xl font-bold">
          {videoDetails?.title || 'No Title'}
        </h1>

        {/* Uploader and Interaction Section */}
        <div ref={streamerAvatarRef} className="flex items-center">
          <div className="flex items-center space-x-4 flex-1">
            <AppAvatar url={videoDetails?.avatar_file_url || DefaultPf} />
            <div>
              <h3 className="text-md font-medium">
                {videoDetails?.display_name}
              </h3>
              <p className="text-gray-400 text-sm">
                {formatKMBCount(subscribedCount)} Subscribers
              </p>
            </div>
            {!videoDetails?.is_owner && (
              <Button
                onClick={handleSubscribeUnsubscribe}
                variant={`${isSubscribed ? 'secondary' : 'default'}`}
                className="px-4 py-2 rounded-lg ml-5"
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
          </div>
          <div className="flex space-x-2 items-center">
            <AppButton
              Icon={Bookmark}
              isIconActive={isSaved}
              label={isSaved ? 'Bookmarked' : 'Bookmark'}
              tooltipOnSmallScreens
              size="sm"
              variant="outline"
              onClick={handleBookmarkVideo}
            />
            <Reactions
              stats={{
                likeCount: 0,
                likeInfo: reactionStats,
                currentReactionType: currentReactionType as Reaction,
              }}
              onReactOnLive={handleReactOnVideo}
            />
          </div>
        </div>

        {/* Description Box */}
        <VideoDescriptionBox
          totalViews={viewsCount}
          categories={videoDetails?.categories || []}
          createdAt={videoDetails?.started_at || ''}
          description={videoDetails?.description || ''}
        />

        {/* Comment box */}
        {videoDetails && <VideoComment videoId={videoDetails?.id} />}
      </div>
    </AppLayout>
  );
};

export default WatchVideo;
