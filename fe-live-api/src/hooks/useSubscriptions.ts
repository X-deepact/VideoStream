import { useState, useEffect } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';
import {
  SubscriptionListRequest,
  SubscriptionResponse,
} from '@/data/dto/subscription';
import { fetchSubscriptionList } from '@/services/subscription';

const useSubscriptions = (payload: SubscriptionListRequest = {}) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_SIZE,
    isInfiniteList,
  } = payload;

  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const refetchSubscriptions = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, unknown> = {
          page,
          limit,
        };

        const response = await fetchSubscriptionList(params);

        if (!response?.page) throw new Error('Failed to fetch subscriptions!');

        if (isInfiniteList) {
          setSubscriptions((prev) => {
            const newSubscriptions = response.page || [];
            const uniqueSubscriptions = [
              ...prev,
              ...newSubscriptions.filter(
                (video) => !prev.some((v) => v.id === video.id)
              ),
            ];
            return uniqueSubscriptions;
          });
        } else {
          setSubscriptions(() => {
            return [...(response.page || [])];
          });
        }
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

    fetchData();
  }, [page, limit, isInfiniteList, refetchKey]);

  return {
    subscriptions,
    isLoading,
    hasMore,
    totalItems,
    error,
    setTotalItems,
    refetchSubscriptions,
    setSubscriptions,
  };
};

export default useSubscriptions;
