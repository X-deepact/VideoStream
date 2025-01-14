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
import { getVideoStatistics } from "@/services/videoStatistic.service";
import { columns } from "@/components/admin-management/VideoStatisticColumns.tsx";
import { formatDuration, formatFileSize } from "@/lib/utils";
import { formatDate } from "@/lib/date-formated";
import { useToast } from "@/hooks/use-toast";

import { Input } from "../ui/input";
  

const VideoStatistic = () => {
  const { toast } = useToast();
  const [streamData, setStreamData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
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
      const response = await getVideoStatistics(
        currentPage,
        pageSize,
        sortBy,
        sort,
        searchKeyword
      );
      
      const streams = response.data.page;

      if (!streams) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Streams data is undefined"
        });
        return;
      }

      const transformedStreamData = streams.map((stream: any) => ({
        title: stream.title,
        viewers: stream.viewers || 0,
        likes: stream.likes || 0,
        duration: formatDuration(stream.duration || 0),
        comments: stream.comments || 0,
        video_size: formatFileSize(stream.video_size || 0),
        created_at: formatDate(stream.created_at, true) || 'Na',
      }));

      setStreamData(transformedStreamData);

      const totalItems = response.data.total_items;
      if (totalItems !== undefined) {
        setTotalPages(Math.ceil(totalItems / pageSize));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Total items data is undefined"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch stream data"
      });
    }
  };

  const sortKeyMapping: { [key: string]: string } = {
    title: "title",
    viewers: "views",  
    likes: "likes",
    comments: "comments",
    duration: "duration",
    video_size: "video_size",
    created_at: "created_at"
  };

  const handleSortChange = (columnId: string) => {
    if (columnId in sortKeyMapping) {
      const backendSortKey = sortKeyMapping[columnId];
      const isAsc = sortBy === backendSortKey && sort === "DESC";
      setSort(isAsc ? "ASC" : "DESC");
      setSortBy(backendSortKey);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const currentFirstItem = (currentPage - 1) * pageSize + 1;
    
    const newPage = Math.ceil(currentFirstItem / newPageSize);
    
    setPageSize(newPageSize);
    setCurrentPage(newPage);
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
              <BreadcrumbPage>Video Statistics</BreadcrumbPage>
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
        setPageSize={handlePageSizeChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default VideoStatistic;