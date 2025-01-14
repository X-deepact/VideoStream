import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/CustomSidebar';
import { FEED_PATH, LEFT_MAIN_MENU, ROUTE_PATH_INFO } from '@/data/route';
import useUserAccount from '@/hooks/useUserAccount';
import { USER_ROLE } from '@/data/types/role';
import { NavLink, useLocation } from 'react-router-dom';

export function MainNavItems() {
  const location = useLocation();

  const currentUser = useUserAccount();
  const role: USER_ROLE =
    (currentUser.role_type as USER_ROLE) ?? USER_ROLE.USER;

  const currentPath = location.pathname;

  const renderNavItems = () => {
    return role && LEFT_MAIN_MENU[role]
      ? LEFT_MAIN_MENU[role].map((key: string) => {
          const active = currentPath === key;

          const routeInfo = ROUTE_PATH_INFO[key];
          const path = routeInfo?.path;
          const title = routeInfo?.title;
          const Icon = routeInfo?.Icon;

          if (!path || !title) return null;

          return (
            <NavLink to={path} end={path === FEED_PATH} key={path}>
              <SidebarMenuItem className="group/menu-item">
                <SidebarMenuButton
                  className="group-has-[[data-active=true]]/menu-item:bg-primary/30"
                  isActive={active}
                  tooltip={title}
                >
                  {Icon && Icon}
                  <span>{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </NavLink>
          );
        })
      : '';
  };

  return (
    <SidebarGroup>
      <SidebarMenu>{renderNavItems()}</SidebarMenu>
    </SidebarGroup>
  );
}
