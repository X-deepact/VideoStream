import DataTableColumnHeader from "@/components/common/DataTableHeader";

import { ColumnNames } from "./columnData";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { formatDate, getTimeAgo } from "@/lib/date-formated";
import ImageWithAuth from "@/components/ui/imagewithauth";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDuration, formatFileSize } from "@/lib/utils";
import { GeneralColumnsProps } from "@/type/columns";
import authHeader from "@/services/auth-header";

interface ColumnsProps extends GeneralColumnsProps {}
export const getVideosTableColumns = ({ sort }: ColumnsProps) => [
  {
    accessorKey: "video",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.video.label}
        sort={{
          sortKey: ColumnNames.video.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { title, description, thumbnail_file_name, schedule_stream } =
        row.original;
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
        } catch (error: any) {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }
      };
      return (
        <div className="flex flex-rows gap-3 text-left w-[30rem]">
          <div className="relative">
            <ImageWithAuth
              url={thumbnail_file_name}
              className="w-[150px] h-[100px] border-t-[8px] border-b-[8px] border-black"
            />
            <Button
              className="bg-transparent absolute inset-0 w-[30px] h-[30px] self-center place-self-center"
              onClick={() => handleplay(schedule_stream.video_url)}
            >
              <Play size={48} color="black" />
            </Button>
          </div>
          <div>
            <Label className="text-lg">{title || "—"}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    style={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      width: 300,
                    }}
                    className="text-xs text-muted-foreground"
                  >
                    {description || "—"}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[700px]">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "started_At",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.started_At.label}
        sort={{
          sortKey: ColumnNames.started_At.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { started_at } = row.original;
      return (
        <div>
          <p className="font-medium">
            {started_at ? formatDate(started_at, true) : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {started_at ? (
              getTimeAgo(started_at)
            ) : (
              <span className="text-gray-900" style={{ fontSize: "15px" }}>
                N/A
              </span>
            )}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "ended_At",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.ended_At.label}
        sort={{
          sortKey: ColumnNames.ended_At.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { ended_at } = row.original;
      return (
        <div className="">
          <p className="font-medium">
            {ended_at ? formatDate(ended_at, true) : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {ended_at ? (
              getTimeAgo(ended_at)
            ) : (
              <span className="text-gray-900" style={{ fontSize: "15px" }}>
                N/A
              </span>
            )}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "creator",
    header: () => <DataTableColumnHeader title={ColumnNames.creator.label} />,
    cell: ({ row }: any) => {
      const { user } = row.original;
      return (
        <div>
          <p className="font-medium">@{user.username}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <DataTableColumnHeader title={ColumnNames.type.label} />,
    cell: ({ row }: any) => {
      const { stream_type } = row.original;
      return (
        <Badge variant="secondary" className="rounded-full">
          {stream_type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <DataTableColumnHeader title={ColumnNames.category.label} />,
    cell: ({ row }: any) => {
      const { categories } = row.original;
      return (
        <div className="flex flex-col gap-1">
          {categories && categories.length > 0 ? (
            categories.map((category: any) => (
              <p>
                <Badge variant="secondary" className="rounded-full">
                  {category.name}
                </Badge>
              </p>
            ))
          ) : (
            <span className="text-gray-900" style={{ fontSize: "15px" }}>
              "-"
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.size.label}
        sort={{
          sortKey: ColumnNames.size.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return (
        <div className="flex flex-row items-center">
          <Label>
            {formatFileSize(live_stream_analytic?.video_size) || (
              <span className="text-gray-900" style={{ fontSize: "15px" }}>
                Na
              </span>
            )}
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.duration.label}
        sort={{
          sortKey: ColumnNames.duration.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return (
        <div className="flex flex-row items-center">
          <Label>
            {formatDuration(live_stream_analytic?.duration) || (
              <span className="text-gray-900" style={{ fontSize: "15px" }}>
                Na
              </span>
            )}
          </Label>
        </div>
      );
    },
  },

  {
    accessorKey: "likes",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.likes.label}
        sort={{
          sortKey: ColumnNames.likes.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return <Label>{live_stream_analytic?.likes}</Label>;
    },
  },
  {
    accessorKey: "viewers",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.viewers.label}
        sort={{
          sortKey: ColumnNames.viewers.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return <Label>{live_stream_analytic?.viewers}</Label>;
    },
  },
  {
    accessorKey: "shares",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.shares.label}
        sort={{
          sortKey: ColumnNames.shares.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return <Label>{live_stream_analytic?.shares}</Label>;
    },
  },
  {
    accessorKey: "comments",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.comments.label}
        sort={{
          sortKey: ColumnNames.comments.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { live_stream_analytic } = row.original;
      return <Label>{live_stream_analytic?.comments}</Label>;
    },
  },
];
