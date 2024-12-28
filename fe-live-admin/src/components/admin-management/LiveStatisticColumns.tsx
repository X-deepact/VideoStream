import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export type LiveStatistic = {
  stream_id: number;
  title?: string;
  current_viewers: number;
  total_viewers: number;
  likes: number;
  comments: number;
};

export const columns: ColumnDef<LiveStatistic>[] = [
  {
    accessorKey: "stream_id",
    header: ({ column, table }: any) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="bg-transparent text-black"
            onClick={() => table.options.meta?.onSortChange(column.id)}
          >
            Stream ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">Stream {row.getValue("stream_id")}</div>;
    },
  },
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
  },
]; 