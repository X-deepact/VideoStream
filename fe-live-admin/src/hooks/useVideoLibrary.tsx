import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast.ts";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SORT_ORDER } from "@/lib/validation";
import { getVideoLibrary } from "@/services/videolibrary.service";
import { VIDEO_TYPE } from "@/type/video";
import { Video } from "@/type/api";

interface Props {
  page?: number;
  limit?: number;
  sort_By?: string;
  sort?: SORT_ORDER;
  category?: string;
  keyword?: string;
  type?: string;
}
export const useVideoLibrary = (payload: Props) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_SIZE,
    sort_By = "title",
    sort = SORT_ORDER.ASC,
    keyword = "",
  } = payload;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(page | DEFAULT_PAGE);
  const [pageLimit, setPageLimit] = useState(limit | DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState(sort_By);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(sort);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [filteredType, setFilteredType] = useState<VIDEO_TYPE | string>("All");

  const [videos, setVideos] = useState<Video[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let category =
          filteredCategory !== "All" ? filteredCategory : undefined;
        let type = filteredType !== "All" ? filteredType : undefined;
        const response = await getVideoLibrary(
          currentPage,
          pageLimit,
          sortBy,
          sortOrder,
          category,
          keyword,
          type
        );
        const { data } = response.data;
        setTotalItems(data.total_items ?? 0);
        setCurrentPage(data.current_page ?? 1);
        setPageLimit(data.page_size ?? 10);
        let transformData;
        if (data.page) {
          transformData = data.page.map((video: any) => {
            return {
              id: video.id,
              title: video.title,
              description: video.description,
              broadcast_url: video.broadcast_url,
              stream_type: video.stream_type,
              thumbnail_file_name: video.thumbnail_file_name,
              started_at: video.started_at,
              ended_at: video.ended_at,
              user: video.user,
              categories: video.categories,
              live_stream_analytic: video.live_stream_analytic,
              schedule_stream: video.schedule_stream,
            };
          });
        }
        transformData = transformData ?? [];

        setVideos(transformData);
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
    filteredCategory,
    keyword,
    filteredType,
    refetchKey,
  ]);

  const refetchCategories = () => {
    setRefetchKey((prevKey) => prevKey + 1);
  };

  return {
    videos,
    isLoading,
    totalItems,
    currentPage,
    pageLimit,
    error,
    sortBy,
    sortOrder,
    filteredCategory,
    filteredType,
    refetchCategories,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setFilteredCategory,
    setFilteredType,
  };
};
