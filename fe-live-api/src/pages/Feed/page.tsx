import React from 'react';
import { DATA_API_LIMIT, DEFAULT_PAGE } from '@/data/validations';
import useVideosList from '@/hooks/useVideosList';
import { Bookmark, VideoOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import EndOfResults from '../../components/EndOfResults';
import NotFoundCentered from '@/components/NotFoundCentered';
import InlineLoading from '@/components/InlineLoading';
import VideoItem from '@/components/VideoItem';
import { debounce } from 'lodash';
import { useCategory } from '@/context/CategoryContext';
import { FixedCategories } from '@/data/types/category';
import { CONTENT_STATUS } from '@/data/types/stream';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Skeleton } from '@/components/ui/skeleton';
import ApiFetchingError from '@/components/ApiFetchingError';
import { StreamsResponse } from '@/data/dto/stream';
import { bookmarkVideo } from '@/services/stream';
import { toast } from 'sonner';

const FeedPage = () => {
  const screenSize = useScreenSize();
  const { filteredCategory } = useCategory();
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  // fetch videos
  const {
    videos,
    hasMore,
    isLoading,
    error: isFetchingError,
    refetchVideos,
    setVideos,
  } = useVideosList({
    page: currentPage,
    limit: DATA_API_LIMIT[screenSize], // fetch videos based on screen size
    categoryId1:
      filteredCategory?.id === FixedCategories[0].id ||
      filteredCategory?.id === FixedCategories[1].id
        ? undefined
        : filteredCategory.id,
    status:
      filteredCategory?.id === FixedCategories[1].id
        ? CONTENT_STATUS.LIVE
        : undefined,
  });

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

    const bottom = scrollTop + clientHeight >= scrollHeight;

    if (bottom && hasMore && !isLoading) setCurrentPage((prev) => prev + 1);
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCategory]);

  const renderSkeletons = () => {
    const skeletonsCount = DATA_API_LIMIT[screenSize];
    return Array.from({ length: skeletonsCount }).map((_, index) => (
      <div key={index} className="w-full h-full">
        <Skeleton className="w-full h-48 bg-secondary" />
      </div>
    ));
  };

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto mt-10">
        {/* Videos List */}
        {isLoading
          ? renderSkeletons()
          : !isFetchingError &&
            videos.length > 0 &&
            videos.map((video, index) => {
              return (
                <div key={index}>
                  <VideoItem
                    video={video}
                    isSingle={false}
                    isGrid
                    actions={[
                      {
                        Icon: Bookmark,
                        isIconActive: video.is_saved,
                        label: video.is_saved ? 'Bookmarked' : 'Bookmark',
                        onClick: () => handleBookmarkVideo(video),
                      },
                    ]}
                  />
                </div>
              );
            })}

        {!isFetchingError && !isLoading && videos.length === 0 && (
          <NotFoundCentered
            Icon={<VideoOff className="text-white" />}
            title="No Video Found!"
            description="Please try searching with different filters."
          />
        )}
      </div>

      {!isFetchingError && isLoading && <InlineLoading />}

      {!isFetchingError && !isLoading && !hasMore && videos?.length > 0 && (
        <EndOfResults />
      )}

      {isFetchingError && (
        <ApiFetchingError
          label="Sorry, can't fetch videos right now!"
          isLoading={isLoading}
          onRefetch={refetchVideos}
        />
      )}
    </React.Fragment>
  );
};

export default FeedPage;
