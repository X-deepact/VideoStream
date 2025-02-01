import { useEffect, useState } from "react";
import { getStatisticsSortedByViews } from "@/services/dashboard.service.ts";
import { toast } from "@/hooks/use-toast.ts";

export type TimePeriod = "yesterday" | "7days" | "30days";
const useVideoViewsStatistic = (selectedPeriod: TimePeriod) => {
	const [viewsData, setViewsData] = useState<
		Array<{ time: string; viewers: number; likes: number; createdAt?: string }>
	>([]);
	const [hasYesterdayData, setHasYesterdayData] = useState(false);

	useEffect(() => {
		async function fetchViewsData() {
			try {
				const now = new Date();
				let from: number;
				let to: number = now.getTime();

				if (selectedPeriod === "yesterday") {
					const yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					yesterday.setHours(0, 0, 0, 0);
					from = yesterday.getTime();

					const yesterdayEnd = new Date(yesterday);
					yesterdayEnd.setHours(23, 59, 59, 999);
					to = yesterdayEnd.getTime();
				} else {
					const daysToSubtract = selectedPeriod === "7days" ? 7 : 30;
					from = new Date(
						now.getTime() - (daysToSubtract - 1) * 24 * 60 * 60 * 1000
					).getTime();
					from = new Date(from).setHours(0, 0, 0, 0);
				}

				const response = await getStatisticsSortedByViews(
					1,
					20,
					"started",
					from,
					to
				);
				const streams = response.data?.data?.page || [];

				const timeSlots = new Map<string, { viewers: number; likes: number }>();
				if (selectedPeriod === "yesterday") {
					for (let hour = 0; hour < 24; hour++) {
						const hourStr = hour.toString().padStart(2, "0");
						const key = `${hourStr}:00`;
						timeSlots.set(key, { viewers: 0, likes: 0 });
					}

					const oneDayOldStreams = streams.filter((stream: any) => {
						const streamDate = new Date(stream.created_at);
						const daysDiff = Math.floor(
							(now.getTime() - streamDate.getTime()) / (24 * 60 * 60 * 1000)
						);
						return daysDiff === 1;
					});

					oneDayOldStreams.forEach((stream: any) => {
						const streamDate = new Date(stream.created_at);
						const hour = streamDate.getHours().toString().padStart(2, "0");
						const key = `${hour}:00`;

						timeSlots.set(key, {
							viewers: stream.viewers || 0,
							likes: stream.likes || 0,
						});
					});
				} else {
					const days = selectedPeriod === "7days" ? 7 : 30;
					for (let i = days - 1; i >= 0; i--) {
						const date = new Date(now);
						date.setDate(date.getDate() - i);
						const month = (date.getMonth() + 1).toString().padStart(2, "0");
						const day = date.getDate().toString().padStart(2, "0");
						const key = `${month}/${day}`;
						timeSlots.set(key, { viewers: 0, likes: 0 });
					}

					streams.forEach((stream: any) => {
						const streamDate = new Date(stream.created_at);
						const month = (streamDate.getMonth() + 1)
						.toString()
						.padStart(2, "0");
						const day = streamDate.getDate().toString().padStart(2, "0");
						const key = `${month}/${day}`;

						if (timeSlots.has(key)) {
							const current = timeSlots.get(key)!;
							timeSlots.set(key, {
								viewers: (current.viewers || 0) + (stream.viewers || 0),
								likes: (current.likes || 0) + (stream.likes || 0),
							});
						}
					});
				}

				const sortedData = Array.from(timeSlots.entries())
				.sort((a, b) => {
					if (selectedPeriod === "yesterday") {
						return parseInt(a[0]) - parseInt(b[0]);
					} else {
						const [aMonth, aDay] = a[0].split("/").map(Number);
						const [bMonth, bDay] = b[0].split("/").map(Number);
						if (aMonth === bMonth) {
							return aDay - bDay;
						}
						return aMonth - bMonth;
					}
				})
				.map(([time, data]) => ({
					time,
					viewers: data.viewers,
					likes: data.likes,
				}));

				const hasDataFromYesterday = streams.some((stream: any) => {
					const streamDate = new Date(stream.created_at);
					const daysDiff = Math.floor(
						(now.getTime() - streamDate.getTime()) / (24 * 60 * 60 * 1000)
					);
					return daysDiff === 1;
				});

				setHasYesterdayData(hasDataFromYesterday);
				setViewsData(sortedData);
			} catch (error) {
				toast({
					variant: "destructive",
					description: error.message,
				});
			}
		}

		fetchViewsData();
	}, [selectedPeriod]);

	return { viewsData, hasYesterdayData };
};

export default useVideoViewsStatistic;
