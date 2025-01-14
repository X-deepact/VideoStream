import { useState, useEffect } from 'react';
import { CategoryResponse } from '@/data/dto/category';
import { fetchCategories } from '@/services/category';

const useCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    const getContents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchCategories();

        if (!response) {
          throw new Error('Failed to fetch categories!');
        }

        setCategories(response || []);
        setTotalItems(response.length || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    getContents();
  }, [refetchKey]);

  const refetchCategories = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    categories,
    isLoading,
    totalItems,
    error,
    refetchCategories,
  };
};

export default useCategories;
