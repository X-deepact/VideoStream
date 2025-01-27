import { useState, useEffect, useCallback } from 'react';
import { CategoryResponse } from '@/data/dto/category';
import { fetchCategories } from '@/services/category';

export const FixedCategories = [
  { id: 9999, name: 'All' },
  { id: 8888, name: 'Live' },
];

const useCategories = ({
  initialFetch,
  addFixedCategories,
}: {
  initialFetch: boolean;
  addFixedCategories: boolean;
}) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const getContents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchCategories();

      if (!response) {
        throw new Error('Failed to fetch categories!');
      }

      if (addFixedCategories) setCategories([...FixedCategories, ...response]);
      else setCategories(response || []);

      setTotalItems(response.length || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [addFixedCategories]);

  useEffect(() => {
    if (initialFetch) getContents();
  }, [refetchKey, initialFetch, addFixedCategories, getContents]);

  const refetchCategories = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    categories,
    isLoading,
    totalItems,
    error,
    refetchCategories,
    fetchCategories: getContents,
  };
};

export default useCategories;
