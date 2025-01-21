import { SORT_ORDER } from "@/lib/validation.ts";
import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/common/DataTableHeader.tsx";
import {
	ColumnNames
} from "@/components/statistics-management/LiveStatistic/columnData.ts";
import { LiveStatisticsResponse } from "@/type/statistic.ts";
import StatusBadge from "@/components/common/StatusBadge.tsx";

interface ColumnsProps {
	sort: {
		setSortBy: (field: string) => void;
		setSortOrder: (order: SORT_ORDER) => void;
		sortBy: string;
		sortOrder: SORT_ORDER;
	}
}

export const getLiveStatisticTableColumns = ({sort}: ColumnsProps): ColumnDef<LiveStatisticsResponse>[] => [
	{
		accessorKey: 'title',
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
		cell: ({row}) => {
			const {title} = row.original;
			return (
				<div>
					<p >{title}</p>
				</div>
			)
		},
	},
	{
		accessorKey: 'status',
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.status.label}
			/>
		),
		cell: ({row}) => {
			const {status} = row.original;
			return (
				<StatusBadge status={status} style="badge"/>
			)
		}
	},
	{
		accessorKey: 'currentViewers',
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.currentViewers.label}
			/>
		),
		cell: ({row}) => {
			const {current_viewers} = row.original;
			return (
				<div>
					<p >{current_viewers}</p>
				</div>
			)
		},
	},
	{
		accessorKey: 'totalViewers',
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.totalViewers.label}
			/>
		),
		cell: ({row}) => {
			const {total_viewers} = row.original;
			return (
				<div>
					<p >{total_viewers}</p>
				</div>
			)
		},
	},
	{
		accessorKey: 'likes',
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.likes.label}
			/>
		),
		cell: ({row}) => {
			const {likes} = row.original;
			return (
				<div>
					<p >{likes}</p>
				</div>
			)
		},
	},
	{
		accessorKey: 'comments',
		header: () => (
			<DataTableColumnHeader
				title={ColumnNames.comments.label}
			/>
		),
		cell: ({row}) => {
			const {comments} = row.original;
			return (
				<div>
					<p >{comments}</p>
				</div>
			)
		},
	},
];