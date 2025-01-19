import { ColumnDef } from "@tanstack/react-table";
import { SORT_ORDER } from "@/lib/validation.ts";
import { UserStatisticsResponse } from "@/type/statistic.ts";
import DataTableColumnHeader from "@/components/common/DataTableHeader.tsx";
import { ColumnNames } from "@/components/statistics-management/UserStatistic/columnData.ts";
import { formatKMBCount } from "@/lib/utils.ts";

interface ColumnProps {
  sort: {
    setSortBy: (field: string) => void;
    setSortOrder: (order: SORT_ORDER) => void;
    sortBy: string;
    sortOrder: SORT_ORDER;
  }
}

export const getUserStatisticsTableColumns = ({sort}: ColumnProps): ColumnDef<UserStatisticsResponse>[] => [
  {
    accessorKey: "displayName",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.displayName.label}
        sort={{
          sortKey: ColumnNames.displayName.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {display_name} = row.original;
      return (
        <div>
          <p >{display_name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "userName",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.userName.label}
        sort={{
          sortKey: ColumnNames.userName.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {username} = row.original;
      return (
        <div>
          <p >{username}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "totalStreams",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.totalStreams.label}
        sort={{
          sortKey: ColumnNames.totalStreams.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {total_streams} = row.original;
      return (
        <div>
          <p >{formatKMBCount(total_streams || 0)}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "totalLikes",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.totalLikes.label}
        sort={{
          sortKey: ColumnNames.totalLikes.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {total_likes} = row.original;
      return (
        <div>
          <p >{formatKMBCount(total_likes || 0)}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "totalComments",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.totalComments.label}
        sort={{
          sortKey: ColumnNames.totalComments.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {total_comments} = row.original;
      return (
        <div>
          <p>{formatKMBCount(total_comments || 0)}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "totalViews",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.totalViews.label}
        sort={{
          sortKey: ColumnNames.totalViews.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({row}) => {
      const {total_views} = row.original;
      return (
        <div>
          <p>{formatKMBCount(total_views || 0)}</p>
        </div>
      )
    },
  },
]
