import type { TaskPaginationResponse } from "../../types";
import { useDataTable } from "#components/layout/dataTable/useDataTable";
import { taskColumns } from "./taskDataTableColumns";
import { useTaskFilters } from "#modules/tasks/hooks/useTaskFilters.ts";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "#modules/common/hooks/useDebouncedCallback.ts";
import { DataTableToolbar } from "#components/layout/dataTable/dataTableToolbar.tsx";
import { DataTablePagination } from "#components/layout/dataTable/dataTablePagination.tsx";
import { m } from "#/paraglide/messages";
import { TaskCard } from "../taskCard";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "#modules/common/components/ui/empty";
import { ListTodo } from "lucide-react";

interface TaskDataTableProps {
  data: TaskPaginationResponse;
}

export function TaskDataTable({ data }: TaskDataTableProps) {
  const { filters, setPage, setLimit, setSearch } = useTaskFilters();

  const [searchInputValue, setSearchInputValue] = useState(
    filters.search || "",
  );

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setSearch(searchTerm);
  }, 300);

  useEffect(() => {
    setSearchInputValue(filters.search || "");
  }, [filters.search]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const { table } = useDataTable({
    data: data.data ?? [],
    columns: taskColumns,
    pageCount: data.totalPages || 1,
    initialState: {
      columnPinning: {
        right: ["actions"],
      },
      pagination: {
        pageSize: filters.limit,
        pageIndex: filters.page - 1,
      },
      sorting: [{ id: filters.sortBy ?? "createdAt", desc: filters.orderBy === "desc" }],
    },

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({
              pageIndex: filters.page - 1,
              pageSize: filters.limit,
            })
          : updater;
      setPage(newPagination.pageIndex + 1);
      setLimit(newPagination.pageSize);
    },
  });

  return (
    <>
      <DataTableToolbar
        table={table}
        searchPlaceholder={m.task_form_title_placeholder()}
        searchValue={searchInputValue}
        onSearchChange={handleSearchChange}
        showViewOptions={false}
      />

       {table.getRowModel().rows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {table.getRowModel().rows.map((row) => (
            <TaskCard key={row.id} task={row.original} />
          ))}
        </div>
      ) : (
        <EmptyTasksContent />
      )} 

      <DataTablePagination
        table={table}
        pageSizeOptions={[5, 10]}
        totalItems={data.totalItems}
      />
    </>
  );
}

export function EmptyTasksContent() {
  return (
    <Empty className="flex-1 border-2 border-dashed border-gray-400 my-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListTodo className="size-12 border-2 rounded-full p-2 shadow-md" />
        </EmptyMedia>
        <EmptyTitle>{m.task_empty_title()}</EmptyTitle>
        <EmptyDescription>{m.task_empty_description()}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}