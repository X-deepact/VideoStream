import { useEffect, useState } from 'react';
import { getAdminsList } from '@/services/user.service';
import { UserMiniResponse } from '@/type/users';
import { handleApiError } from '@/lib/error-handler';

export const useAdminsList = () => {
  const [data, setData] = useState<UserMiniResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAdminsList();

        console.log('banan -> ', response);

        if (!response) throw new Error('Failed to fetch data!');

        const data = response.data;
        setData(data);
        setTotalItems(data?.length);
      } catch (err) {
        handleApiError(err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refetchKey]);

  const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);

  return {
    data,
    totalItems,
    isLoading,
    error,
    refetchData,
  };
};
