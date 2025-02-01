import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT_ORDER,
} from "@/lib/validation.ts";
import { useEffect, useState } from "react";
import { UserStatisticsResponse } from "@/type/statistic.ts";
import { getUserStatistics } from "@/services/userStatistic.service.ts";

interface Props {
  page: number;
  limit: number;
  sortBy?: string | undefined;
  sort?: SORT_ORDER;
  keyword?: string;
}

const useUserStatistic = (payload: Props) => {
  const { keyword = undefined } = payload;

  const [data, setData] = useState<UserStatisticsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageLimit, setPageLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("display_name");
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);
  const [role, setRole] = useState<string>("streamer");

  const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const params: Record<string, unknown> = {
          page: currentPage,
          limit: pageLimit,
          keyword: keyword || undefined,
          sortBy: sortBy || undefined,
          sort: sortOrder || undefined,
          role_type: role,
        };

        const response = await getUserStatistics(params);

        if (!response) throw new Error("Failed to get statistics!");

        const { page: _page, total_items, current_page } = response.data.data;

        setData(() => [...(_page || [])]);
        setTotalItems(total_items || 0);
        setCurrentPage(current_page ?? 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refetchKey, currentPage, pageLimit, sortBy, sortOrder, keyword, role]);

  return {
    data,
    totalItems,
    currentPage,
    pageLimit,
    isLoading,
    sortBy,
    sortOrder,
    role,
    refetchData,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setRoleType: setRole,
  };
};

export default useUserStatistic;
