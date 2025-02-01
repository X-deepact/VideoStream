import { ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import React, {useMemo, useState} from "react";
import useVideoViewsStatistic, { TimePeriod } from "@/hooks/useVideoViewStatistic.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {formatDateToReadable} from "@/lib/date-formated.ts";

const VideoViewChart = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("yesterday");
	const {viewsData} = useVideoViewsStatistic(selectedPeriod);
	const PERIOD_LABELS: Record<TimePeriod, string> = {
		yesterday: "Yesterday",
		"7days": "7 days",
		"30days": "30 days",
	};

	const selectItems = Object.entries(PERIOD_LABELS).map(
		([period, label]) => ({
			label,
			value: period as TimePeriod,
		})
	);
	const getChartConfig = (selectedPeriod: TimePeriod) => {
		return {
			margin: {
				left: 40,
				right: 40,
				top: 20,
				bottom: selectedPeriod === "30days" ? 30 : 20,
			},
			xAxis: {
				angle: selectedPeriod === "30days" ? -45 : 0,
				dy: selectedPeriod === "30days" ? 20 : 8,
				height: selectedPeriod === "30days" ? 30 : 30,
			},
		};
	};

	const chartConfig = {
		views: {
			label: "Total Views",
			color: "hsl(200, 100%, 41%)",
		},
		Like: {
			label: "Likes",
			color: "hsl(171, 100%, 41%)",
		},
	} satisfies ChartConfig;


	const shouldShowChart = useMemo(
		() => viewsData.some((data) => data.viewers > 0 || data.likes > 0),
		[viewsData]
	);

	const CustomTooltip = ({ active, payload, label }) => {
		if (!active || !payload || payload.length === 0) return null;
		return (
			<div className="bg-white p-2 border rounded shadow">
				<p className="font-bold">{formatDateToReadable(label)}</p>
				<p className="text-[hsl(200,100%,41%)]">Total Views: {payload[0].value}</p>
				<p className="text-[hsl(171,100%,41%)]">Total Likes: {payload[1].value}</p>
			</div>
		);
	};

	return (
		<Card className="mt-4 w-full xl:w-2/3">
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 relative">
				<div className="flex flex-1 items-center justify-between gap-1 px-6">
					<CardHeader className="px-0">
						<CardTitle className="text-xl text-left">
							Video Statistic
						</CardTitle>
						<CardDescription className="text-left">
							Overview Description
						</CardDescription>
					</CardHeader>
					<Select
						value={selectedPeriod}
						onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}
					>
						<SelectTrigger className="max-w-[12rem] sm:max-w-[10rem]">
							<SelectValue
								placeholder="Select date range"
							/>
						</SelectTrigger>
						<SelectContent>
							{
								selectItems.map((i) => (
									<SelectItem
										key={i.value}
										value={i.value}
									>
										{i.label}
									</SelectItem>
								))
							}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<div className="flex items-center gap-3 text-xs">
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 bg-[#36A2EB] rounded-sm"></div>
						<span>Total Views</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 bg-[#4BC0C0] rounded-sm"></div>
						<span>Total Likes</span>
					</div>
				</div>

				{shouldShowChart ? (
					<ChartContainer
						config={chartConfig}
						className={`aspect-auto w-full h-[20rem]`}
					>
						<AreaChart
							data={viewsData}
							margin={getChartConfig(selectedPeriod).margin}
						>
							<CartesianGrid
								vertical={false}
								horizontal={true}
								strokeDasharray="3 3"
							/>
							<XAxis
								dataKey="time"
								tickLine={false}
								axisLine={false}
								tickMargin={getChartConfig(selectedPeriod).xAxis.dy}
								angle={getChartConfig(selectedPeriod).xAxis.angle}
								height={getChartConfig(selectedPeriod).xAxis.height}
								interval={selectedPeriod === "yesterday" ? 2 : 1}
							/>
							<YAxis
								axisLine={true}
								tickLine={true}
								tickCount={7}
								domain={[0, "auto"]}
							/>
							<Tooltip content={CustomTooltip} />
							<Area
								type="monotone"
								dataKey="viewers"
								stroke="hsl(200, 100%, 41%)"
								fill="hsl(200, 100%, 41%)"
								fillOpacity={0.5}
							/>
							<Area
								type="monotone"
								dataKey="likes"
								stroke="hsl(171, 100%, 41%)"
								fill="hsl(171, 100%, 41%)"
								fillOpacity={0.5}
							/>
						</AreaChart>
					</ChartContainer>
				) : (
					<div className="h-[250px] flex items-center justify-center text-muted-foreground">
						{`No data available for ${PERIOD_LABELS[selectedPeriod]}`}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default VideoViewChart;
