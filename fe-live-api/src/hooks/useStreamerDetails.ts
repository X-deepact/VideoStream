import { useState, useCallback, useEffect } from 'react';
import { StreamerDetailsResponse } from '@/data/dto/streamer';
import { fetchStreamerDetails } from '@/services/streamer';

const useStreamerDetails = (id: string | null) => {
  const [data, setData] = useState<StreamerDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotiMuted, setIsNotiMuted] = useState(false);

  const getData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchStreamerDetails(id);

      if (!response) {
        throw new Error('Failed to fetch streamer details!');
      }

      setData(response);
      setSubscribedCount(response.total_subscribe || 0);
      setIsSubscribed(response.is_subscribed);
      setIsNotiMuted(response.is_mute);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [id, getData]);

  return {
    data,
    subscribedCount,
    isSubscribed,
    isNotiMuted,
    isLoading,
    error,
    getData,
    setSubscribedCount,
    setIsSubscribed,
    setIsNotiMuted,
  };
};

export default useStreamerDetails;
