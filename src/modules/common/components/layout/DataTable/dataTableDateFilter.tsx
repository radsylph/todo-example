import type { Column } from '@tanstack/react-table';
import {
  CalendarIcon,
  XCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { m } from "#/paraglide/messages";

import { Button } from '#components/ui/button';
import { Calendar } from '#components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '#components/ui/popover';
import { Separator } from '#components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { formatDate } from '#lib/formDate';
import { useIsMobile } from '#modules/common/hooks/useMobile.ts';

type DateFilterMode = 'day' | 'week' | 'month' | 'range';

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp =
    typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
}

interface DataTableDateFilterProps<TData> {
  column?: Column<TData, unknown>;
  title?: string;
  /** Which tab to show initially when opened. If omitted, derives from `multiple`. */
  defaultMode?: DateFilterMode;
  /** Controlled filter value when used outside of table context. */
  filterValue?: unknown;
  /** Called when the filter value changes (OK button or clear). */
  onFilterValueChange?: (value: unknown) => void;
  /** Optional callback invoked after applying a value via OK button. */
  onApply?: () => void;
}

export function DataTableDateFilter<TData>({
  column,
  title,
  defaultMode,
  filterValue,
  onFilterValueChange,
  onApply,
}: DataTableDateFilterProps<TData>) {
  const isMobile = useIsMobile();
  const getAppliedFilterValue = React.useCallback(() => {
    if (column) return column.getFilterValue();
    return filterValue;
  }, [column, filterValue]);

  const setAppliedFilterValue = React.useCallback(
    (value: unknown) => {
      if (column) {
        column.setFilterValue(value);
        return;
      }
      onFilterValueChange?.(value);
    },
    [column, onFilterValueChange]
  );

  const appliedFilterValue = getAppliedFilterValue();

  const [open, setOpen] = React.useState<boolean>(false);
  const initialTab = React.useMemo<DateFilterMode>(
    () => defaultMode ?? 'day',
    [defaultMode]
  );
  const [activeTab, setActiveTab] = React.useState<DateFilterMode>(initialTab);

  const [pendingDay, setPendingDay] = React.useState<Date | undefined>(
    undefined
  );
  const [pendingWeekStart, setPendingWeekStart] = React.useState<
    Date | undefined
  >(undefined);
  const [pendingMonth, setPendingMonth] = React.useState<{
    year: number;
    month?: number;
  }>({
    year: new Date().getFullYear(),
    month: undefined,
  });
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(
    undefined
  );

  const getWeekRangeFromDate = React.useCallback(
    (date?: Date): DateRange | undefined => {
      if (!date) return undefined;
      const d = new Date(date);
      const day = d.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(d);
      monday.setDate(d.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return { from: monday, to: sunday };
    },
    []
  );

  const getMonthRange = React.useCallback(
    (year: number, month: number): DateRange => {
      const from = new Date(year, month, 1, 0, 0, 0, 0);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
      return { from, to };
    },
    []
  );

  const initializePendingFromApplied = React.useCallback(() => {
    const timestamps = parseColumnFilterValue(appliedFilterValue);
    if (!timestamps.length) {
      setPendingDay(undefined);
      setPendingWeekStart(undefined);
      setPendingRange(undefined);
      setPendingMonth({ year: new Date().getFullYear(), month: undefined });
      return;
    }

    if (timestamps.length >= 2) {
      const from = parseAsDate(timestamps[0]);
      const to = parseAsDate(timestamps[1]);
      setPendingRange({ from, to });
      // Also align month/year for Month tab if possible
      const base = from ?? to ?? new Date();
      setPendingMonth({ year: base.getFullYear(), month: base.getMonth() });
      // Prefer keeping current tab; if it's day, switch to range for clarity
      setActiveTab((prev) => (prev === 'day' ? 'range' : prev));
      return;
    }

    const d = parseAsDate(timestamps[0]);
    setPendingDay(d);
    if (d) {
      setPendingWeekStart(d);
      setPendingMonth({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [appliedFilterValue]);

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setAppliedFilterValue(undefined);
    },
    [setAppliedFilterValue]
  );

  const hasAppliedValue = React.useMemo(() => {
    const timestamps = parseColumnFilterValue(appliedFilterValue);
    if (!timestamps.length) return false;
    return timestamps.some((t) => t !== undefined && t !== null);
  }, [appliedFilterValue]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return '';
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    const timestamps = parseColumnFilterValue(appliedFilterValue);
    const content = (() => {
      if (!timestamps.length) return undefined;
      if (timestamps.length >= 2) {
        const range: DateRange = {
          from: parseAsDate(timestamps[0]),
          to: parseAsDate(timestamps[1]),
        };
        return formatDateRange(range);
      }
      const d = parseAsDate(timestamps[0]);
      return d ? formatDate(d) : undefined;
    })();

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {content && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span>{content}</span>
          </>
        )}
      </span>
    );
  }, [appliedFilterValue, formatDateRange, title]);

  const handleApply = React.useCallback(() => {
    if (activeTab === 'day') {
      setAppliedFilterValue(pendingDay ? pendingDay.getTime() : undefined);
      setOpen(false);
      onApply?.();
      return;
    }

    if (activeTab === 'week') {
      const week = getWeekRangeFromDate(pendingWeekStart);
      const from = week?.from?.getTime();
      const to = week?.to?.getTime();
      setAppliedFilterValue(from || to ? [from, to] : undefined);
      setOpen(false);
      onApply?.();
      return;
    }

    if (activeTab === 'month') {
      const year = pendingMonth.year;
      const month = pendingMonth.month;
      if (month === undefined) {
        setAppliedFilterValue(undefined); 
        setOpen(false);
        onApply?.();
        return;
      }
      const range = getMonthRange(year, month);
      setAppliedFilterValue([range.from?.getTime(), range.to?.getTime()]);
      setOpen(false);
      onApply?.();
      return;
    }

    const from = pendingRange?.from?.getTime();
    const to = pendingRange?.to?.getTime();
    setAppliedFilterValue(from || to ? [from, to] : undefined);
    setOpen(false);
    onApply?.();
  }, [
    activeTab,
    getMonthRange,
    getWeekRangeFromDate,
    onApply,
    pendingDay,
    pendingMonth,
    pendingRange,
    pendingWeekStart,
    setAppliedFilterValue,
  ]);

  const selectedWeekRange = React.useMemo(() => {
    return getWeekRangeFromDate(pendingWeekStart);
  }, [getWeekRangeFromDate, pendingWeekStart]);

  const getYearsForPicker = React.useCallback(() => {
    const nowYear = new Date().getFullYear();
    const start = Math.min(nowYear - 100, pendingMonth.year);
    const end = Math.max(nowYear, pendingMonth.year);
    return Array.from({ length: end - start + 1 }).map((_, i) => {
      const y = start + i;
      return { label: y.toString(), value: y };
    });
  }, [pendingMonth.year]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          initializePendingFromApplied();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {hasAppliedValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as DateFilterMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="day">{m.data_table_day()}</TabsTrigger>
            <TabsTrigger value="week">{m.data_table_week()}</TabsTrigger>
            <TabsTrigger value="month">{m.data_table_month()}</TabsTrigger>
            <TabsTrigger value="range">{m.data_table_range()}</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="flex flex-col gap-3">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              weekStartsOn={1}
              selected={pendingDay}
              onSelect={(d) => setPendingDay(d ?? undefined)}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => setPendingDay(new Date())}
                className="mr-auto"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                OK
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="week" className="flex flex-col gap-3">
            <Calendar
              captionLayout="dropdown"
              mode="range"
              weekStartsOn={1}
              showWeekNumber
              selected={selectedWeekRange}
              onDayClick={(day) => setPendingWeekStart(day)}
              onSelect={(r) => {
                if (r?.from) setPendingWeekStart(r.from);
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => setPendingWeekStart(new Date())}
                className="mr-auto"
              >
                Current week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                OK
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="month"
            className="flex flex-col gap-3 py-2.5 px-1.5"
          >
            <div className="flex items-center justify-between px-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setPendingMonth((m) => ({ year: m.year - 1, month: m.month }))
                }
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <div className="relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md">
                <select
                  aria-label={m.data_table_select_year()}
                  className="absolute inset-0 opacity-0 bg-background text-sm"
                  value={pendingMonth.year}
                  onChange={(e) =>
                    setPendingMonth((m) => ({
                      ...m,
                      year: Number(e.target.value),
                    }))
                  }
                >
                  {getYearsForPicker().map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                <div className="rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5">
                  <span className="select-none font-medium">
                    {pendingMonth.year}
                  </span>
                  <ChevronDownIcon />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setPendingMonth((m) => ({ year: m.year + 1, month: m.month }))
                }
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, idx) => {
                const now = new Date();
                const isCurrent =
                  now.getFullYear() === pendingMonth.year &&
                  now.getMonth() === idx;
                const isSelected = pendingMonth.month === idx;
                const label = new Date(
                  pendingMonth.year,
                  idx,
                  1
                ).toLocaleString('default', { month: 'short' });
                return (
                  <Button
                    key={idx}
                    variant={isSelected ? 'default' : 'ghost'}
                    className={isCurrent ? 'ring-1 ring-ring/50' : ''}
                    onClick={() =>
                      setPendingMonth((m) => ({ ...m, month: idx }))
                    }
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  setPendingMonth({
                    year: now.getFullYear(),
                    month: now.getMonth(),
                  });
                }}
                className="mr-auto"
              >
                Current month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                OK
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="range" className="flex flex-col gap-3">
            <Calendar
              captionLayout="dropdown"
              mode="range"
              numberOfMonths={isMobile ? 1 : 2}
              showOutsideDays={false}
              selected={pendingRange}
              onSelect={(r) => setPendingRange(r)}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const range = getMonthRange(
                    now.getFullYear(),
                    now.getMonth()
                  );
                  setPendingRange(range);
                }}
                className="mr-auto"
              >
                Current month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                OK
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
