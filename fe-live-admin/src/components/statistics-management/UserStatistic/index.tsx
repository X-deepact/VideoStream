import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Slash } from "lucide-react";
import {
  getUserStatisticsTableColumns
} from "@/components/statistics-management/UserStatistic/columns.tsx";
import { DataTable, TableSampleFilterType } from "../../common/DataTable.tsx";
import useUserStatistic from "@/hooks/useUserStatistic.ts";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/validation.ts";


const UserStatistic = () => {
  const [keyword, setKeyword] = useState('');
  const {
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
    setRoleType
  } = useUserStatistic({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    keyword,
  });

  const columns = () => getUserStatisticsTableColumns({
    sort: {
      sortBy,
      sortOrder,
      setSortBy,
      setSortOrder,
    }
  });

  const handlePageLimitChange = (limit: number) => setPageLimit(limit);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (_keyword: string): void => setKeyword(_keyword);
  const handleFilteredByRole = (role: string) => setRoleType(role)

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
              <BreadcrumbPage>User Statistics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <DataTable
        columns={columns()}
        data={data}
        totalCount={totalItems}
        isLoading={isLoading}
        onRefresh={refetchData}
        actions={{
          search: {
            placeholder: "Search Users...",
            value: keyword,
            onSearch: (_keyword: string): void => handleSearch(_keyword),
          },
          sampleFilters: [
            {
              type: TableSampleFilterType.SELECT,
              placeholder: "Streamer",
              description: "Filter by role",
              options: [
                { value: "streamer", label: "Streamer" },
                { value: "user", label: "User" },
              ],
              selectedValue: role,
              handleFilter: (selectedOption: string) => handleFilteredByRole(selectedOption),
            },
          ],
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

export default UserStatistic;
