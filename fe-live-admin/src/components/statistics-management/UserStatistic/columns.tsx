import { ColumnDef } from "@tanstack/react-table";
import { SORT_ORDER } from "@/lib/validation.ts";
import { UserStatisticsResponse } from "@/type/statistic.ts";
import DataTableColumnHeader from "@/components/common/DataTableHeader.tsx";
import { ColumnNames } from "@/components/statistics-management/UserStatistic/columnData.ts";
import { formatKMBCount } from "@/lib/utils.ts";
import { createCenteredColumn } from "@/lib/table-formated";

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
  createCenteredColumn({
    accessorKey: "total_streams",
    columnName: ColumnNames.totalStreams,
    formatValue: formatKMBCount,
    sort: sort
  }),
  createCenteredColumn({
    accessorKey: "total_likes",
    columnName: ColumnNames.totalLikes,
    formatValue: formatKMBCount,
    sort: sort
  }),
  createCenteredColumn({  
    accessorKey: "total_comments",
    columnName: ColumnNames.totalComments,
    formatValue: formatKMBCount,
    sort: sort
  }),
  createCenteredColumn({
    accessorKey: "total_views",
    columnName: ColumnNames.totalViews,
    formatValue: formatKMBCount,
    sort: sort
  }),
    
]
