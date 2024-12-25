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
        const now = new Date();
        let from: number;
        let to: number;

        if (selectedPeriod === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0); 
          from = yesterday.getTime();

          const yesterdayEnd = new Date(yesterday);
          yesterdayEnd.setHours(23, 59, 59, 999);
          to = yesterdayEnd.getTime();

          console.log('Date range:', {
            from: new Date(from).toISOString(),
            to: new Date(to).toISOString(),
          });
        } else if (selectedPeriod === "7days") {
          from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
          to = now.getTime();
        } else {
          from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
          to = now.getTime();
        }
        const response = await getStatisticsSortedByViews(1, 20, 'started', from, to);
        
        console.log('API Response:', response.data);
        console.log('Streams:', response.data?.data?.page);

        const streams = response.data?.data?.page || [];
        const timeSlots = new Map<string, { viewers: number, likes: number }>();

        if (selectedPeriod === "yesterday") {
          for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            const key = `${hourStr}:00`;
            timeSlots.set(key, { viewers: 0, likes: 0 });
          }

          streams.forEach((stream: any) => {
            const streamDate = new Date(stream.created_at);
            if (streamDate >= new Date(from) && streamDate <= new Date(to)) {
              const hour = streamDate.getHours().toString().padStart(2, '0');
              const key = `${hour}:00`;
              
              const existing = timeSlots.get(key) || { viewers: 0, likes: 0 };
              timeSlots.set(key, {
                viewers: Math.max(existing.viewers, stream.viewers || 0),
                likes: Math.max(existing.likes, stream.likes || 0)
              });
            }
          });
        } else {
          const days = selectedPeriod === "7days" ? 7 : 30;
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const key = `${month}/${day}`;
            timeSlots.set(key, { viewers: 0, likes: 0 });
          }
        }

        streams.forEach((stream: any) => {
          const date = new Date(stream.created_at);
          let key: string;

          if (selectedPeriod === "yesterday") {
            const hour = date.getHours().toString().padStart(2, '0');
            key = `${hour}:00`;
          } else {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            key = `${month}/${day}`;
          }

          if (timeSlots.has(key)) {
            timeSlots.set(key, {
              viewers: stream.viewers || 0,
              likes: stream.likes || 0
            });
          }
        });

        const sortedData = Array.from(timeSlots.entries())
          .sort((a, b) => {
            if (selectedPeriod === "yesterday") {
              return parseInt(a[0]) - parseInt(b[0]);
            } else {
              const [aMonth, aDay] = a[0].split('/').map(Number);
              const [bMonth, bDay] = b[0].split('/').map(Number);
              if (aMonth === bMonth) {
                return aDay - bDay;
              }
              return aMonth - bMonth;
            }
          })
          .map(([time, data]) => ({
            time,
            viewers: data.viewers,
            likes: data.likes
          }));

        console.log('Final processed data:', sortedData);
        setViewsData(sortedData);
      } catch (error) {
        console.error('Error in fetchViewsData:', error);
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInfo;