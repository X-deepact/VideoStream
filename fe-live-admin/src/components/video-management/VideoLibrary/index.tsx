import { getVideosTableColumns } from "./columns";
import {
  DataTable,
  TableSampleFilterType,
} from "@/components/common/DataTable";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SORT_ORDER } from "@/lib/validation";
import { useState } from "react";
import { useVideoLibrary } from "@/hooks/useVideoLibrary";
import { useCategories } from "@/hooks/useCategories";
import { VIDEO_TYPE } from "@/type/video";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const VideoLibrary = () => {
  const [keyword, setKeyword] = useState("");
  const {
    videos,
    isLoading,
    totalItems,
    currentPage,
    pageLimit,
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
  } = useVideoLibrary({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    sort_By: "title",
    sort: SORT_ORDER.ASC,
    keyword,
  });

  const columns = () =>
    getVideosTableColumns({
      sort: {
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
      },
    });
  const handlePageLimitChange = (limit: number) => setPageLimit(limit);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const { categories: nameList } = useCategories({});
  const transformNameMiniResponse = (
    data: any
  ): { label: string; value: string }[] => {
    return data?.map((cat: any) => ({
      label: cat.label,
      value: cat.label,
    }));
  };
  const transformedNameOptions = transformNameMiniResponse(nameList);

  return (
    <div className="px-8 pb-4">
      <Breadcrumb className="py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Video Library Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DataTable
        data={videos}
        totalCount={totalItems}
        canToggleColumns={false}
        columns={columns()}
        isLoading={isLoading}
        onRefresh={refetchCategories}
        pagination={{
          rowsPerPage: {
            value: pageLimit,
            onChange: (value: number) => handlePageLimitChange(value),
          },
          pages: {
            totalCount: totalItems,
            currentPage,
            limit: pageLimit,
            handlePageChange,
          },
        }}
        actions={{
          search: {
            placeholder: "Search...",
            value: keyword,
            onSearch: (value: string): void => setKeyword(value),
          },
          sampleFilters: [
            {
              type: TableSampleFilterType.DATA_COMBO,
              placeholder: filteredCategory,
              description: "Category —",
              selectedValue: filteredCategory,
              options: [
                { label: "All", value: "All" },
                ...transformedNameOptions,
              ],
              handleFilter: (selectedOption: any): void =>
                setFilteredCategory(selectedOption),
            },
            {
              type: TableSampleFilterType.DATA_COMBO,
              placeholder: filteredType,
              description: "Type —",
              selectedValue: filteredType,
              options: [
                "All",
                VIDEO_TYPE.CAMERA,
                VIDEO_TYPE.SOFTWARE,
                VIDEO_TYPE.PRE_RECORDED,
              ],
              handleFilter: (selectedOption: string): void =>
                setFilteredType(selectedOption),
            },
          ],
        }}
      />
    </div>
  );
};

export default VideoLibrary;
