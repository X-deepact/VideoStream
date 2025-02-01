import React from "react";
import OverviewChart from "@/components/dashboard/OverviewStatistic";
import ViewPerDayChart from "@/components/dashboard/ViewerStatistic";
import VideoViewChart from "@/components/dashboard/VideoStatistic";

const DashboardInfo: React.FC = () => {
  return (
    <div className="px-8 flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        {/* Overview Statistic */}
        <OverviewChart />

        {/* Video Statistic */}
        <VideoViewChart />
      </div>

      <div>
        <ViewPerDayChart />
      </div>
    </div>
  );
};

export default DashboardInfo;
