import { SidebarProvider } from '@/components/CustomSidebar';
import { CategoryProvider } from './CategoryContext';
import { SearchProvider } from './SearchContext';
import { ThemeProvider } from './ThemeContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SearchProvider>
      <CategoryProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </CategoryProvider>
    </SearchProvider>
  </ThemeProvider>
);
