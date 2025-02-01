import {
	User,
	Play,
	ChartNoAxesCombined,
	AudioWaveform, Podcast,
} from "lucide-react";
import { ITEM_INFO } from "@/router";

export const data = {
	navMain: [
		{
			title: "Account Management",
			icon: User,
			url: "#",
			isActive: true,
			items: [ITEM_INFO.APP_ACCOUNT_LIST_PATH, ITEM_INFO.APP_ACCOUNT_LOG_PATH],
		},
		{
			title: "Live Management",
			icon: Podcast,
			url: "#",
			isActive: true,
			items: [
				ITEM_INFO.APP_UPCOMING_SESSION_PATH,
				ITEM_INFO.APP_LIVE_SESSION_PATH,
				ITEM_INFO.APP_LIVE_CATEGORY_PATH
			],
		},
		{
			title: "Video Management",
			icon: Play,
			url: "#",
			isActive: true,
			items: [ITEM_INFO.APP_VIDEO_LIBRARY_PATH],
		},
		{
			title: "Statistics Management",
			icon: ChartNoAxesCombined,
			url: "#",
			isActive: true,
			items: [
				ITEM_INFO.APP_LIVE_STATISTIC_PATH,
				ITEM_INFO.APP_VIDEO_STATISTIC_PATH,
				ITEM_INFO.APP_USER_STATISTICS_PATH,
			],
		},
	],
};

export const siteData = {
	name: "Cloud TV ⚡️",
	description: "Streaming Hub",
	logo: AudioWaveform,
};
