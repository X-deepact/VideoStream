import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import useStatisticPerDay from "@/hooks/useStatisticPerDay.ts";
import {TrendingDown, TrendingUp} from "lucide-react";
import { format, subDays } from "date-fns";
import { DateTimePicker } from "@/components/ui/datetime-picker.tsx";
import {formatDateToHourlyRange, formatDateToReadable} from "@/lib/date-formated.ts";

const ViewPerDayChart = () => {
	const {
		data,
		totalView,
		targetedDate,
		trendIndicator,
		setTargetedDate
	} = useStatisticPerDay();
	const date = format(targetedDate, "yyyy-MM-dd");
	const chartConfig = {
		time: {
			label: "Time",
			color: "hsl(217.2 91.2% 59.8%)"
		},
		views: {
			label: "Views",
			color: "hsl(217.2 91.2% 59.8%)"
		},
	} satisfies ChartConfig;

	const disableFutureDates = (date: Date) => {
		const yesterday = new Date();
		yesterday.setHours(0, 0, 0, 0);
		return date > subDays(yesterday, 1);
	};

	return (
		<Card className="mb-4 w-full">
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 items-center justify-between gap-1 px-6 py-5 sm:py-6">
					<div className="flex flex-col">
						<CardTitle className="text-xl text-left">
							Hourly Views
						</CardTitle>
						<CardDescription className="text-left">
							{`Displaying the number of viewers for each hour on ${formatDateToReadable(date)}.`}
						</CardDescription>
					</div>
					<DateTimePicker
						width="w-1/4"
						placeholder="Pick a date"
						value={targetedDate}
						onDateChange={setTargetedDate}
						disableHourAndMinuteSelection={true}
						disableDate={disableFutureDates}
					/>
				</div>
				<div className="flex">
					<div
						className="relative z-30 flex flex-1 flex-col justify-center gap-1
						border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
					>
            <span className="text-xs font-black text-muted-foreground">
	            Total views
            </span>
						<span className="text-lg font-bold leading-none sm:text-3xl">
              {totalView.number}
            </span>
					</div>
					<div
						className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left
							even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6
						"
					>
            <span className="text-xs font-black text-muted-foreground">
	            Trending
            </span>
						<div className="flex flex-row text-lg font-bold leading-none sm:text-3xl">
							{trendIndicator.percent}%
							{trendIndicator.percent !== 0 && (
								trendIndicator.percent > 0 ? (
									<TrendingUp className="h-4 w-4 text-green-500" />
								) : (
									<TrendingDown className="h-4 w-4 text-red-500" />
								)
							)}
            </div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[20rem] mt-[2rem] w-full"
				>
					<BarChart
						accessibilityLayer
						data={data}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="time"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value: string) => {
								return value.replace(date, "");
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									nameKey="views"
									labelFormatter={(value) => {
										return formatDateToHourlyRange(value);
									}}
								/>
							}
						/>
						<Bar dataKey="views" fill="var(--chart-1)" radius={8}>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default ViewPerDayChart;
