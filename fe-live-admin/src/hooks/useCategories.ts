import { useEffect, useState } from "react";
import { getCategories } from "@/services/category.service.ts";
import { Catalogue } from "@/lib/interface.tsx";
import { toast } from "@/hooks/use-toast.ts";
import { DEFAULT_PAGE, SORT_ORDER } from "@/lib/validation";

interface Category {
  label: string;
  value: string;
  creator: [];
  created_at: string;
  updater: [];
  updated_at: string;
}

interface Props {
  page?: number;
  limit?: number;
  sort_By?: string;
  sort?: SORT_ORDER;
  name?: string;
  created_by?: string;
}
export const useCategories = (payload: Props) => {
  const {
    page = DEFAULT_PAGE,
    limit = 99999,
    sort_By = "name",
    sort = SORT_ORDER.ASC,
    name = "",
    created_by = "",
  } = payload;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageLimit, setPageLimit] = useState(limit);
  const [sortBy, setSortBy] = useState(sort_By);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(sort);

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCreatorUsername, setFilteredCreatorUsername] =
    useState<string>("All");
  const [filteredName, setFilteredName] = useState<string>("All");
  const [refetchKey, setRefetchKey] = useState(0);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let createdBy;
        filteredCreatorUsername !== "All"
          ? (createdBy = filteredCreatorUsername)
          : (createdBy = created_by);
        let Name;
        filteredName !== "All" ? (Name = filteredName) : (Name = name);

        const response = await getCategories(
          currentPage,
          pageLimit,
          Name,
          createdBy,
          sortBy,
          sortOrder
        );
        const { data } = response.data;
        setTotalItems(data.total_items ?? 0);
        setCurrentPage(data.current_page ?? 1);
        setPageLimit(data.page_size);
        let transformData;
        if (data.page) {
          transformData = data.page.map((category: Catalogue) => {
            return {
              label: category.name,
              value: String(category.id),
              creator: category.created_by_user,
              created_at: category.created_at,
              updater: category.updated_by_user,
              updated_at: category.updated_at,
            };
          });
        }
        transformData = transformData ?? [];

        setCategories(transformData);
      } catch (e: any) {
        toast({
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [
    currentPage,
    pageLimit,
    sortBy,
    sortOrder,
    created_by,
    name,
    filteredCreatorUsername,
    filteredName,
    refetchKey,
  ]);

  const refetchCategories = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    categories,
    isLoading,
    totalItems,
    currentPage,
    pageLimit,
    error,
    sortBy,
    sortOrder,
    filteredCreatorUsername,
    filteredName,
    refetchCategories,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setFilteredCreatorUsername,
    setFilteredName,
  };
};
