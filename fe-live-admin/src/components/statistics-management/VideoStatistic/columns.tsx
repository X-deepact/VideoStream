import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from '@/components/common/DataTableHeader';
import { SORT_ORDER } from "@/lib/validation";
import { ColumnNames } from "./columnData";
import { formatKMBCount } from "@/lib/utils.ts";
import { formatDate } from "@/lib/date-formated";
import { formatDuration,  formatFileSize} from "@/lib/utils";
export type VideoStatistic = {
  title: string;
  viewers: number;
  likes: number;
  duration: number;
  comments: number;
  video_size: string;
  created_at: string;
};

interface ColumnsProps {
  sort: {
    setSortBy: (field: string) => void;
    setSortOrder: (order: SORT_ORDER) => void;
    sortBy: string;
    sortOrder: SORT_ORDER;
  };
}

export const getVideoStatisticsTableColumns = ({
  sort,
}: ColumnsProps): ColumnDef<VideoStatistic>[] => [
  {
    accessorKey: "title",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.title.label}
        sort={{
          sortKey: ColumnNames.title.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      return <div className="font-bold">{row.original.title}</div>;
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
    cell: ({ row }) => {
      return <div className="font-bold">{formatKMBCount(row.original.viewers)} </div>;
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
    cell: ({ row }) => {
      return <div className="font-bold">{formatKMBCount(row.original.likes)} </div>;
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
    cell: ({ row }) => {
      return <div className="font-bold">{formatKMBCount(row.original.comments)} </div>;
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
    cell: ({ row }) => {
      return <div className="font-bold">{formatDuration(Number(row.original.duration))} </div>;
    },
  },
  {
    accessorKey: "video_size",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.videoSize.label}
        sort={{
          sortKey: ColumnNames.videoSize.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      return <div className="font-bold">{formatFileSize(Number(row.original.video_size))}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.createdAt.label}
        sort={{
          sortKey: ColumnNames.createdAt.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      return <div className="font-bold">{formatDate(row.original.created_at, true)}</div>;
    },
  },    
];