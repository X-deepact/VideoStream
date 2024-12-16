import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNavItems } from './MainNavItems';
import Logo from './Logo';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <MainNavItems />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-start">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
