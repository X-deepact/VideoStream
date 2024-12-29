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
import { getLiveStatistics } from "../../services/liveStatistic.service";
import { Input } from "../ui/input";
import { columns } from "./LiveStatisticColumns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const LiveStatistic = () => {
  const [streamData, setStreamData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("total_viewers");
  const [sort, setSort] = useState("DESC");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStreamData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, pageSize, sortBy, sort, searchKeyword]);

  const fetchStreamData = async () => {
    try {
      const response = await getLiveStatistics(
        currentPage,
        pageSize,
        sortBy,
        sort,
        searchKeyword
      );

      console.log("API Response:", response);

      const streams = response.data?.page || [];
      
      setStreamData(streams);
      
      const totalItems = response.data?.total_items || 0;
      if (totalItems !== undefined) {
        setTotalPages(Math.ceil(totalItems / pageSize));
      }
    } catch (error) {
      console.error("Error fetching stream data:", error);
      setStreamData([]);
    }
  };

  const sortKeyMapping: { [key: string]: string } = {
    title: "title",
    current_viewers: "current_viewers",
    total_viewers: "total_viewers",
    likes: "likes",
    comments: "comments",
  };

  const handleSortChange = (columnId: string) => {
    if (columnId in sortKeyMapping) {
      const backendSortKey = sortKeyMapping[columnId];
      const isAsc = sortBy === backendSortKey && sort === "DESC";
      setSort(isAsc ? "ASC" : "DESC");
      setSortBy(backendSortKey);
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
              <BreadcrumbPage>Live Statistics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-end items-center py-4">
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
        setPageSize={setPageSize}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default LiveStatistic;