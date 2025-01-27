import { CATEGORY_FILTER_KEYWORD, SEARCH_QUERY_KEYWORD } from '@/data/route';
import { DATA_API_LIMIT, DEFAULT_PAGE } from '@/data/validations';
import useVideosList from '@/hooks/useVideosList';
import { useLocation } from 'react-router-dom';
import NotFoundCentered from '@/components/NotFoundCentered';
import { VideoOff } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import EndOfResults from '../../../components/EndOfResults';
import VideoItem from '@/components/VideoItem';
import InlineLoading from '../../../components/InlineLoading';
import { FixedCategories } from '@/data/types/category';
import { CONTENT_STATUS } from '@/data/types/stream';
import { useScreenSize } from '@/hooks/useScreenSize';
import ApiFetchingError from '@/components/ApiFetchingError';

const FeedSearch = () => {
  const screenSize = useScreenSize();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const _searchQuery = params.get(SEARCH_QUERY_KEYWORD);
  const _fCategoryId = params.get(CATEGORY_FILTER_KEYWORD);
  const _filteredCategoryId = isNaN(Number(_fCategoryId))
    ? undefined
    : Number(_fCategoryId);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  // fetch videos
  const {
    videos,
    hasMore,
    isLoading,
    error: isFetchingError,
    refetchVideos,
  } = useVideosList({
    page: currentPage,
    limit: DATA_API_LIMIT[screenSize], // fetch videos based on screen size
    title: _searchQuery || undefined,
    categoryId1:
      _filteredCategoryId === FixedCategories[0].id ||
      _filteredCategoryId === FixedCategories[1].id
        ? undefined
        : _filteredCategoryId,
    status:
      _filteredCategoryId === FixedCategories[1].id
        ? CONTENT_STATUS.LIVE
        : undefined,
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

  return (
    <div>
      <div className="md:container lg:px-[10rem] md:mx-auto flex flex-col justify-center gap-8 md:gap-4 mt-10">
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
        <NotFoundCentered
          Icon={<VideoOff className="text-white" />}
          title="No Video Found!"
          description="Please try searching with different filters."
        />
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

export default FeedSearch;
