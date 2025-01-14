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
import { DataTable } from "../ui/datatable";
import { getUserStatistics } from "@/services/userStatistic.service";
import { columns } from "@/components/admin-management/UserStatisticColumns.tsx";
import { useToast } from "@/hooks/use-toast";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserStatistic = () => {
  const { toast } = useToast();
  const [streamData, setStreamData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleType, setRoleType] = useState("streamer");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

      console.log('Fetching data with params:', {
        currentPage,
        pageSize,
        searchKeyword,
        roleType,
        sortBy,
        sortOrder
      });

      const response = await getUserStatistics(
        currentPage,
        pageSize,
        searchKeyword,
        roleType,
        sortBy,
        sortOrder
      );
      
      console.log('API Response:', response);
      const users = response.data?.page || [];
      console.log('Users array:', users);
      
      if (!Array.isArray(users)) {
        console.error('Unexpected data format:', users);
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
        streams: user.total_streams || 0,
        likes: user.total_likes || 0,
        comments: user.total_comments || 0,
        views: user.total_views || 0,
      }));

      console.log('Transformed data:', transformedUserData);
      setStreamData(transformedUserData);
      
      const totalItems = response.data?.total_items || 0;
      console.log('Total items:', totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (error) {
      console.error('Fetch error:', error);
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

  const handleSortChange = (columnId: string) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortOrder('desc');
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

      <div className="flex justify-end items-center py-4 gap-4">
        <Select
          value={roleType}
          onValueChange={(value) => setRoleType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="streamer">Streamer</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by title..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={streamData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        meta={{
          onSortChange: handleSortChange
        }}
      />
    </div>
  );
};

export default UserStatistic;