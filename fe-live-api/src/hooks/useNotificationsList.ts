import { useState, useEffect, useCallback } from 'react';
import { NotificationResponse } from '@/data/dto/notification';
import { fetchNotificationsList } from '@/services/notification';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';

const useNotificationsList = () => {
  const [data, setData] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  // Fetch Data
  const fetchData = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchNotificationsList({
        page,
        limit: DEFAULT_PAGE_SIZE,
      });

      if (!response?.page) {
        throw new Error('Failed to fetch data!');
      }

      setData((prev) => [
        ...prev,
        ...(response.page?.filter(
          (newData) =>
            !prev.some((existingData) => existingData.id === newData.id)
        ) || []),
      ]);
      setTotalItems(response.total_items || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(DEFAULT_PAGE);
  }, [fetchData]);

  // Refetch for manual reset
  const refetchContents = useCallback(() => {
    setData([]);
    setCurrentPage(DEFAULT_PAGE);
    fetchData(DEFAULT_PAGE);
  }, [fetchData]);

  // Fetch the next page
  const fetchNextPage = useCallback(() => {
    if (!isLoading && data?.length < totalItems) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  }, [isLoading, data, totalItems, currentPage, fetchData]);

  return {
    data,
    isLoading,
    totalItems,
    error,
    setData,
    refetchData: refetchContents,
    fetchNextPage,
  };
};

export default useNotificationsList;
