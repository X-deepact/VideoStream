import {
	getLiveStatisticTableColumns
} from "@/components/statistics-management/LiveStatistic/columns.tsx";
import { useState } from "react";
import useLiveStatistic from "@/hooks/useLiveStatistic.ts";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/validation.ts";
import {
	Breadcrumb,
	BreadcrumbItem, BreadcrumbLink,
	BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import { NavLink } from "react-router-dom";
import { APP_DASHBOARD_PATH } from "@/router";
import { Slash } from "lucide-react";
import { DataTable } from "@/components/common/DataTable.tsx";

const LiveStatistic = () => {
	
	const [keyword, setKeyword] = useState('');
	
	const {
		data,
		totalItems,
		currentPage,
		pageLimit,
		isLoading,
		sortBy,
		sortOrder,
		refetchData,
		setCurrentPage,
		setPageLimit,
		setSortBy,
		setSortOrder,
	} = useLiveStatistic({
		page: DEFAULT_PAGE,
		limit: DEFAULT_PAGE_SIZE,
		keyword,
	});
	
	const columns = () => getLiveStatisticTableColumns({
		sort: {
			sortBy,
			sortOrder,
			setSortBy,
			setSortOrder,
		},
	});
	
	const handlePageLimitChange = (limit: number) => setPageLimit(limit);
	const handlePageChange = (page: number) => setCurrentPage(page);
	
	const handleSearch = (_keyword: string): void => setKeyword(_keyword);
	
	return (
		<div className="px-8 pb-4">
			<div className="py-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink>
								<NavLink to={APP_DASHBOARD_PATH}>Dashboard</NavLink>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<Slash/>
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>Live Statistics</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<DataTable
				data={data}
				totalCount={totalItems}
				isLoading={isLoading}
				onRefresh={refetchData}
				columns={columns()}
				actions={{
					search: {
						placeholder: 'Search...',
						value: keyword,
						onSearch: (_keyword: string): void => handleSearch(_keyword),
					},
				}}
				pagination={{
					rowsPerPage: {
						value: pageLimit,
						onChange: (value: number) => handlePageLimitChange(value),
					},
					pages: {
						totalCount: totalItems,
						currentPage,
						limit: pageLimit,
						handlePageChange,
					},
				}}
			/>
		</div>
	);
};

export default LiveStatistic;
