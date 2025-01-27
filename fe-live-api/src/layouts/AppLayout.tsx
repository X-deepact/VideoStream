import { SidebarInset } from '@/components/CustomSidebar';
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <React.Fragment>
      <AppSidebar />
      <AppHeader />
      <SidebarInset>
        {/* enable for animation for drawer bounce back */}
        {/* <div vaul-drawer-wrapper="" className="bg-background"> */}
        <main className="flex flex-1 flex-col gap-4 p-6 overflow-hidden mt-[56px]">
          {children}
          <Toaster />
        </main>
        {/* </div> */}
      </SidebarInset>
    </React.Fragment>
  );
};

export default AppLayout;
