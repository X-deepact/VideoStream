import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserStatistic {
  display_name: string;
  username: string;
  streams: number;
  likes: number;
  comments: number;
  views: number;
}

export const columns = (
  onSort: (columnId: string) => void
): ColumnDef<UserStatistic>[] => [
  {
    accessorKey: "display_name",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("display_name")}
          className="w-full justify-center"
        >
          Display Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("display_name")}</div>;
    },
  },
  {
    accessorKey: "username",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("username")}
          className="w-full justify-center"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("username")}</div>;
    },
  },
  {
    accessorKey: "streams",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("streams")}
          className="w-full justify-center"
        >
          Streams
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("streams")}</div>;
    },
  },
  {
    accessorKey: "likes",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("likes")}
          className="w-full justify-center"
        >
          Likes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("likes")}</div>;
    },
  },
  {
    accessorKey: "comments",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("comments")}
          className="w-full justify-center"
        >
          Comments
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("comments")}</div>;
    },
  },
  {
    accessorKey: "views",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("views")}
          className="w-full justify-center"
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("views")}</div>;
    },
  },
];
