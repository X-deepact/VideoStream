import { useState, useEffect } from 'react';
import { fetchVideosList } from '@/services/stream';
import { StreamsResponse, VideosListRequest } from '@/data/dto/stream';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';

const useVideosList = (payload: VideosListRequest = {}) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_SIZE,
    categoryId1,
    categoryId2,
    categoryId3,
    status,
    title = undefined,
    is_me = undefined,
    is_liked = undefined,
    is_history = undefined,
    is_saved = undefined,
  } = payload;

  const [videos, setVideos] = useState<StreamsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const refetchVideos = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, unknown> = {
          page,
          limit,
          title,
          is_me,
          is_liked,
          is_history,
          is_saved,
          status,
          categoryId1,
          categoryId2,
          categoryId3,
        };

        const response = await fetchVideosList(params);

        if (!response?.page) throw new Error('Failed to fetch contents!');

        setVideos((prev) => {
          const newVideos = response.page || [];
          const uniqueVideos = [
            ...prev,
            ...newVideos.filter(
              (video) => !prev.some((v) => v.id === video.id)
            ),
          ];
          return uniqueVideos;
        });
        if (response.next) setHasMore(response.next > 0);
        if (response.total_items) setTotalItems(response.total_items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentsData();
  }, [
    title,
    categoryId1,
    categoryId2,
    categoryId3,
    status,
    page,
    limit,
    is_me,
    is_liked,
    is_history,
    is_saved,
    refetchKey,
  ]);

  useEffect(() => {
    setVideos([]);
  }, [
    title,
    categoryId1,
    categoryId2,
    categoryId3,
    is_me,
    is_liked,
    is_history,
    is_saved,
  ]);

  return {
    videos,
    isLoading,
    hasMore,
    totalItems,
    error,
    setVideos,
    refetchVideos,
    setTotalItems,
  };
};

export default useVideosList;
