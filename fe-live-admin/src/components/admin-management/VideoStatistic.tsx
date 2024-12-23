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

import { Input } from "../ui/input";


const VideoStatistic = () => {
  const [streamData, setStreamData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("started_at");
  const [sort, setSort] = useState("DESC");

  useEffect(() => {
    fetchStreamData();
  }, [currentPage, pageSize, sortBy, sort]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const fetchStreamData = async () => {
    try {
      const response = await getVideoStatistics(
        currentPage,
        pageSize,
        sortBy,
        sort
      );
      
      console.log("API Response:", response.data); // Log the response data

      const streams = response.data.page;

      if (!streams) {
        console.error("Streams data is undefined");
        return;
      }

      const transformedStreamData = streams.map((stream: any) => ({
        title: stream.title,
        viewers: stream.live_stream_analytic.viewers,
        likes: stream.live_stream_analytic.likes,
        duration: formatDuration(stream.live_stream_analytic.duration || 0),
        comments: stream.live_stream_analytic.comments,
        video_size: formatFileSize(stream.live_stream_analytic.video_size),
        created_at: formatDate(stream.started_at),
      }));

      setStreamData(transformedStreamData);

      // Ensure this matches the actual structure
      const totalItems = response.data.total_items;
      console.log("totalItemsLength", totalItems)
      if (totalItems !== undefined) {
        setTotalPages(Math.ceil(totalItems / pageSize));
      } else {
        console.error("Total items data is undefined");
      }
    } catch (error) {
      console.error("Error fetching stream data:", error);
    }
  };

  const handleSortChange = (columnId: string) => {
    const isAsc = sortBy === columnId && sort === "ASC";
    setSort(isAsc ? "DESC" : "ASC");
    setSortBy(columnId);
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
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
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

export default VideoStatistic;