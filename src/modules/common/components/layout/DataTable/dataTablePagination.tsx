import type { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import { m } from "#/paraglide/messages";

import { Button } from '#components/ui/button';
import { Badge } from '#components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import { cn } from '#lib/utils';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  totalItems?: number;
  isPending?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  totalItems,
  className,
  isPending,
  ...props
}: DataTablePaginationProps<TData>) {
  const total = totalItems ?? table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const currentPageRowCount = table.getRowModel().rows.length;

  const startItem = total === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem =
    total === 0
      ? 0
      : Math.min(pageIndex * pageSize + currentPageRowCount, total);

  return (
    <div
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
        className
      )}
      {...props}
    >
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
          {m.data_table_rows_selected({
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {m.data_table_showing_results({ start: startItem, end: endItem, total })}
        </span>
        {isPending && (
          <Badge className="ml-2 text-muted-foreground" variant="outline">
            <Loader2 className="size-4 animate-spin text-primary" />
            {m.data_table_updating()}
          </Badge>
        )}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 sm:ml-auto">
        {pageSizeOptions.length > 1 && (
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap font-medium text-sm">
              {m.data_table_rows_per_page()}
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-18 data-size:h-8">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center justify-center font-medium text-sm">
          {m.data_table_page_of({ page: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label={m.data_table_first_page()}
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            aria-label={m.data_table_prev_page()}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label={m.data_table_next_page()}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            aria-label={m.data_table_last_page()}
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
