import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export type LiveStatistic = {
  stream_id: number;
  title?: string;
  description?: string;
  current_viewers: number;
  total_viewers: number;
  likes: number;
  comments: number;
};

export const columns: ColumnDef<LiveStatistic>[] = [
  {
    accessorKey: "title",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className="cursor-pointer hover:text-blue-600"
            data-state="closed"
            onMouseEnter={(e) => e.currentTarget.click()}
            onMouseLeave={(e) => e.currentTarget.click()}
          >
            {row.getValue("title")}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              {row.original.description || 'No description available'}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    accessorKey: "current_viewers",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Current Viewers
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("current_viewers")}</div>,
  },
  {
    accessorKey: "total_viewers",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Total Viewers
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("total_viewers")}</div>,
  },
  {
    accessorKey: "likes",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Likes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("likes")}</div>,
  },
  {
    accessorKey: "comments",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Comments
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button> 
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("comments")}</div>,
  },
]; 