import {
  Download,
  Info,
  LayoutGrid,
  List,
  Play,
  Slash,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Card } from "../ui/card";
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
import { useState } from "react";

const VideoLibrary = () => {
  const [viewmode, setViewMode] = useState(true);
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
      <div className="flex justify-end items-center py-4">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Please enter a keyword" className="pr-16" />
        </div>
      </div>
      <div className="flex flex-col border p-3 gap-3">
        <div className="gap-10 grid grid-cols-3">
          <div className="flex flex-rows gap-2 items-center">
            <Checkbox id="terms" />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </Label>
          </div>
          <div className="flex justify-center items-center">
            <Label>A total of 200</Label>
          </div>
          <div className="flex flex-rows justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewMode(false);
                    }}
                  >
                    <List />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewMode(true);
                    }}
                  >
                    <LayoutGrid />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Upload />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload video</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="border-t"></div>
        {viewmode ? (
          <div className="grid gap-5 grid-cols-4">
            <Card className="flex flex-col gap-3 col-span-1 px-4 py-4">
              <Checkbox></Checkbox>
              <div className="bg-blue-500 h-60 w-full flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-transparent text-lg p-4"
                      >
                        <Play />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Play Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label className="text-lg">Video Title</Label>
              <Label>Created: 2024/12/18 14:00:00</Label>
              <div className="flex flex-rows justify-end gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Info />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video Information</p>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
            <Card className="flex flex-col gap-3 col-span-1 px-4 py-4">
              <Checkbox></Checkbox>
              <div className="bg-blue-500 h-60 w-full flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-transparent text-lg p-4"
                      >
                        <Play />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Play Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label className="text-lg">Video Title</Label>
              <Label>Created: 2024/12/18 14:00:00</Label>
              <div className="flex flex-rows justify-end gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Info />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video Information</p>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
            <Card className="flex flex-col gap-3 col-span-1 px-4 py-4">
              <Checkbox></Checkbox>
              <div className="bg-blue-500 h-60 w-full flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-transparent text-lg p-4"
                      >
                        <Play />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Play Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label className="text-lg">Video Title</Label>
              <Label>Created: 2024/12/18 14:00:00</Label>
              <div className="flex flex-rows justify-end gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Info />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video Information</p>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
            <Card className="flex flex-col gap-3 col-span-1 px-4 py-4">
              <Checkbox></Checkbox>
              <div className="bg-blue-500 h-60 w-full flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="bg-transparent text-lg p-4"
                      >
                        <Play />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Play Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label className="text-lg">Video Title</Label>
              <Label>Created: 2024/12/18 14:00:00</Label>
              <div className="flex flex-rows justify-end gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Info />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video Information</p>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <Table className="border">
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableCell>
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell>
                    <Label>Thumbnail</Label>
                  </TableCell>
                  <TableCell>
                    <Label>Title</Label>
                  </TableCell>
                  <TableCell>
                    <Label>Created At</Label>
                  </TableCell>
                  <TableCell>
                    <Label>Created By</Label>
                  </TableCell>
                  <TableCell>
                    <Label>Attributes</Label>
                  </TableCell>
                  <TableCell>
                    <Label>Action</Label>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="items-center justify-center">
                  <TableCell>
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell>
                    <div className="bg-blue-500 h-40 w-full flex items-center justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="bg-transparent text-lg p-4"
                            >
                              <Play />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Video</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>Video1</TableCell>
                  <TableCell>2024/12/19 12:00:00</TableCell>
                  <TableCell>superadmin</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p>Format: H264</p>
                      <p>Size: 1GB</p>
                      <p>Duration: 30:00:00</p>
                      <p>Resolution: 1920*1080</p>
                    </div>
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <div className="flex flex-row gap-1 justify-center">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive">
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
                <TableRow className="items-center justify-center">
                  <TableCell>
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell>
                    <div className="bg-blue-500 h-40 w-full flex items-center justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="bg-transparent text-lg p-4"
                            >
                              <Play />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Video</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>Video1</TableCell>
                  <TableCell>2024/12/19 12:00:00</TableCell>
                  <TableCell>superadmin</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p>Format: H264</p>
                      <p>Size: 1GB</p>
                      <p>Duration: 30:00:00</p>
                      <p>Resolution: 1920*1080</p>
                    </div>
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <div className="flex flex-row gap-1 justify-center">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive">
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
                <TableRow className="items-center justify-center">
                  <TableCell>
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell>
                    <div className="bg-blue-500 h-40 w-full flex items-center justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="bg-transparent text-lg p-4"
                            >
                              <Play />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Video</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>Video1</TableCell>
                  <TableCell>2024/12/19 12:00:00</TableCell>
                  <TableCell>superadmin</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p>Format: H264</p>
                      <p>Size: 1GB</p>
                      <p>Duration: 30:00:00</p>
                      <p>Resolution: 1920*1080</p>
                    </div>
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <div className="flex flex-row gap-1 justify-center">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive">
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
                <TableRow className="items-center justify-center">
                  <TableCell>
                    <Checkbox></Checkbox>
                  </TableCell>
                  <TableCell>
                    <div className="bg-blue-500 h-40 w-full flex items-center justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="bg-transparent text-lg p-4"
                            >
                              <Play />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Video</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>Video1</TableCell>
                  <TableCell>2024/12/19 12:00:00</TableCell>
                  <TableCell>superadmin</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p>Format: H264</p>
                      <p>Size: 1GB</p>
                      <p>Duration: 30:00:00</p>
                      <p>Resolution: 1920*1080</p>
                    </div>
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <div className="flex flex-row gap-1 justify-center">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive">
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
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;
