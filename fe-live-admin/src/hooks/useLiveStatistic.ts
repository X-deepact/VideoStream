import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	SORT_ORDER
} from "@/lib/validation.ts";
import { useEffect, useState } from "react";
import { getStatistics } from "@/services/liveStatistic.service.ts";
import { LiveStatisticsResponse } from "@/type/statistic.ts";

interface Props {
	page: number;
	limit: number;
	sortBy?: string | undefined;
	sort?: SORT_ORDER;
	keyword?: string;
}

const useLiveStatistic = (payload: Props) => {
	const {keyword = undefined} = payload;
	
	const [data, setData] = useState<LiveStatisticsResponse[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refetchKey, setRefetchKey] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [totalItems, setTotalItems] = useState(0);
	const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
	const [pageLimit, setPageLimit] = useState(DEFAULT_PAGE_SIZE);
	const [sortBy, setSortBy] = useState('title');
	const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);
	
	const refetchData = () => setRefetchKey((prevKey) => prevKey + 1);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);
				
				const params: Record<string, unknown> = {
					page: currentPage,
					limit: pageLimit,
					keyword: keyword || undefined,
					sortBy: sortBy || undefined,
					sort: sortOrder || undefined,
				};
				
				const response = await getStatistics(params);
				
				if (!response) throw new Error('Failed to get statistics!');
				
				const {page: _page, total_items, current_page} = response.data.data;
				setData(() => [...(_page || [])]);
				setTotalItems(total_items || 0);
				setCurrentPage(current_page ?? 1);
			} catch (error) {
				setError(
					error instanceof Error ? error.message : 'An unknown error occurred.'
				);
			} finally {
				setIsLoading(false);
			}
		}
		
		fetchData();
	}, [refetchKey, currentPage, pageLimit, sortBy, sortOrder, keyword]);
	
	return {
		data,
		isLoading,
		totalItems,
		currentPage,
		pageLimit,
		error,
		sortBy,
		sortOrder,
		refetchData,
		setCurrentPage,
		setPageLimit,
		setSortBy,
		setSortOrder,
	};
};

export default useLiveStatistic;
