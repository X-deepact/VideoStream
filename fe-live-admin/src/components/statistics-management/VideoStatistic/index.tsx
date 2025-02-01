import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { getVideoStatisticsTableColumns } from "./columns";
import { DataTable } from "../../common/DataTable";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/validation";
import useVideoStatistic from "@/hooks/useVideoStatistic";
import { SORT_ORDER } from "@/lib/validation";

const VideoStatistic = () => {
  const [keyword, setKeyword] = useState("");
  const {
    data,
    totalItems,
    currentPage,
    pageLimit,
    isLoading,
    sortBy,
    sortOrder,
    refetchData,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
  } = useVideoStatistic({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    keyword,
    sortBy: "created_at",
    sort: SORT_ORDER.DESC,
  });

  const columns = getVideoStatisticsTableColumns({
    sort: {
      sortBy,
      sortOrder,
      setSortBy,
      setSortOrder,
    },
  });

  const handlePageLimitChange = (limit: number) => setPageLimit(limit);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (_keyword: string) => setKeyword(_keyword);

  return (
    <div className="px-8">
      <div className="py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Video Statistics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <DataTable
        columns={columns}
        data={data}
        totalCount={totalItems}
        isLoading={isLoading}
        onRefresh={refetchData}
        actions={{
          search: {
            placeholder: "Search by title...",
            value: keyword,
            onSearch: handleSearch,
          },
        }}
        pagination={{
          rowsPerPage: {
            value: pageLimit,
            onChange: handlePageLimitChange,
          },
          pages: {
            totalCount: totalItems,
            currentPage: currentPage,
            limit: pageLimit,
            handlePageChange,
          },
        }}
      />
    </div>
  );
};

export default VideoStatistic;
