import type { Column } from '@tanstack/react-table';
import { PlusCircle, XCircle } from 'lucide-react';
import * as React from 'react';
import { m } from "#/paraglide/messages";

import { Badge } from '#components/ui/badge';
import { Button } from '#components/ui/button';
import { Separator } from '#components/ui/separator';
import { MobileResponsivePanel } from '#components/ui/mobile-responsive-panel';
import { CommandPanel } from '#components/ui/command-panel';
import { MultiselectCommandItem } from '#components/ui/multiselect-command-item';
import type { Option } from '#modules/common/components/layout/dataTable/types';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
  filterValue?: unknown;
  onFilterValueChange?: (value: unknown) => void;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple,
  filterValue,
  onFilterValueChange,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

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

  const selectedValues = React.useMemo(
    () => new Set(Array.isArray(appliedFilterValue) ? appliedFilterValue : []),
    [appliedFilterValue]
  );

  const onItemSelect = React.useCallback(
    (option: Option, isSelected: boolean) => {
      console.log(selectedValues)
      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }
        const filterValues = Array.from(newSelectedValues);
        setAppliedFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        setAppliedFilterValue(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [multiple, selectedValues, setAppliedFilterValue]
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      setAppliedFilterValue(undefined);
    },
    [setAppliedFilterValue]
  );

  return (
    <MobileResponsivePanel
      trigger={
        <Button variant="outline" size="sm" className="border-dashed">
          {selectedValues?.size > 0 ? (
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
            <PlusCircle />
          )}
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="outline">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant="outline" key={option.value}>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <CommandPanel
        options={options}
        searchPlaceholder={title}
        emptyMessage={m.data_table_no_results_found()}
        selectedValues={selectedValues}
        multiple={multiple}
        onClose={() => setOpen(false)}
        onReset={onReset}
        renderItem={(option, isSelected) => (
          <MultiselectCommandItem
            option={option}
            isSelected={isSelected || false}
            onSelect={onItemSelect}
          />
        )}
        className="max-h-75 overflow-y-auto overflow-x-hidden"
      />
    </MobileResponsivePanel>
  );
}
