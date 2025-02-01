import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/common/DataTableHeader";
import { SORT_ORDER } from "@/lib/validation";
import { ColumnNames } from "./columnData";
import { formatKMBCount } from "@/lib/utils.ts";
import { formatDate } from "@/lib/date-formated";
import { createCenteredColumn } from "@/lib/table-formated.tsx";
import { formatDuration, formatFileSize } from "@/lib/utils";
import { VideoStatisticsResponse } from "@/type/statistic";

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
}: ColumnsProps): ColumnDef<VideoStatisticsResponse>[] => [
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
      return <div>{row.original.title}</div>;
    },
  },
  createCenteredColumn({
    accessorKey: "viewers",
    columnName: ColumnNames.viewers,
    formatValue: formatKMBCount,
    sort: sort,
  }),
  createCenteredColumn({
    accessorKey: "likes",
    columnName: ColumnNames.likes,
    formatValue: formatKMBCount,
    sort: sort,
  }),
  createCenteredColumn({
    accessorKey: "comments",
    columnName: ColumnNames.comments,
    formatValue: formatKMBCount,
    sort: sort,
  }),
  createCenteredColumn({
    accessorKey: "shares",
    columnName: ColumnNames.shares,
    formatValue: formatKMBCount,
    sort: sort,
  }),
  {
    accessorKey: "duration",
    header: () => (
      <div>
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
      </div>
    ),
    cell: ({ row }) => {
      return <div>{formatDuration(Number(row.original.duration))}</div>;
    },
  },
  {
    accessorKey: "video_size",
    header: () => (
      <div>
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
      </div>
    ),
    cell: ({ row }) => {
      return <div>{formatFileSize(Number(row.original.video_size))}</div>;
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
      return <div>{formatDate(row.original.created_at, true)}</div>;
    },
  },
];
