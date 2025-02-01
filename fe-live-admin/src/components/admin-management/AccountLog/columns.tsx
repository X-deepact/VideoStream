import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/common/DataTableHeader.tsx";
import {
	ColumnNames
} from "@/components/admin-management/AccountLog/columnData.ts";
import { formatDate, getTimeAgo } from "@/lib/date-formated.ts";
import { GeneralColumnsProps } from "@/type/columns.ts";
import { ActivityLogResponse } from "@/type/users.ts";

interface ColumnsProps extends GeneralColumnsProps {

}

export const getAccountLogTableColumns = ({sort}: ColumnsProps): ColumnDef<ActivityLogResponse>[] => [
	{
		accessorKey: "user",
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.user.label}
				sort={{
					sortKey: ColumnNames.user.sortKey,
					sortBy: sort.sortBy,
					sortOrder: sort.sortOrder,
					setSortBy: sort.setSortBy,
					setSortOrder: sort.setSortOrder,
				}}
			/>
		),
		cell: ({row}) => {
			const {user} = row.original;
			return (
				<div>
					<p className="font-medium">@{user.username}</p>
					<p className="text-muted-foreground text-xs">
						{user.email}
					</p>
				</div>
			)
		}
	},
	{
		accessorKey: "action",
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.action.label}
				sort={{
					sortKey: ColumnNames.action.sortKey,
					sortBy: sort.sortBy,
					sortOrder: sort.sortOrder,
					setSortBy: sort.setSortBy,
					setSortOrder: sort.setSortOrder,
				}}
			/>
		),
		cell: ({row}) => {
			const {action} = row.original;
			return (
				<p className="font-medium">{action}</p>
			)
		}
	},
	{
		accessorKey: "details",
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.details.label}
				sort={{
					sortKey: ColumnNames.details.sortKey,
					sortBy: sort.sortBy,
					sortOrder: sort.sortOrder,
					setSortBy: sort.setSortBy,
					setSortOrder: sort.setSortOrder,
				}}
			/>
		),
		cell: ({row}) => {
			const {details} = row.original;
			return (
				<p className="font-medium">{details}</p>
			)
		}
	},
	{
		accessorKey: "date",
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.date.label}
				sort={{
					sortKey: ColumnNames.date.sortKey,
					sortBy: sort.sortBy,
					sortOrder: sort.sortOrder,
					setSortBy: sort.setSortBy,
					setSortOrder: sort.setSortOrder,
				}}
			/>
		),
		cell: ({row}) => {
			const {performed_at} = row.original;
			return (
				<div>
					<p className="font-medium">{formatDate(performed_at, true)}</p>
					<p className="text-xs text-muted-foreground">
						{getTimeAgo(performed_at)}
					</p>
				</div>
			)
		}
	},
];
