import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/CustomSidebar';
import { FEED_PATH, LEFT_MAIN_MENU, ROUTE_PATH_INFO } from '@/data/route';
import useUserAccount from '@/hooks/useUserAccount';
import { USER_ROLE } from '@/data/types/role';
import { NavLink, useLocation } from 'react-router-dom';

export function MainNavItems() {
  const location = useLocation();
  const currentUser = useUserAccount();
  const { setOpen: setSidebarOpen } = useSidebar();

  const role: USER_ROLE =
    (currentUser.role_type as USER_ROLE) ?? USER_ROLE.USER;
  const navItems = LEFT_MAIN_MENU[role] ?? [];
  const currentPath = location.pathname;

  const renderNavItems = () => {
    return role && navItems
      ? navItems.map((key: string) => {
          const routeInfo = ROUTE_PATH_INFO[key];
          if (!routeInfo) return null;

          const { path, title, Icon } = routeInfo;
          const active = currentPath === key;

          if (!path || !title) return null;

          return (
            <NavLink
              to={path}
              end={path === FEED_PATH}
              key={path}
              onClick={() => setSidebarOpen(false)}
            >
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
