import { DATA_API_LIMIT, DEFAULT_PAGE } from '@/data/validations';
import useVideosList from '@/hooks/useVideosList';
import { VideoOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import EndOfResults from '../../components/EndOfResults';
import NotFoundCentered from '@/components/NotFoundCentered';
import InlineLoading from '@/components/InlineLoading';
import { debounce } from 'lodash';
import { useCategory } from '@/context/CategoryContext';
import { FixedCategories } from '@/data/types/category';
import { CONTENT_STATUS } from '@/data/types/stream';
import { useScreenSize } from '@/hooks/useScreenSize';
import ApiFetchingError from '@/components/ApiFetchingError';
import { StreamsResponse } from '@/data/dto/stream';
import { bookmarkVideo } from '@/services/stream';
import { toast } from 'sonner';
import VideoList from './VideoList';

const Feed = () => {
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

    const bottom = scrollTop + clientHeight + 10 >= scrollHeight; // 10 tolerence

    if (bottom && hasMore && !isLoading) setCurrentPage((prev) => prev + 1);
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCategory]);

  return (
    <div>
      {/* Videos List */}
      {!isFetchingError && videos?.length > 0 && (
        <VideoList
          videos={videos}
          className='mt-10'
          onBookmarkVideo={handleBookmarkVideo}
        />
      )}

      {!isFetchingError && !isLoading && videos.length === 0 && (
        <NotFoundCentered
          Icon={<VideoOff className='text-white' />}
          title='No Video Found!'
          description='Please try searching with different filters.'
        />
      )}

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
    </div>
  );
};

export default Feed;
