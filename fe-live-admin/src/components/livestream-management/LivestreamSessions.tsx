import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Slash, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useState } from "react";
import LivestreamList from "@/components/livestream-management/LivestreamList.tsx";
import LivestreamCreateNew from "@/components/livestream-management/LivestreamCreateNew.tsx";
import { LivestreamSession } from "@/lib/interface.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useCategories } from "@/hooks/useCategories.ts";
import { useFetchAccount } from "@/hooks/useFetchAccount.ts";
import { useStreamingSessions } from "@/hooks/useStreamingSessions.ts";
import { useNavigate } from "react-router-dom";
import { APP_LIVE_SESSION_PATH, APP_UPCOMING_SESSION_PATH } from "@/router";

interface SessionBaseProps {
  defaultStatus: string[];
  pageTitle: string;
}

const LivestreamSessions = ({ defaultStatus, pageTitle }: SessionBaseProps) => {
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const navigate = useNavigate();

  //Filters
  const [streamType, setStreamType] = useState("");
  const [status] = useState<string[]>(defaultStatus || []);
  const { categories } = useCategories({});
  const { accounts } = useFetchAccount("streamer");
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  //Search
  const [title, setTitle] = useState("");

  const {
    sessions,
    quantities,
    totalItems,
    totalPages,
    refetchSessionList,
    setSessions,
  } = useStreamingSessions({
    currentPage,
    streamType,
    status,
    title,
  });

  const handleSearchStream = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1); // Reset to first page every time you do a new search
    }
  };

  const handleEndLiveSuccess = (sessionId: string) =>
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

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
              <BreadcrumbPage>{pageTitle || "Session Base"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/*Filter Dialog, Create new Stream Dialog and Search Bar*/}
      <div className="mt-5 flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          {/*New Stream Dialog*/}
          <LivestreamCreateNew
            categories={categories}
            users={accounts}
            onReset={refetchSessionList}
            isDisabled={defaultStatus[0] === "started"}
          />

          <Input
            className="w-[40rem]"
            placeholder="Search Livestream"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            onKeyDown={handleSearchStream}
          />
        </div>

        {/*Filter Stream Dialog*/}
        <div>
          <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="category" className="text-left">
                    Category
                  </Label>
                  <Select
                    value={streamType}
                    onValueChange={(value) => {
                      setStreamType(value);
                      setCurrentPage(1);
                      setOpenFilterDialog(false);
                    }}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((category) => {
                          return (
                            <SelectItem
                              key={category.label}
                              value={category.label}
                            >
                              {category.label}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {sessions.length > 0 ? (
        <>
          {/* Pagination controls + navigation */}
          <div className="mt-10 mb-4 w-full m-auto items-center flex justify-between">
            <div className="flex flex-row">
              <Label htmlFor="page-input" className="mr-2 text-lg font-bold">
                Page
              </Label>
              <Input
                className="text-center w-auto bg-white text-black"
                id="page-input"
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.max(
                    1,
                    Math.min(totalPages, Number(e.target.value))
                  );
                  setCurrentPage(page);
                }}
              />
              <span className="ml-2 text-lg font-bold">
                of {totalPages} on showing {quantities} of total {totalItems}{" "}
                livestreams.
              </span>
            </div>

            <div className="space-x-2">
              <Button
                size="lg"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </Button>
            </div>
          </div>

          {/* Livestream session list */}
          <ScrollArea className="w-auto">
            {status[0] === "started" ? (
              <div className="text-sm font-medium">
                Here are all the sessions you’re streaming right now.
                <span
                  className="underline-offset-4 hover:underline ml-1 cursor-pointer"
                  onClick={() => navigate(`${APP_UPCOMING_SESSION_PATH}`)}
                >
                  Want to start another one?
                </span>
              </div>
            ) : (
              <div className="text-sm font-medium">
                Your upcoming or newly created sessions will appear here.
                <span
                  className="underline-offset-4 hover:underline ml-1 cursor-pointer"
                  onClick={() => navigate(`${APP_LIVE_SESSION_PATH}`)}
                >
                  Check out what's live?
                </span>
              </div>
            )}

            {sessions.map((session: LivestreamSession) => (
              <div key={session.id} className="pr-5">
                <LivestreamList
                  livestream={session}
                  onSuccessEndLive={handleEndLiveSuccess}
                />
              </div>
            ))}

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </>
      ) : (
        <div className="text-xl font-medium mt-[10rem]">No Result</div>
      )}
    </div>
  );
};

export default LivestreamSessions;
