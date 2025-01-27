import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface ComponentProps {
  actions: {
    rowsPerPage?: {
      value: number;
      onChange: (value: number) => void;
    };
    pages: {
      totalCount: number;
      currentPage: number;
      limit: number;
      handlePageChange: (value: number) => void;
    };
  };
}

export function AppPagination({ actions }: ComponentProps) {
  const pageCount = Math.ceil(actions?.pages.totalCount / actions?.pages.limit);
  const currentPage = actions?.pages.currentPage;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center">
        <div className="flex w-[100px] items-center justify-center text-xs font-medium">
          Page {actions?.pages.currentPage} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => actions?.pages.handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => actions?.pages.handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => actions?.pages.handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => actions?.pages.handlePageChange(pageCount)}
            disabled={currentPage === pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
