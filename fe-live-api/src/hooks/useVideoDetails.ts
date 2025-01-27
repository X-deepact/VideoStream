import { useState, useEffect } from 'react';
import { VideoDetailsResponse } from '@/data/dto/stream';
import { fetchVideoDetails } from '@/services/stream';
import { API_ERROR } from '@/data/api';

interface ComponentProps {
  id: string | null;
}

const useVideoDetails = ({
  id,
}: ComponentProps): {
  videoDetails: VideoDetailsResponse | null;
  isLoading: boolean;
  error: string | null;
} => {
  const [videoDetails, setVideoDetails] = useState<VideoDetailsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | API_ERROR | null>(null);

  useEffect(() => {
    if (!id) return;

    const getVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchVideoDetails(id);

        if (
          response &&
          Object.values(API_ERROR).includes(response as API_ERROR)
        ) {
          setError(response as API_ERROR);
        }

        setVideoDetails(response as VideoDetailsResponse);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    getVideoDetails();
  }, [id]);

  return {
    videoDetails,
    isLoading,
    error,
  };
};

export default useVideoDetails;
