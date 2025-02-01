import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { DEFAULT_PAGE_SIZES } from '@/lib/validation';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  actions: {
    rowsPerPage?: {
      value: number;
      onChange: (value: number) => void;
    };
    pages?: {
      totalCount: number;
      currentPage: number;
      limit: number;
      handlePageChange: (value: number) => void;
    };
  };
}

export function DataTablePagination<TData>({
  table,
  actions,
}: DataTablePaginationProps<TData>) {
  const pageCount = actions?.pages
    ? Math.ceil(actions.pages.totalCount / actions.pages.limit)
    : 0;
  const currentPage = actions?.pages?.currentPage || 1;

  return (
    <div className="flex items-center justify-between px-2">
      {actions?.rowsPerPage && (
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            // value={`${table.getState().pagination.pageSize}`}
            // onValueChange={(value) => { table.setPageSize(Number(value));}}
            value={actions?.rowsPerPage.value.toString()}
            onValueChange={(value) =>
              actions?.rowsPerPage?.onChange(Number(value))
            }
          >
            <SelectTrigger className="h-8 w-[70px] bg-white">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {DEFAULT_PAGE_SIZES.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {actions?.pages && actions?.pages.currentPage} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => actions?.pages && actions?.pages.handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              actions?.pages && actions?.pages.handlePageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              actions?.pages && actions?.pages.handlePageChange(currentPage + 1)
            }
            disabled={currentPage === pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              actions?.pages && actions?.pages.handlePageChange(pageCount)
            }
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
