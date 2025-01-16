import { useState, useEffect } from 'react';
import { getAccountList } from '@/services/user.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SORT_ORDER } from '@/lib/validation';
import { USER_STATUS, UserResponse } from '@/type/users';
import { ROLE } from '@/type/role';
import { handleApiError } from '@/lib/error-handler';

interface Props {
  page: number;
  limit: number;
  sortBy?: string | undefined;
  sort?: SORT_ORDER;
  keyword?: string;
}

const useUsersList = (payload: Props) => {
  const { keyword = undefined } = payload;

  const [data, setData] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageLimit, setPageLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState('display_name');
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);
  const [filteredRole, setFilteredRole] = useState<ROLE | string>('All');
  const [filteredStatus, setFilteredStatus] = useState<USER_STATUS | string>(
    'All'
  );
  const [filteredCreatorUsername, setFilteredCreatorUsername] =
    useState<string>('All');

  const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, unknown> = {
          page: currentPage,
          limit: pageLimit,
          keyword: keyword || undefined,
          role: filteredRole !== 'All' ? filteredRole : undefined,
          status: filteredStatus !== 'All' ? filteredStatus : undefined,
          created_by:
            filteredCreatorUsername !== 'All'
              ? filteredCreatorUsername
              : undefined,
          sortBy: sortBy || undefined,
          sort: sortOrder || undefined,
        };

        const response = await getAccountList(params);

        if (!response) throw new Error('Failed to fetch data!');

        const { page: _page, total_items, current_page } = response.data.data;
        setData(() => [...(_page || [])]);
        setTotalItems(total_items || 0);
        setCurrentPage(current_page ?? 1);
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
  }, [
    currentPage,
    pageLimit,
    sortBy,
    sortOrder,
    keyword,
    filteredRole,
    filteredStatus,
    filteredCreatorUsername,
    refetchKey,
  ]);

  return {
    data,
    isLoading,
    totalItems,
    currentPage,
    pageLimit,
    error,
    sortBy,
    sortOrder,
    filteredRole,
    filteredStatus,
    filteredCreatorUsername,
    refetchData,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setFilteredRole,
    setFilteredStatus,
    setFilteredCreatorUsername,
  };
};

export default useUsersList;
