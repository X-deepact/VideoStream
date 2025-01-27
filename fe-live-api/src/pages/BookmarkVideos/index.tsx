import ApiFetchingError from '@/components/ApiFetchingError';
import EndOfResults from '@/components/EndOfResults';
import InlineLoading from '@/components/InlineLoading';
import NotFoundCentered from '@/components/NotFoundCentered';
import VideoItem from '@/components/VideoItem';
import { StreamsResponse } from '@/data/dto/stream';
import { CONTENT_STATUS } from '@/data/types/stream';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';
import useVideosList from '@/hooks/useVideosList';
import LayoutHeading from '@/layouts/LayoutHeading';
import { unBookmarkVideo } from '@/services/stream';
import { Trash2, VideoOff } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

const title = 'Bookmark Videos';

const BookmarkVideos = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const {
    videos,
    totalItems,
    hasMore,
    isLoading,
    error: isFetchingError,
    refetchVideos,
    setVideos,
    setTotalItems,
  } = useVideosList({
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
    is_saved: true,
    status: CONTENT_STATUS.VIDEO,
  });

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

  const handleUnBookmarkVideo = async (video: StreamsResponse) => {
    if (video && video?.id) {
      const isSuccess = await unBookmarkVideo(video?.id);
      if (isSuccess) {
        setVideos((prev) => {
          const oldVideos = prev;
          const updatedVideos = oldVideos.filter((v) => v.id !== video.id);
          return updatedVideos;
        });
        setTotalItems((prev) => prev - 1);
        toast.success('Removed from Bookmark videos!');
      } else {
        toast.error('Cannot remove from Bookmark videos at this moment!');
      }
    }
  };

  return (
    <div className="md:container lg:px-[10rem] md:mx-auto flex flex-col justify-center gap-4">
      <div className="w-full">
        <LayoutHeading title={`${title} (${totalItems})`} />
      </div>

      <div className="flex flex-col justify-center gap-8 md:gap-4">
        {!isFetchingError &&
          videos.length > 0 &&
          videos.map((video, index) => {
            if (videos.length === index + 1)
              return (
                <div key={index} ref={lastVideoElementRef}>
                  <VideoItem
                    video={video}
                    actions={[
                      {
                        Icon: Trash2,
                        label: 'Remove from Bookmark videos',
                        onClick: (video) => handleUnBookmarkVideo(video),
                      },
                    ]}
                  />
                </div>
              );
            else
              return (
                <div key={index}>
                  <VideoItem
                    video={video}
                    actions={[
                      {
                        Icon: Trash2,
                        label: 'Remove from Bookmark videos',
                        onClick: (video) => handleUnBookmarkVideo(video),
                      },
                    ]}
                  />
                </div>
              );
          })}
      </div>

      {!isFetchingError && !isLoading && !hasMore && videos?.length > 0 && (
        <EndOfResults />
      )}

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && videos.length === 0 && (
        <NotFoundCentered
          Icon={<VideoOff className="text-white" />}
          title="No Video Found!"
          description="Bookmark videos will appear here."
        />
      )}

      {isFetchingError && (
        <ApiFetchingError
          label="Sorry, can't fetch saved videos right now!"
          isLoading={isLoading}
          onRefetch={refetchVideos}
        />
      )}
    </div>
  );
};

export default BookmarkVideos;
