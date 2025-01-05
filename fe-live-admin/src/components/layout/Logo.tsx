import { useNavigate } from "react-router-dom";
import { siteData } from "@/components/layout/SidebarData.ts";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import { APP_DASHBOARD_PATH } from "@/router";

const Logo = () => {
	const navigate = useNavigate();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={() => navigate(APP_DASHBOARD_PATH)}
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
						{siteData.logo && <siteData.logo />}
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{siteData.name}</span>
						<span className="truncate text-xs">{siteData.description}</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default Logo;
