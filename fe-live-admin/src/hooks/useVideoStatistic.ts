import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SORT_ORDER } from "@/lib/validation.ts";
import { useEffect, useState } from "react";
import { VideoStatisticsResponse } from "@/type/statistic.ts";
import { getVideoStatistics } from "@/services/videoStatistic.service.ts";

interface Props {
  page: number;
  limit: number;
  sortBy?: string | undefined;
  sort?: SORT_ORDER;
  keyword?: string;
  from?: number;
  to?: number;
}

const useVideoStatistic = (payload: Props) => {
  const { 
    keyword = undefined, 
    page = DEFAULT_PAGE, 
    limit = DEFAULT_PAGE_SIZE,
    sortBy: initialSortBy = 'created_at',
    sort: initialSortOrder = SORT_ORDER.DESC,
    from = undefined,
    to = undefined
  } = payload;

  const [data, setData] = useState<VideoStatisticsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageLimit, setPageLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(initialSortOrder);
  const [fromDate, setFromDate] = useState<number | undefined>(from);
  const [toDate, setToDate] = useState<number | undefined>(to);

  const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);

  useEffect(() => {
    setCurrentPage(page);
    setPageLimit(limit);
  }, [page, limit]);

  const handleSetSortBy = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // If clicking the same column, toggle sort order
      handleSetSortOrder(sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC);
    } else {
      // If clicking a new column, set it as the sort column with DESC order
      setSortBy(newSortBy);
      setSortOrder(SORT_ORDER.DESC);
    }
    // Always reset to first page when sorting changes
    setCurrentPage(1);
    refetchData();
  };

  const handleSetSortOrder = (newSortOrder: SORT_ORDER) => {
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    refetchData();
  };

  const handleSetPageLimit = (newLimit: number) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
    refetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getVideoStatistics(
          currentPage,
          pageLimit,
          sortBy,
          sortOrder,
          keyword,
          fromDate,
          toDate
        );

        if (!response) throw new Error('Failed to get video statistics!');

        const { page: _page, total_items, current_page } = response.data;

        const formattedData = (_page || []).map((item: any) => ({
          title: item.title,
          viewers: Number(item.viewers),
          likes: Number(item.likes),
          duration: item.duration,
          comments: Number(item.comments),
          shares: Number(item.shares),
          video_size: item.video_size,
          created_at: item.created_at
        }));

        setData(formattedData);
        setTotalItems(total_items || 0);
        setCurrentPage(current_page ?? 1);
      } catch (error: any) {
        setData([]);
        setTotalItems(0);
        
        if (error.message.includes('Invalid or expired token')) {
          // You might want to redirect to login or trigger a token refresh here
          window.location.href = '/login'; // Or use your router's navigation method
          setError('Your session has expired. Redirecting to login...');
        } else {
          setError(error.message || 'An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refetchKey, currentPage, pageLimit, sortBy, sortOrder, keyword, fromDate, toDate]);

  return {
    data,
    totalItems,
    currentPage,
    pageLimit,
    isLoading,
    error,
    sortBy,
    sortOrder,
    fromDate,
    toDate,
    refetchData,
    setCurrentPage,
    setPageLimit: handleSetPageLimit,
    setSortBy: handleSetSortBy,
    setSortOrder: handleSetSortOrder,
    setFromDate,
    setToDate,
  };
};

export default useVideoStatistic;