import { useState, useEffect } from 'react';
import { VideoDetailsResponse } from '@/data/dto/stream';
import { fetchVideoDetails } from '@/services/stream';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const getVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) return;

        const response = await fetchVideoDetails(id);

        if (!response) {
          throw new Error('Failed to fetch video details!');
        }

        setVideoDetails(response);
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
