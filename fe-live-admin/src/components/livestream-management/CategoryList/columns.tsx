import DataTableColumnHeader from "@/components/common/DataTableHeader";
import { formatDate, getTimeAgo } from "@/lib/date-formated";
import { ColumnNames } from "./columnData";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getRandomColor } from "@/lib/utils";
import { SORT_ORDER } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface columnsProps {
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  sort: {
    setSortBy: (field: string) => void;
    setSortOrder: (order: SORT_ORDER) => void;
    sortBy: string;
    sortOrder: SORT_ORDER;
  };
}
export const getCategoriesListTableColumns = ({
  onUpdate,
  onDelete,
  sort,
}: columnsProps) => [
  {
    accessorKey: "name",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.name.label}
        sort={{
          sortKey: ColumnNames.name.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { label } = row.original;
      return (
        <Badge
          className="rounded-full"
          style={{
            backgroundColor: getRandomColor(label),
          }}
        >
          <Label className="text-base">{label}</Label>
        </Badge>
      );
    },
  },
  {
    accessorKey: "creator",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.creator.label}
        sort={{
          sortKey: ColumnNames.creator.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { creator } = row.original;
      return (
        <div>
          <p className="font-medium">@{creator.username}</p>
          <p className="text-xs text-gray-500">{creator.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.created_At.label}
        sort={{
          sortKey: ColumnNames.created_At.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { created_at } = row.original;
      return (
        <div className="">
          <p className="font-medium">{formatDate(created_at, true)}</p>
          <p className="text-xs text-muted-foreground">
            {getTimeAgo(created_at)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "updater",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.updater.label}
        sort={{
          sortKey: ColumnNames.updater.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { updater } = row.original;
      return (
        <div>
          <p className="font-medium">@{updater.username}</p>
          <p className="text-xs text-gray-500">{updater.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.updated_At.label}
        sort={{
          sortKey: ColumnNames.updated_At.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }: any) => {
      const { updated_at } = row.original;
      return (
        <div className="">
          <p className="font-medium">{formatDate(updated_at, true)}</p>
          <p className="text-xs text-muted-foreground">
            {getTimeAgo(updated_at)}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      const data = row.original;
      return (
        <div className="flex gap-2">
          <Button
            title="Edit Category"
            size="icon"
            variant="outline"
            onClick={() => onUpdate(data.value, data.label)}
          >
            <Edit />
          </Button>
          <Button
            title="Delete Category"
            size="icon"
            variant="destructive"
            onClick={() => onDelete(data.value)}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
