import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Slash } from "lucide-react";
import { getUserStatistics } from "@/services/userStatistic.service";
import { columns } from "@/components/admin-management/UserStatisticColumns.tsx";
import { useToast } from "@/hooks/use-toast";
import { DataTable, TableSampleFilterType } from "../common/DataTable";
import { formatKMBCount } from "@/lib/utils";


const UserStatistic = () => {
  const { toast } = useToast();
  const [streamData, setStreamData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleType, setRoleType] = useState("streamer");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStreamData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, searchKeyword, roleType, sortBy, sortOrder]);

  const fetchStreamData = async () => {
    try {
      // Check if we have auth token before making the request
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please login to continue"
        });
        window.location.href = '/login';
        return;
      }

      const response = await getUserStatistics(
        currentPage,
        pageSize,
        searchKeyword,
        roleType,
        sortBy,
        sortOrder
      );
      
      const users = response.data?.page || [];
      
      if (!Array.isArray(users)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid data format received from server"
        });
        return;
      }

      const transformedUserData = users.map((user: any) => ({
        display_name: user.display_name,
        username: user.username,
        streams: formatKMBCount(user.total_streams || 0),
        likes: formatKMBCount(user.total_likes || 0),
        comments: formatKMBCount(user.total_comments || 0),
        views: formatKMBCount(user.total_views || 0),
      }));

      setStreamData(transformedUserData as never[]);
      
      const totalItems = response.data?.total_items || 0;
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to fetch user statistics. Please try logging in again."
      });

      if (error instanceof Error && error.message.includes('Session expired')) {
        window.location.href = '/login';
      }
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const currentFirstItem = (currentPage - 1) * pageSize + 1;
    
    const newPage = Math.ceil(currentFirstItem / newPageSize);
    
    setPageSize(newPageSize);
    setCurrentPage(newPage);
  };

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(columnId);
      setSortOrder('DESC');
    }
  };

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
        columns={columns(handleSort).map(col => ({
          ...col,
          cell: ({ row }) => (
            <div className="text-center">{row.getValue(col.accessorKey as string)}</div>
          )
        }))}
        data={streamData} 
        totalCount={totalItems}
        isLoading={false}
        onRefresh={fetchStreamData} 
        actions={{
          search: {
            placeholder: "Search users...",
            value: searchKeyword,
            onSearch: setSearchKeyword,
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
              selectedValue: roleType,
              handleFilter: (value) => setRoleType(value),
            },
          ],
        }}
        pagination={{
          rowsPerPage: {
            value: pageSize,
            onChange: handlePageSizeChange,
          },
          pages: {
            totalCount: totalPages * pageSize,
            currentPage: currentPage,
            limit: pageSize,
            handlePageChange: setCurrentPage,
          },
        }}
      />
    </div>
  );
};

export default UserStatistic;
