import { Download, Play, Slash, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
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
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

const VideoLibrary = () => {
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

  const ondeletehandle = async (id: any) => {
    try {
      const res = await deleteVideo(id);
      if (res.status == 200) fetchData();
      else {
        toast({
          description: "Failed to delete video. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
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
                      {new Date(video.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(video.ended_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{video.user.display_name}</TableCell>
                    <TableCell>{video.stream_type}</TableCell>
                    <TableCell className="items-center justify-center">
                      <div className="flex flex-row gap-1 justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline">
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
                              <Button variant="outline">
                                <Download />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Video</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Dialog>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button variant="destructive">
                                    <Trash2 />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                              <Button
                                variant="destructive"
                                onClick={() => ondeletehandle(video.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
    </div>
  );
};

export default VideoLibrary;
