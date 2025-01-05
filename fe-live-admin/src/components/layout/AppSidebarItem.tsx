import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub, SidebarMenuSubButton,
	SidebarMenuSubItem
} from "@/components/ui/sidebar.tsx";
import {
	Collapsible, CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible.tsx";

interface ComponentProps {
	title: string;
	url: string;
	icon?: LucideIcon
	isActive?: boolean,
	items?: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[]
}

const AppSidebarItem = ({items}: {items: ComponentProps[]}) => {
	const location = useLocation();
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight
										className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => {
										const isSelected = subItem.url === location.pathname;
										return (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													asChild
													className={`${isSelected ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100'}`}
												>
													<Link to={subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										)
									})}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
};

export default AppSidebarItem;