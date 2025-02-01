import { useEffect, useState } from "react";
import { getOverviewStatistics } from "@/services/dashboard.service.ts";
import { toast } from "@/hooks/use-toast.ts";

const useLivestreamCount = () => {
	const [chartData, setChartData] = useState([
		{ status: "offline", quantities: 0, fill: "#808080" },
		{ status: "online", quantities: 0, fill: "#56F000" },
	]);
	const [totalLivestreams, setTotalLiveStreams] = useState(0);
	const { refetch, setRefetch } = useState(1);

	const refetchCount = () => setRefetch((prev) => prev + 1);

	useEffect(() => {
		async function fetchOverviewData() {
			try {
				const response = await getOverviewStatistics();
				const { active_live_streams, total_live_streams } = response.data.data;
				const offline_live_streams = total_live_streams - active_live_streams;

				setTotalLiveStreams(total_live_streams);
				setChartData([
					{
						status: "offline",
						quantities: offline_live_streams,
						fill: "#808080",
					},
					{
						status: "online",
						quantities: active_live_streams,
						fill: "#56F000",
					},
				]);
			} catch (e) {
				toast({
					variant: "destructive",
					description: "Failed to fetch overview statistics",
				});
			}
		}

		fetchOverviewData();
	}, [refetch]);
	return { chartData, totalLivestreams, refetchCount };
};

export default useLivestreamCount;
