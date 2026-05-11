import { useCallback, useMemo } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { taskQueryOptionsSchema, type taskQueryOptions } from "../schemas";
import type { TaskStatus } from "../types";

export function useTaskFilters() {
  const navigate = useNavigate();
  const currentSearchParams = useSearch({ from: "/app/task/" });

  const filters = useMemo(() => {
    return taskQueryOptionsSchema.parse(currentSearchParams);
  }, [currentSearchParams]);

  const updateFilters = useCallback(
    (updates: Partial<taskQueryOptions>) => {
      const newParams = { ...currentSearchParams, ...updates };

      if (
        updates.status !== undefined ||
        updates.priority !== undefined ||
        updates.search !== undefined
      ) {
        newParams.page = 1;
      }

      const urlSearchParams = new URLSearchParams();

      urlSearchParams.set("page", (newParams.page || 1).toString());
      urlSearchParams.set("limit", (newParams.limit || 10).toString());
      urlSearchParams.set("sortBy", newParams.sortBy || "name");
      urlSearchParams.set("orderBy", newParams.orderBy || "asc");

      if (newParams.search) {
        urlSearchParams.set("search", newParams.search);
      }
      if (newParams.sortBy) {
        urlSearchParams.set("sortBy", newParams.sortBy);
      }
      if (newParams.orderBy) {
        urlSearchParams.set("orderBy", newParams.orderBy);
      }
      if (newParams.priority) {
        urlSearchParams.set("priority", newParams.priority);
      }
      if (newParams.status) {
        urlSearchParams.set("status", newParams.status);
      }
      const searchString = urlSearchParams.toString();
      const url = `/app/task/${searchString ? `?${searchString}` : ""}`;

      navigate({ to: url, replace: true });
    },
    [currentSearchParams, navigate],
  );

  const clearFilters = useCallback(() => {
    navigate({
      to: "/app/task",
      search: {
        page: 1,
        limit: 10,
        orderBy: "desc",
        sortBy: "createdAt",
      },
      replace: true,
    });
  }, [navigate]);

  const setStatusFilter = useCallback(
    (status: TaskStatus | undefined) => {
      updateFilters({ status: status || undefined });
    },
    [updateFilters],
  );

  const setSearchFilter = useCallback(
    (search: string) => {
      updateFilters({ search: search || undefined });
    },
    [updateFilters],
  );

  const setSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search || undefined });
    },
    [updateFilters],
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters],
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateFilters({ limit });
    },
    [updateFilters],
  );

  const setSorting = useCallback(
    (sortBy: taskQueryOptions["sortBy"], orderBy: taskQueryOptions["orderBy"]) => {
      updateFilters({ sortBy, orderBy });
    },
    [updateFilters],
  );

  return {
    filters,
    updateFilters,
    clearFilters,
    setSearchFilter,
    setStatusFilter,
    setSearch,
    setPage,
    setLimit,
    setSorting,
  };
}
