import { useState, useEffect, useRef } from 'react';
import { fetchVideosList } from '@/services/stream';
import { StreamsResponse, VideosListRequest } from '@/data/dto/stream';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';

// TODO: check for on scroll
const useVideosList = (payload: VideosListRequest = {}) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_SIZE,
    status,
    categoryId1 = 0,
    categoryId2 = 0,
    categoryId3 = 0,
    title = '',
    isMe = false,
  } = payload;

  const [contents, setContents] = useState<StreamsResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  // ref to store previous dependencies to compare with current ones
  const prevDepsRef = useRef({
    status,
    categoryId1,
    categoryId2,
    categoryId3,
    title,
  });

  // function to refetch the contents (triggered manually)
  const refetchContents = () => {
    setContents([]);
    setCurrentPage(1);
  };

  // function to fetch the content data
  const fetchContentsData = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page,
        limit,
        status: status || undefined,
        title,
        isMe,
        categoryId1: categoryId1 || undefined,
        categoryId2: categoryId2 || undefined,
        categoryId3: categoryId3 || undefined,
      };

      const response = await fetchVideosList(params);

      if (!response?.page) {
        throw new Error('Failed to fetch contents!');
      }

      setContents((prev) => [...prev, ...(response.page || [])]);
      setTotalItems(response.total_items || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // handle page change for infinite scroll
  const fetchNextPage = () => {
    if (!isLoading && contents.length < totalItems) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const prevDeps = prevDepsRef.current;

    // check if any of the tracked dependencies have changed
    const isChanged =
      prevDeps.status !== status ||
      prevDeps.categoryId1 !== categoryId1 ||
      prevDeps.categoryId2 !== categoryId2 ||
      prevDeps.categoryId3 !== categoryId3 ||
      prevDeps.title !== title;

    if (isChanged) {
      setContents([]);
      setCurrentPage(1);
      fetchContentsData(1);

      // Update previous dependencies
      prevDepsRef.current = {
        status,
        categoryId1,
        categoryId2,
        categoryId3,
        title,
      };
    }
  }, [status, categoryId1, categoryId2, categoryId3, title]);

  // fetch contents on initial load or when the page number changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchContentsData(1);
    } else {
      fetchContentsData(currentPage);
    }
  }, [currentPage]);

  return {
    contents,
    isLoading,
    totalItems,
    error,
    refetchContents,
    fetchNextPage,
  };
};

export default useVideosList;
