import { FaUser, FaVideo, FaChartLine, FaPlay } from 'react-icons/fa';

export const data = {
    navMain: [
        {
            title: "Account Management",
            icon: FaUser,
            url: "#",
            items: [
                {
                    title: "# Account List",
                    url: "/dashboard/account-list",
                    icon: FaUser,
                },
            ],
        },
        {
            title: "Live Management",
            icon: FaVideo,
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
            icon: FaPlay,
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
            icon: FaChartLine,
            url: "#",
            items: [
                {
                    title: "# Live Statistics",
                    url: "/dashboard/live-statistics",
                },
                {
                    title: "# Video Statistics",
                    url: "/dashboard/video-statistics",
                    icon: FaChartLine,
                },
                {
                    title: "# User Statistics",
                    url: "/dashboard/user-statistics",
                    icon: FaChartLine,
                },
            ]
        },
    ]
}