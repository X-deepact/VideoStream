import { type ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "../components/common/DataTableHeader";
import { formatKMBCount } from "./utils";
import { SORT_ORDER } from "./validation";

interface ColumnName {
  label: string;
  sortKey?: string;
}

interface SortProps {
  sortBy: string;
  sortOrder: SORT_ORDER;
  setSortBy: (value: string) => void;
  setSortOrder: (value: SORT_ORDER) => void;
}

interface CreateCenteredColumnProps<T> {
  accessorKey: keyof T;
  columnName: ColumnName;
  sort: SortProps;
  formatValue?: (value: number) => string | React.ReactNode;
  className?: string;
}

export function createCenteredColumn<T>({
  accessorKey,
  columnName,
  sort,
  formatValue = formatKMBCount,
  className = "text-center",
}: CreateCenteredColumnProps<T>): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: () => (
      <div className={"flex justify-center"}>
        <DataTableColumnHeader
          title={columnName.label}
          sort={
            columnName.sortKey
              ? {
                  sortKey: columnName.sortKey,
                  sortBy: sort.sortBy,
                  sortOrder: sort.sortOrder,
                  setSortBy: sort.setSortBy,
                  setSortOrder: sort.setSortOrder,
                }
              : undefined
          }
        />
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      const value = row.original[accessorKey as keyof typeof row.original];
      return <div className={className}>{formatValue(Number(value))}</div>;
    },
  };
}
