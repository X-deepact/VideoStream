import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx";
import { Label, Pie, PieChart } from "recharts";
import useLivestreamCount from "@/hooks/useLivestreamCount.ts";

const OverviewChart = () => {
	const chartConfig = {
		visitors: {
			label: "Livestreams",
		},
		online: {
			label: "Online",
			color: "#56F000",
		},
		offline: {
			label: "Offline",
			color: "#808080",
		},
	} satisfies ChartConfig;
	const { chartData, totalLivestreams } = useLivestreamCount();
	return (
		<>
			<Card className="mt-4 w-full xl:w-1/3">
				<CardHeader className="border-b">
					<CardTitle className="text-xl text-left">
						Current Live Streams
					</CardTitle>
					<CardDescription className="text-left">
						Showing total livestreams for current timestamp
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer
					 config={chartConfig}
					 className="mx-auto aspect-square max-h-[25rem]"
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie
								data={chartData}
								dataKey="quantities"
								nameKey="status"
								innerRadius={60}
								strokeWidth={5}
							>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-3xl font-bold"
													>
														{totalLivestreams.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-muted-foreground"
													>
														Livestreams
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	);
};

export default OverviewChart;
