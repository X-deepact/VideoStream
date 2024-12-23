import { ColumnDef } from "@tanstack/react-table";

export type VideoStatistic = {
  title: string;
  viewers: number;
  likes: number;
  duration: number;
  comments: number;
  video_size: number;
  created_at: string;
};

export const columns: ColumnDef<VideoStatistic>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Title</div>,
  },
  {
    accessorKey: "viewers",
    header: () => <div className="text-center">Viewers</div>,
  },
  {
    accessorKey: "likes",
    header: () => <div className="text-center">Likes</div>,
  },
  {
      accessorKey: "comments",
      header: () => <div className="text-center">Comments</div>,
    },
    {
      accessorKey: "duration",
      header: () => <div className="text-center">Duration</div>,
    },
  {
    accessorKey: "video_size",
    header: () => <div className="text-center">Video Size</div>,
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-center">Created At</div>,
  }
];