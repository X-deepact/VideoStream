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
import { formatDuration, formatFileSize, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { Input } from "../ui/input";


const VideoStatistic = () => {
  const { toast } = useToast();
  const [streamData, setStreamData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("started_at");
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
        viewers: stream.live_stream_analytic?.viewers ?? 0,
        likes: stream.live_stream_analytic?.likes ?? 0,
        duration: formatDuration(stream.live_stream_analytic?.duration ?? 0),
        comments: stream.live_stream_analytic?.comments ?? 0,
        video_size: formatFileSize(stream.live_stream_analytic?.video_size ?? 0),
        created_at: formatDate(stream.started_at),
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
    created_at: "started_at"
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