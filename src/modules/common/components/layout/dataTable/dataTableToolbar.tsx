import type { Column, Table } from '@tanstack/react-table';
import { X, Search } from 'lucide-react';
import * as React from 'react';
import { m } from "#/paraglide/messages";

import { DataTableFacetedFilter } from './dataTableFacetedFilter';
import { DataTableDateFilter } from './dataTableDateFilter';
import { DataTableSliderFilter } from './dataTableSliderFilter';
import { DataTableViewOptions } from './dataTableViewOptions';
import { Button } from '#components/ui/button';
import { Input } from '#components/ui/input';
import { cn } from '#lib/utils';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  customFilters?: React.ReactNode;
  showViewOptions?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  customFilters,
  showViewOptions = true,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = table.getAllColumns().filter((column) => {
    if (!column.getCanFilter()) return false;
    return true;
  });

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [table, onSearchChange]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2 w-full sm:w-auto">
        {onSearchChange && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9 text-sm h-10 sm:h-9 w-full sm:w-64 lg:w-72 bg-background/50 focus-visible:ring-1 transition-all"
            />
          </div>
        )}
        {customFilters}
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {(isFiltered || searchValue) && (
          <Button
            aria-label={m.data_table_reset_filters()}
            variant="ghost"
            className="h-10 sm:h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
            onClick={onReset}
          >
            {m.data_table_reset_filters()}
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showViewOptions && <DataTableViewOptions table={table} />}
        {children}
      </div>
    </div>
  );
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case 'text':
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
          />
        );

      case 'number':
        return (
          <div className="relative hover:cursor-pointer">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn('h-8 w-30', columnMeta.unit && 'pr-8')}
            />
            {columnMeta.unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case 'range':
        return (
          <DataTableSliderFilter
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      case 'date':
      case 'dateRange':
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            defaultMode={columnMeta.variant === 'dateRange' ? 'range' : 'day'}
          />
        );

      case 'select':
      case 'multiSelect':
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === 'multiSelect'}
          />
        );

      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}
