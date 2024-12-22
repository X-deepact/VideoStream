import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDown } from "lucide-react";
import { LivestreamStatistics } from "@/lib/interface.tsx";

export const columns: ColumnDef<LivestreamStatistics>[] = [
	{
		accessorKey: "title",
		header: ({column, table}: any) => {
			return (
				<div className="flex justify-center">
					<Button
						className="bg-transparent text-black"
						variant="ghost"
						onClick={() => table.options.meta?.onSortChange(column.id)}
					>
						Livestream Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)
		}
	},
	{
		accessorKey: "videoSize",
		header: ({column, table}: any) => {
			return (
				<div className="flex justify-center">
					<Button
						className="bg-transparent text-black"
						variant="ghost"
						onClick={() => table.options.meta?.onSortChange(column.id)}
					>
						Stream Video Size
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)
		}
	},
	{
		accessorKey: "views",
		header: ({column, table}: any) => {
			return (
				<div className="flex justify-center">
					<Button
						className="bg-transparent text-black"
						variant="ghost"
						onClick={() => table.options.meta?.onSortChange(column.id)}
					>
						Views
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>

			)
		}
	},
	{
		accessorKey: "duration",
		header: ({column, table}: any) => {
			return (
				<div className="flex justify-center">
					<Button
						className="bg-transparent text-black"
						variant="ghost"
						onClick={() => table.options.meta?.onSortChange(column.id)}
					>
						Duration
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)
		}
	},
];
