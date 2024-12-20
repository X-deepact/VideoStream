import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { Label, Pie, PieChart } from "recharts";
import { getOverviewStatistics, getStatisticsSortedByViews } from "@/services/dashboard.service";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const useLiveStreamChartData = () => {
  const [chartData, setChartData] = useState([
    { status: "offline", quantities: 0, fill: "#808080" },
    { status: "online", quantities: 0, fill: "#56F000" },
  ]);
  const [totalLivestreams, setTotalLiveStreams] = useState(0);
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
        console.log(e);
      }
    }

    fetchOverviewData();
  }, []);
  return { chartData, totalLivestreams };
};

type TimePeriod = "yesterday" | "7days" | "30days";

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

const useViewsData = (selectedPeriod: TimePeriod) => {
  const [viewsData, setViewsData] = useState<Array<{ time: string, viewers: number, likes: number }>>([]);

  useEffect(() => {
    async function fetchViewsData() {
      try {
        const limit = selectedPeriod === "yesterday" ? 24 : 
                     selectedPeriod === "7days" ? 7 : 30;
        
        const response = await getStatisticsSortedByViews(1, limit);
        
        if (!response?.data?.data?.page) {
          console.error("Invalid API response:", response);
          return;
        }

        // Initialize time slots based on selected period
        const timeSlots = new Map();
        if (selectedPeriod === "yesterday") {
          // Get yesterday's start and end timestamps
          const now = new Date();
          const yesterdayEnd = new Date(now.setHours(0, 0, 0, 0));
          const yesterdayStart = new Date(yesterdayEnd);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);

          // Initialize hourly slots for yesterday
          for (let i = 0; i < 24; i++) {
            timeSlots.set(`${i}-${i + 1}`, { viewers: 0, likes: 0 });
          }

          // Filter and process only yesterday's data
          response.data.data.page
            .filter((item: any) => {
              const itemDate = new Date(item.created_at);
              return itemDate >= yesterdayStart && itemDate < yesterdayEnd;
            })
            .forEach((item: any) => {
              const itemDate = new Date(item.created_at);
              const hour = itemDate.getHours();
              const timeKey = `${hour}-${hour + 1}`;

              if (timeSlots.has(timeKey)) {
                const current = timeSlots.get(timeKey);
                timeSlots.set(timeKey, {
                  viewers: current.viewers + (item.viewers || 0),
                  likes: current.likes + (item.likes || 0)  
                });
              }
            });
        } else {
          // Handle 7days and 30days periods
          const today = new Date();
          
          // Only shift the date for 30-day view
          if (selectedPeriod === "30days") {
            today.setDate(today.getDate() + 10);
          }
          
          const daysArray = Array.from({ length: limit }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return `Day ${limit - i}`; // This will create "Day 7" or "Day 30" to "Day 1"
          });

          // Initialize time slots with reversed day numbers
          daysArray.forEach(day => {
            timeSlots.set(day, { viewers: 0, likes: 0 });
          });

          response.data.data.page.forEach((item: any) => {
            const itemDate = new Date(item.created_at);
            const daysDiff = limit - Math.ceil((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
            const timeKey = `Day ${daysDiff}`;
            
            if (timeSlots.has(timeKey)) {
              const current = timeSlots.get(timeKey);
              timeSlots.set(timeKey, {
                viewers: current.viewers + (item.viewers || 0),
                likes: current.likes + (item.likes || 0)
              });
            }
          });
        }

        // Convert map to array and sort
        const sortedData = Array.from(timeSlots.entries())
          .map(([time, data]) => ({
            time,
            viewers: data.viewers,
            likes: data.likes
          }))
          .sort((a, b) => {
            if (selectedPeriod === "yesterday") {
              return parseInt(a.time.split('-')[0]) - parseInt(b.time.split('-')[0]);
            }
            // Sort by day number in ascending order
            return parseInt(a.time.split(' ')[1]) - parseInt(b.time.split(' ')[1]);
          });

        setViewsData(sortedData);
      } catch (error) {
        console.error('Error fetching views data:', error);
        setViewsData([]);
      }
    }

    fetchViewsData();
  }, [selectedPeriod]);

  return viewsData;
};

const DashboardInfo: React.FC = () => {
  const { chartData, totalLivestreams } = useLiveStreamChartData();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("yesterday");
  const viewsChartData = useViewsData(selectedPeriod);

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

  return (
    <div className="px-8 flex flex-col xl:flex-row gap-2">
      {/* Overview Statistic */}
      <Card className="mt-4 w-full xl:w-1/3 h-full">
        <CardHeader>
          <CardTitle className="text-xl text-left">
            Overview Statistic
          </CardTitle>
          <CardDescription className="text-left">
            Overview Description
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

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing total livestreams for current timestamp
          </div>
        </CardFooter>
      </Card>

      {/* Video Statistic */}
      <Card className="mt-4 w-full xl:w-2/3 h-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 relative">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6">
            <CardHeader>
              <CardTitle className="text-xl text-left">
                Video Statistic
              </CardTitle>
              <CardDescription className="text-left">
                Overview Description
              </CardDescription>
            </CardHeader>
            <div className="flex gap-4 py-4">
              <button
                className={`px-4 py-1 rounded ${
                  selectedPeriod === "yesterday"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedPeriod("yesterday")}
              >
                Yesterday
              </button>
              <button
                className={`px-4 py-1 rounded ${
                  selectedPeriod === "7days"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedPeriod("7days")}
              >
                7 Days
              </button>
              <button
                className={`px-4 py-1 rounded ${
                  selectedPeriod === "30days"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedPeriod("30days")}
              >
                30 Days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="flex items-center gap-3 text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#36A2EB] rounded-sm"></div>
              <span>Total Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#4BC0C0] rounded-sm"></div>
              <span>Likes</span>
            </div>
          </div>

          <ChartContainer
            config={chartConfig}
            className={`aspect-auto w-full ${
              selectedPeriod === "30days" ? "h-[250px]" : "h-[250px]"
            }`}
          >
            <AreaChart
              data={viewsChartData}
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
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p>{label}</p>
                        <p className="text-[hsl(200,100%,41%)]">
                          Total Views: {payload[0].value}
                        </p>
                        <p className="text-[hsl(171,100%,41%)]">
                          Like: {payload[1].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="viewers"
                stackId="1"
                stroke="hsl(171, 100%, 41%)"
                fill="hsl(171, 100%, 41%)"
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="likes"
                stackId="1"
                stroke="hsl(200, 100%, 41%)"
                fill="hsl(200, 100%, 41%)"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInfo;