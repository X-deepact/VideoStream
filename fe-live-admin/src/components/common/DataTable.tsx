import _ from "lodash";
import { useRef, useState } from "react";
import {
  CirclePlus,
  Download,
  Import,
  RotateCw,
  Search,
  Settings2,
  X,
} from "lucide-react";

import DatePicker from "./DatePicker";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./DataTablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DataCombobox from "../ui/data-combobox";

interface ColumnVisibility {
  [key: string]: boolean;
}

interface DataTableProps<TData, TValue> {
  data: TData[];
  totalCount: number;
  canToggleColumns?: boolean;
  columns: ColumnDef<TData, TValue>[];
  columnVisibilityList?: ColumnVisibility;
  actions?: {
    search?: {
      placeholder: string;
      value: string;
      onSearch: (value: string) => void;
    };
    create?: {
      label: string;
      isDisabled?: boolean;
      onClick: () => void;
    };
    importMany?: {
      label: string;
      isHidden?: boolean;
      isDisabled?: boolean;
      onClick: () => void;
    };
    exportMany?: {
      label: string;
      isHidden?: boolean;
      isDisabled?: boolean;
      onClick: () => void;
    };
    sampleFilters?: TableSampleFilter[];
    datePicker?: {
      maximumDate?: Date;
      selectedDate: Date;
      reset?: {
        label?: string;
        handleDateReset: () => void;
      };
      handleDateSelect: (selectedDate: Date | undefined) => void;
      description?: string;
    };
  };
  pagination?: {
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
  isLoading: boolean;
  onRefresh: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export enum TableSampleFilterType {
  SELECT = "select",
  DATA_COMBO = "data_combo",
}

export type TableSampleFilter = {
  type?: TableSampleFilterType;
  placeholder: string;
  description?: string;
  options: string[] | { value: string; label: string }[];
  selectedValue?: string;
  handleFilter: (selectedOption: string) => void;
};

export function DataTable<TData, TValue>({
  columns,
  columnVisibilityList = {},
  data,
  totalCount,
  canToggleColumns = true,
  actions,
  isLoading,
  pagination,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(columnVisibilityList);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const canHideColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  const searchInputRef = useRef<HTMLInputElement>(null);
  const keyPushTimeRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = (): void => {
    const searchText = searchInputRef.current?.value || "";
    if (keyPushTimeRef.current) {
      clearTimeout(keyPushTimeRef.current);
      keyPushTimeRef.current = null;
    }
    if (actions?.search)
      keyPushTimeRef.current = setTimeout(() => {
        if (actions?.search) actions.search.onSearch(searchText);
      }, 400);
  };
  const onClearSearch = (): void => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    if (actions?.search) actions.search.onSearch(""); // null
  };

  return (
    <div>
      <div className="flex items-end justify-between pt-3 pb-2">
        <div className="flex justify-start items-end gap-2">
          {/* Search */}
          {actions?.search && (
            <div className="relative">
              <div className="absolute left-3 top-[10px]">
                <Search strokeWidth={2} size={16} />
              </div>
              <Input
                type="text"
                name="searchText"
                ref={searchInputRef}
                placeholder={actions.search.placeholder}
                onChange={() => handleSearch()}
                className="max-w-sm mr-3 p-2 px-10 pr-8 bg-white"
              />
              {searchInputRef?.current?.value && (
                <div
                  onClick={onClearSearch}
                  className="absolute right-4 top-[10px] cursor-pointer hover:bg-slate-400 hover:text-slate-100 rounded-full p-0.5"
                >
                  <X strokeWidth={2} size={13} />
                </div>
              )}
            </div>
          )}

          <div className="flex">
            {!!actions?.sampleFilters &&
              actions?.sampleFilters.length > 0 &&
              actions?.sampleFilters.map(
                (sampleFilter: TableSampleFilter, index: number) => {
                  if (
                    sampleFilter?.type === TableSampleFilterType.DATA_COMBO &&
                    !(
                      Array.isArray(sampleFilter.options) &&
                      sampleFilter.options.every(
                        (opt) => typeof opt === "string"
                      )
                    )
                  )
                    return (
                      <div key={index} className="text-left mr-2 w-[150px]">
                        <span className="text-xs py-0 my-0 italic text-slate-500">
                          {sampleFilter.description}
                        </span>
                        <DataCombobox
                          placeholder={sampleFilter?.placeholder}
                          emptyMsg="No data found"
                          data={sampleFilter?.options}
                          onDataChange={sampleFilter?.handleFilter}
                          popOverClass={"w-auto p-0"}
                          fixedWidth="w-[150px]"
                        />
                      </div>
                    );

                  return (
                    <div key={index} className="text-left mr-2 w-[130px]">
                      <span className="text-xs py-0 my-0 italic text-slate-500">
                        {sampleFilter.description}
                      </span>
                      <Select onValueChange={sampleFilter.handleFilter}>
                        <SelectTrigger
                          id="role"
                          className="bg-white text-sm font-medium transition-colors"
                        >
                          <SelectValue
                            placeholder={sampleFilter?.placeholder || "Select"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(sampleFilter.options) &&
                            sampleFilter.options.map((opt) =>
                              typeof opt === "string" ? (
                                <SelectItem
                                  className="capitalize"
                                  value={opt}
                                  key={opt}
                                >
                                  {opt}
                                </SelectItem>
                              ) : (
                                <SelectItem
                                  className="capitalize"
                                  value={opt.value}
                                  key={opt.value}
                                >
                                  {opt.label}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
              )}
            {!!actions?.datePicker && (
              <div className="flex flex-col justify-end">
                {actions?.datePicker?.description && (
                  <span className="text-xs italic text-gray-500">
                    {actions.datePicker.description}
                  </span>
                )}
                <DatePicker
                  selectedDate={actions?.datePicker?.selectedDate}
                  onDateSelect={(date) => {
                    actions?.datePicker?.handleDateSelect(date);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Column filters */}
        <div className="flex gap-2">
          <div className="text-xs self-end pb-1">
            Total: {totalCount} records
          </div>
          <Button onClick={onRefresh} variant="outline" className="ml-auto">
            <RotateCw className="h-4 w-4" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          {canToggleColumns && canHideColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canHideColumns.map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {_.startCase(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!!actions && actions?.create && (
            <Button
              onClick={actions?.create.onClick}
              disabled={actions?.create?.isDisabled || false}
            >
              <CirclePlus className="h-4 w-4" /> {actions?.create.label}
            </Button>
          )}
          {!!actions &&
            actions?.importMany &&
            !actions?.importMany?.isHidden && (
              <Button
                onClick={actions?.importMany.onClick}
                disabled={actions?.importMany?.isDisabled || false}
              >
                <Import className="mr-2 h-4 w-4" /> {actions?.importMany.label}
              </Button>
            )}
          {!!actions && actions?.exportMany && (
            <Button
              onClick={actions?.exportMany.onClick}
              disabled={actions?.exportMany?.isDisabled || false}
            >
              <Download className="mr-2 h-4 w-4" /> {actions?.exportMany.label}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-left"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginations */}
      {pagination && (
        <div className="mt-3">
          <DataTablePagination table={table} actions={pagination} />
        </div>
      )}
    </div>
  );
}
