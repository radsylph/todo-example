import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { useRouter } from '@tanstack/react-router';
import * as React from 'react';

import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback';
import { parseFilterValue } from './parsers';
import type { ExtendedColumnSort} from './types';

const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'limit';
const SORT_BY_KEY = 'sortBy';
const SORT_ORDER_KEY = 'orderBy';
const ARRAY_SEPARATOR = ',';
const DEBOUNCE_MS = 300;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
      | 'enableRowSelection'
      | 'getRowId'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowId?: (originalRow: TData, index: number) => string;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    enableRowSelection = true,
    getRowId,
    ...tableProps
  } = props;


  const router = useRouter();
  const search = router.state.location.search as Record<string, unknown>;

  const updateSearchParams = React.useCallback(
    (updates: Record<string, unknown>) => {
      const newSearch = { ...search, ...updates };
      Object.keys(newSearch).forEach((key) => {
        if (newSearch[key] === null || newSearch[key] === undefined) {
          delete newSearch[key];
        }
      });

      router.navigate({
        search: newSearch as any,
        replace: true,
      });
    },
    [router, search]
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const page = React.useMemo(() => {
    const pageFromSearch = search[PAGE_KEY];
    return typeof pageFromSearch === 'number' && pageFromSearch > 0
      ? pageFromSearch
      : 1;
  }, [search]);

  const perPage = React.useMemo(() => {
    const perPageFromSearch = search[PER_PAGE_KEY];
    return typeof perPageFromSearch === 'number' && perPageFromSearch > 0
      ? perPageFromSearch
      : initialState?.pagination?.pageSize ?? 10;
  }, [search, initialState?.pagination?.pageSize]);

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        updateSearchParams({
          [PAGE_KEY]: newPagination.pageIndex + 1,
          [PER_PAGE_KEY]: newPagination.pageSize,
        });
      } else {
        updateSearchParams({
          [PAGE_KEY]: updaterOrValue.pageIndex + 1,
          [PER_PAGE_KEY]: updaterOrValue.pageSize,
        });
      }
    },
    [pagination, updateSearchParams]
  );

  const sorting = React.useMemo(() => {
    const sortBy = search[SORT_BY_KEY] as string;
    const orderBy = search[SORT_ORDER_KEY] as 'asc' | 'desc';

    if (sortBy) {
      return [
        {
          id: sortBy,
          desc: orderBy === 'desc',
        },
      ] as ExtendedColumnSort<TData>[];
    }
    return initialState?.sorting || [];
  }, [search, initialState?.sorting]);

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      let newSorting: ExtendedColumnSort<TData>[];

      if (typeof updaterOrValue === 'function') {
        newSorting = updaterOrValue(sorting) as ExtendedColumnSort<TData>[];
      } else {
        newSorting = updaterOrValue as ExtendedColumnSort<TData>[];
      }

      if (newSorting.length > 0) {
        const { id, desc } = newSorting[0];
        updateSearchParams({
          [SORT_BY_KEY]: id,
          [SORT_ORDER_KEY]: desc ? 'desc' : 'asc',
        });
      } else {
        updateSearchParams({
          [SORT_BY_KEY]: undefined,
          [SORT_ORDER_KEY]: undefined,
        });
      }
    },
    [sorting, updateSearchParams]
  );

  // const effectiveColumns = React.useMemo(() => {
  //   return columns.filter((column) => {
  //     const condition = column.meta?.visibleWhen;
  //     return typeof condition === 'function'
  //       ? condition(visibilityContext)
  //       : true;
  //   });
  // }, [columns]);

  const filterableColumns = React.useMemo(() => {
    return columns.filter((column) => {
      if (!column.enableColumnFilter) return false;
      return true;
    });
  }, [columns]);

  // Clear URL filters for columns that became hidden or whose filter is disabled
  React.useEffect(() => {
    const potentialFilterIds = new Set(
      columns.filter((c) => c.enableColumnFilter).map((c) => c.id ?? '')
    );
    const visibleFilterIds = new Set(filterableColumns.map((c) => c.id ?? ''));
    const toClear: Record<string, unknown> = {};
    potentialFilterIds.forEach((id) => {
      if (id && !visibleFilterIds.has(id) && search[id] !== undefined) {
        toClear[id] = undefined;
      }
    });
    if (Object.keys(toClear).length > 0) {
      updateSearchParams({ ...toClear, [PAGE_KEY]: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, filterableColumns, updateSearchParams]);

  const filterValues = React.useMemo(() => {
    const values: Record<string, string | string[] | null> = {};

    filterableColumns.forEach((column) => {
      const columnId = column.id ?? '';
      const searchValue = search[columnId];
      const hasOptions = !!column.meta?.options;

      values[columnId] = parseFilterValue(searchValue, hasOptions);
    });

    return values;
  }, [search, filterableColumns]);

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: Record<string, string | string[] | null>) => {
      const cleanedValues: Record<string, unknown> = {};

      cleanedValues[PAGE_KEY] = 1;

      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            cleanedValues[key] =
              value.length > 0 ? value.join(ARRAY_SEPARATOR) : undefined;
          } else if (typeof value === 'string' && value.trim() !== '') {
            cleanedValues[key] = value;
          } else {
            cleanedValues[key] = undefined;
          }
        } else {
          cleanedValues[key] = undefined;
        }
      });

      updateSearchParams(cleanedValues);
    },
    debounceMs
  );

  const columnFilters: ColumnFiltersState = React.useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value];

          filters.push({
            id: key,
            value: processedValue,
          });
        }
        return filters;
      },
      []
    );
  }, [filterValues]);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      let nextFilters: ColumnFiltersState;

      if (typeof updaterOrValue === 'function') {
        nextFilters = updaterOrValue(columnFilters);
      } else {
        nextFilters = updaterOrValue;
      }

      const filterUpdates: Record<string, string | string[] | null> = {};

      nextFilters.forEach((filter) => {
        if (filterableColumns.find((column) => column.id === filter.id)) {
          filterUpdates[filter.id] = filter.value as string | string[];
        }
      });

      filterableColumns.forEach((column) => {
        const columnId = column.id ?? '';
        if (!nextFilters.some((filter) => filter.id === columnId)) {
          filterUpdates[columnId] = null;
        }
      });

      debouncedSetFilterValues(filterUpdates);
    },
    [columnFilters, debouncedSetFilterValues, filterableColumns]
  );

  // // Ensure sorting references only existing columns
  // const sanitizedInitialSorting = React.useMemo(() => {
  //   if (!initialState?.sorting || initialState.sorting.length === 0) {
  //     return initialState?.sorting;
  //   }
  //   type Col = (typeof effectiveColumns)[number];
  //   const getColumnId = (col: Col): string | undefined => {
  //     if (typeof col.id === 'string') return col.id;
  //     const ak = (col as { accessorKey?: unknown }).accessorKey;
  //     return typeof ak === 'string' ? ak : undefined;
  //   };
  //   const validColumnIds = new Set(
  //     effectiveColumns.map(getColumnId).filter((v): v is string => !!v)
  //   );
  //   return (initialState.sorting as ExtendedColumnSort<TData>[]).filter((s) =>
  //     validColumnIds.has(s.id as unknown as string)
  //   );
  // }, [initialState?.sorting, effectiveColumns]);

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection,
    getRowId,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, debounceMs };
}
