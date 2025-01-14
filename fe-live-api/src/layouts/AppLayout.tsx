import { SidebarInset, SidebarProvider } from '@/components/CustomSidebar';
import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { SearchProvider } from '@/context/SearchContext';
import {
  GLOBAL_CATEGORY_FILTERABLE_PAGES,
  GLOBAL_CONTENT_UNSEARCHABLE_PAGES,
} from '@/data/route';
import { useLocation } from 'react-router-dom';
import { CategoryProvider } from '@/context/CategoryContext';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { pathname } = useLocation();

  const isSearchDisabled = GLOBAL_CONTENT_UNSEARCHABLE_PAGES.includes(pathname);
  const isCategoryFilterEnabled =
    GLOBAL_CATEGORY_FILTERABLE_PAGES.includes(pathname);

  return (
    <ThemeProvider>
      <SearchProvider>
        <CategoryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader
                isSearchEnabled={!isSearchDisabled}
                isCategoryFilterEnabled={isCategoryFilterEnabled}
              />
              {/* enable for animation for drawer bounce back */}
              {/* <div vaul-drawer-wrapper="" className="bg-background"> */}
              <main className="flex flex-1 flex-col gap-4 p-6 overflow-hidden mt-[56px]">
                {children}
                <Toaster />
              </main>
              {/* </div> */}
            </SidebarInset>
          </SidebarProvider>
        </CategoryProvider>
      </SearchProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
