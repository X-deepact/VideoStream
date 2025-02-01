import { SORT_ORDER } from "@/lib/validation.ts";
import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/common/DataTableHeader.tsx";
import {
	ColumnNames
} from "@/components/statistics-management/LiveStatistic/columnData.ts";
import { LiveStatisticsResponse } from "@/type/statistic.ts";
import StatusBadge from "@/components/common/StatusBadge.tsx";
import { createCenteredColumn } from "@/lib/table-formated";
import { formatKMBCount } from "@/lib/utils";

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
	createCenteredColumn({
		accessorKey: "current_viewers",
		columnName: ColumnNames.currentViewers,
		formatValue: formatKMBCount,
		sort: sort
	}),
	createCenteredColumn({
		accessorKey: 'total_viewers',
		columnName: ColumnNames.totalViewers,
		formatValue: formatKMBCount,
		sort: sort
	}),

	createCenteredColumn({
		accessorKey: 'likes',
		columnName: ColumnNames.likes,
		formatValue: formatKMBCount,
		sort: sort
	}),
	createCenteredColumn({
		accessorKey: 'comments',
		columnName: ColumnNames.comments,
		formatValue: formatKMBCount,
		sort: sort
	}),
];