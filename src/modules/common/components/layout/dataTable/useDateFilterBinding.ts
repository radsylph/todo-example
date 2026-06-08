import * as React from 'react';
import { parseISO, format, getTime } from 'date-fns';

/**
 * Handler function type for date range changes.
 * @param startDate - The start date in YYYY-MM-DD format
 * @param endDate - The end date in YYYY-MM-DD format
 */
type ChangeHandler = (startDate?: string, endDate?: string) => void;

/**
 * Converts a YYYY-MM-DD formatted date string to a local epoch timestamp.
 * @param ymd - The date string in YYYY-MM-DD format
 * @returns The epoch timestamp in milliseconds, or undefined if input is invalid
 */
function toLocalEpochFromYmd(ymd?: string): number | undefined {
  if (!ymd) return undefined;
  const date = parseISO(ymd);
  return getTime(date);
}

/**
 * Converts a local epoch timestamp to a YYYY-MM-DD formatted date string.
 * @param ms - The epoch timestamp in milliseconds
 * @returns The date string in YYYY-MM-DD format, or undefined if input is invalid
 */
function toYmdFromLocalEpoch(ms?: number): string | undefined {
  if (typeof ms !== 'number') return undefined;
  return format(new Date(ms), 'yyyy-MM-dd');
}

/**
 * Custom hook for binding YYYY-MM-DD formatted date strings to a date range filter.
 * Provides conversion between YYYY-MM-DD strings and epoch timestamps for use with date pickers.
 *
 * @param options - Configuration object
 * @param options.startDate - The start date in YYYY-MM-DD format
 * @param options.endDate - The end date in YYYY-MM-DD format
 * @param options.onChange - Callback fired when the date range changes
 * @returns An object containing the filter value and change handler
 *
 * @example
 * const { filterValue, onFilterValueChange } = useYmdDateFilterBinding({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   onChange: (start, end) => console.log('Date range changed:', start, end)
 * });
 *
 * return (
 *   <DataTableDateFilter
 *     filterValue={filterValue}
 *     onFilterValueChange={onFilterValueChange}
 *   />
 * );
 */
export function useYmdDateFilterBinding(options: {
  startDate?: string;
  endDate?: string;
  onChange: ChangeHandler;
}) {
  const { startDate, endDate, onChange } = options;

  /**
   * Memoized filter value converted to epoch timestamps for the date picker.
   * Returns undefined if either startDate or endDate is missing.
   */
  const filterValue = React.useMemo(() => {
    if (!startDate || !endDate) return undefined;
    return [toLocalEpochFromYmd(startDate), toLocalEpochFromYmd(endDate)];
  }, [startDate, endDate]);

  /**
   * Memoized callback to handle filter value changes from the date picker.
   * Converts epoch timestamps back to YYYY-MM-DD format strings.
   */
  const onFilterValueChange = React.useCallback(
    (val: unknown) => {
      if (!val) {
        onChange(undefined, undefined);
        return;
      }
      if (Array.isArray(val)) {
        const [from, to] = val ?? [];
        const startStr = toYmdFromLocalEpoch(
          typeof from === 'number' ? from : undefined
        );
        const endStr = toYmdFromLocalEpoch(
          typeof to === 'number' ? to : undefined
        );
        onChange(startStr, endStr);
        return;
      }
      if (typeof val === 'number') {
        const ymd = toYmdFromLocalEpoch(val);
        onChange(ymd, ymd);
      }
    },
    [onChange]
  );

  return { filterValue, onFilterValueChange } as const;
}
