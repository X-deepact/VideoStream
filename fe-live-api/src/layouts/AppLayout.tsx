import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { ThemeProvider } from '@/context/ThemeContext';

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

export const AppLayout = ({ title, children }: AppLayoutProps) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader title={title} />
          <main className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
