import { useEffect, useState, useMemo } from "react";
import { getStatisticsPerPage } from "@/services/dashboard.service.ts";
import { getYesterday } from "@/lib/date-formated.ts";
import { compareAsc, parse } from "date-fns";
import { toast } from "@/hooks/use-toast.ts";
import {HoursViewStatisticResponse} from "@/type/statistic.ts";

export interface StatisticsPerDay {
	time: string;
	views: number;
}

const useStatisticPerDay = () => {
	const [data, setData] = useState<StatisticsPerDay[]>([]);
	const [targetedDate, setTargetedDate] = useState<Date>(getYesterday(new Date()) as Date);
	const [theDayBeforeTotalViews, setTheDayBeforeTotalViews] = useState(0);
	const { refetchKey, setRefetch } = useState(1);

	const refetchCount = () => setRefetch((prev) => prev + 1);

	const totalView = useMemo(
		() => ({
			number: data.reduce((acc, curr) => acc + curr.views, 0),
		}),
		[data]
	);

	const trendIndicator = useMemo(
		() => ({
			percent: theDayBeforeTotalViews === 0
				? 0
				: parseFloat(
					(((totalView.number - theDayBeforeTotalViews) / Math.abs(theDayBeforeTotalViews)) * 100).toFixed(2)
				)
		}),
		[totalView.number, theDayBeforeTotalViews]
	);



	useEffect(() => {
		async function fetchStatisticPerDay() {
			try {
				const response = await getStatisticsPerPage(targetedDate);
				const { data } = response.data;
				setTheDayBeforeTotalViews(data.the_day_before_total_views);

				const sortedData = data?.elements.map(item => ({
					...item,
					parsedTime: parse(item.time, 'yyyy-MM-dd HH:mm', new Date())
				})).sort((a, b) => compareAsc(a.parsedTime, b.parsedTime));
				setData(sortedData);
			} catch (err) {
				toast({
					description: err.message,
					variant: "destructive"
				})
			}
		};

		fetchStatisticPerDay();
	}, [refetchKey, targetedDate]);

	return { data, totalView, targetedDate, trendIndicator, setTargetedDate, refetchCount };
}

export default useStatisticPerDay;
