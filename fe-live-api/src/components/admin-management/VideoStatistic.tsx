import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { getVideoStatistics } from "@/services/videoStatistic.service"; // Import the service function
import { formatDuration, formatFileSize } from "@/lib/utils"; // Import the utility functions

type TimePeriod = "yesterday" | "7days" | "30days";

interface VideoStats {
  title: string;
  viewers: number;
  likes: number;
  description: string;
  comments: number;
  video_size: number;
  created_at: string;
}

const VideoStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("yesterday");
  const [videoStats, setVideoStats] = useState<VideoStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllVideoStats = async () => {
      try {
        const response = await getVideoStatistics(1, Number.MAX_SAFE_INTEGER, selectedPeriod, searchQuery);
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.data.page)) {
          setVideoStats(response.data.data.page);
        } else {
          console.error("Unexpected response format:", response.data);
          setVideoStats([]);
        }
      } catch (error) {
        console.error("Error fetching video statistics:", error);
        setVideoStats([]);
      }
    };

    fetchAllVideoStats();
  }, [selectedPeriod, searchQuery]);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const filteredVideoStats = videoStats.filter((stat) =>
    stat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideoStats.length / itemsPerPage);
  console.log("Total Pages:", filteredVideoStats);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVideoStats.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsisAfter = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1) ||
        i <= showEllipsisAfter
      ) {
        pageNumbers.push(i);
      }
    }

    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };

  const renderPagination = () => {
    return (
      <div className="py-4 border-t flex justify-center">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 text-sm rounded-sm ${
                currentPage === pageNumber
                  ? "bg-gray-500 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
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
              <BreadcrumbPage>Video Statistics Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="rounded-md border mt-4">
        <div className="p-4 border-b flex justify-start">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                No.
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Video Title
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Views
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Likes
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Total Comments
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Duration
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                File Size
              </th>
              <th className="border-b bg-white px-4 py-3 text-center font-semibold">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((stat, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="px-4 py-3 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-center">{stat.title}</td>
                <td className="px-4 py-3 text-center">{stat.viewers}</td>
                <td className="px-4 py-3 text-center">{stat.likes}</td>
                <td className="px-4 py-3 text-center">{stat.comments}</td>
                <td className="px-4 py-3 text-center">{formatDuration(stat.description)}</td>
                <td className="px-4 py-3 text-center">{formatFileSize(stat.video_size)}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(stat.created_at).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Shanghai'
                  }).replace(/[\/]/g, '.')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVideoStats.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No videos found matching your search.
          </div>
        ) : (
          renderPagination()
        )}
      </div>
    </div>
  );
};

export default VideoStatistics;
