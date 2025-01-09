import { Download, Play, Slash, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { deleteVideo, getVideoLibrary } from "@/services/videolibrary.service";
import ImageWithAuth from "../ui/imagewithauth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import authHeader from "@/services/auth-header";
import { formatDate } from "@/lib/date-formated";

const VideoLibrary = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [videoData, setVideoData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState("ASC");
  const [sort_by, setSort_by] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [pageSize, currentPage, sort_by, sort]);

  const fetchData = async () => {
    try {
      const response = await getVideoLibrary(
        currentPage,
        pageSize,
        sort_by,
        sort
      );
      setVideoData(response.data.data.page);
      setCurrentPage(response.data.data.current_page);
      setTotalPages(response.data.data.length);
    } catch (err) {
      toast({
        description: "Failed to fetch video data.",
        variant: "destructive",
      });
    }
  };

  const ondeletehandle = async () => {
    try {
      await deleteVideo(deleteID);
      fetchData();
      setIsDeleteOpen(false);
      setDeleteID("");
      toast({
        description: "Video deleted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleplay = async (videourl: any) => {
    try {
      const response = await fetch(videourl, {
        method: "GET",
        headers: authHeader(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch resource");
      }

      // Get the response URL or data
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Open the URL in a new tab
      window.open(url, "_blank");

      // Optionally, revoke the object URL after some time
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error opening tab:", error);
    }
  };

  const handledownload = async (videourl: any, videotitle: any) => {
    const response = await axios.get(videourl, {
      headers: authHeader(),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", videotitle + ".mp4");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div className="w-full p-4">
      <Breadcrumb>
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
      <div className="flex justify-end m-4">
        <Input placeholder="Search..." className="max-w-[200px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                <Label>Thumbnail</Label>
              </TableCell>
              <TableCell>
                <Label>Title</Label>
              </TableCell>
              <TableCell>
                <Label>Description</Label>
              </TableCell>
              <TableCell>
                <Label>Started At</Label>
              </TableCell>
              <TableCell>
                <Label>Ended At</Label>
              </TableCell>
              <TableCell>
                <Label>Created By</Label>
              </TableCell>
              <TableCell>
                <Label>Type</Label>
              </TableCell>
              <TableCell>
                <Label>Category</Label>
              </TableCell>
              <TableCell>
                <Label>Action</Label>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videoData && videoData.length > 0 ? (
              videoData.map(
                (
                  video: any // Map over videoData to display each video
                ) => (
                  <TableRow key={video.id}>
                    <TableCell className="flex justify-center">
                      <div className="flex w-[100px] h-[100px] justify-center items-center">
                        <ImageWithAuth url={video.thumbnail_file_name} />
                      </div>
                    </TableCell>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.description}</TableCell>
                    <TableCell>
                      {video.started_at
                        ? formatDate(video.started_at, true)
                        : ""}
                    </TableCell>
                    <TableCell>
                      {video.ended_at ? formatDate(video.ended_at, true) : ""}
                    </TableCell>
                    <TableCell>{video.user.display_name}</TableCell>
                    <TableCell>{video.stream_type}</TableCell>
                    <TableCell>
                      {video.categories && video.categories.length > 0
                        ? video.categories
                            .map((category: any) => category.name)
                            .join(", ")
                        : ""}
                    </TableCell>
                    <TableCell className="items-center justify-center">
                      <div className="flex flex-row gap-1 justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleplay(video.schedule_stream.video_url)
                                }
                              >
                                <Play />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Play Video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handledownload(
                                    video.schedule_stream.video_url,
                                    video.title
                                  )
                                }
                              >
                                <Download />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  setIsDeleteOpen(true);
                                  setDeleteID(video.id);
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No videos available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid my-4 gap-4 grid-cols-2">
        <div className="max-w-[80px]">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue defaultValue="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row justify-end items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </Button>
          <Label>Page</Label>
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="max-w-[80px]"
          />
          <Label>of {totalPages}</Label>
          <Button
            variant="outline"
            className="px-4 py-2"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </Button>
        </div>
      </div>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Do you want to delete this video?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => ondeletehandle()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLibrary;
