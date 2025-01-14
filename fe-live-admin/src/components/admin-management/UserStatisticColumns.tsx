import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TableMeta {
  onSortChange: (columnId: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type UserStatistic = {
  username: string;
  likes: number;
  comments: number;
  views: number;
  streams: number;
  display_name: string;
};

export const columns: ColumnDef<UserStatistic, any>[] = [
  {
    accessorKey: "display_name",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "display_name";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("display_name")}
        >
          Display Name
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "username";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("username")}
        >
          Username
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "streams",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "total_streams";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("total_streams")}
        >
          Streams
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "likes",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "total_likes";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("total_likes")}
        >
          Likes
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "comments",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "total_comments";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("total_comments")}
        >
          Comments
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "views",
    header: ({ table }) => {
      const meta = table.options.meta as TableMeta;
      const isActive = meta.sortBy === "total_views";
      return (
        <Button
          variant="ghost"
          className="bg-transparent text-black hover:bg-gray-100"
          onClick={() => meta.onSortChange("total_views")}
        >
          Views
          {isActive ? (
            meta.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
];