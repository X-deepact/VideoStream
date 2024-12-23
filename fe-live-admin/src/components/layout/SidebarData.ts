import { User, Video, Play, ChartNoAxesCombined } from "lucide-react";
export const data = {
    navMain: [
        {
            title: "Account Management",
            icon: User,
            url: "#",
            items: [
                {
                    title: "# Account List",
                    url: "/dashboard/account-list",
                    icon: User,
                },
            ],
        },
        {
            title: "Live Management",
            icon: Video,
            url: "#",
            items: [
                {
                    title: "# Live List",
                    url: "/dashboard/live-list",
                },
            ]
        },
        {
            title: "Video Management",
            icon: Play,
            url: "#",
            items: [
                {
                    title: "# Video Library",
                    url: "/dashboard/video-library",
                },
            ]
        },
        {
            title: "Statistics Management",
            icon: ChartNoAxesCombined,
            url: "#",
            items: [
                {
                    title: "# Live Statistics",
                    url: "/dashboard/live-statistics",
                },
                {
                    title: "# Video Statistics",
                    url: "/dashboard/video-statistics",
                    icon: ChartNoAxesCombined,
                },
                {
                    title: "# User Statistics",
                    url: "/dashboard/user-statistics",
                    icon: ChartNoAxesCombined,
                },
            ]
        },
    ]
}