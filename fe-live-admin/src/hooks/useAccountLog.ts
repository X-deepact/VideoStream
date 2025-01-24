import { useEffect, useState } from "react";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  SORT_ORDER,
} from "@/lib/validation.ts";
import { handleApiError } from "@/lib/error-handler.ts";
import { getAccountLog } from "@/services/user.service.ts";
import { ActivityLogResponse } from "@/type/users.ts";

const useAccountLog = () => {
  const [data, setData] = useState<ActivityLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sort_by, setSort_by] = useState("performed_at");
  const [sort, setSort] = useState<SORT_ORDER>(SORT_ORDER.ASC);
  const [keyword, setKeyword] = useState("");
  const [filter_by, setFilter_by] = useState("username");
  const [action, setAction] = useState("");

  const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let Action;
        if (action !== "All") Action = action;
        let Keyword;
        if (keyword !== "All") Keyword = keyword;
        const response = await getAccountLog(
          currentPage,
          pageSize,
          sort_by,
          sort,
          Keyword,
          filter_by,
          Action
        );

        if (!response) throw new Error("Failed to fetch data!");

        const { page: _page, total_items, current_page } = response.data.data;
        setData(() => [...(_page || [])]);
        setTotalItems(total_items || 0);
        setCurrentPage(current_page ?? 1);
      } catch (err) {
        handleApiError(err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageSize, currentPage, sort, sort_by, keyword, action, refetchKey]);

  return {
    data,
    isLoading,
    totalItems,
    currentPage,
    pageLimit: pageSize,
    error,
    sortBy: sort_by,
    sortOrder: sort,
    action,
    keyword,
    refetchData,
    setCurrentPage,
    setPageLimit: setPageSize,
    setSortBy: setSort_by,
    setSortOrder: setSort,
    setAction,
    setKeyword,
    setFilter: setFilter_by,
  };
};

export default useAccountLog;
