import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#modules/common/components/ui/command';
import type { Option } from '#modules/common/components/layout/dataTable/types';
import { Button } from '#modules/common/components/ui/button';

export interface CommandPanelProps {
  options: Option[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  onItemSelect?: (option: Option, isSelected?: boolean) => void;
  selectedValues?: Set<string> | string[];
  multiple?: boolean;
  renderItem?: (option: Option, isSelected: boolean) => React.ReactNode;
  className?: string;
  onClose?: () => void;
  onReset?: (event?: React.MouseEvent) => void;
}

/**
 * Reusable command panel with grouping support
 */
export function CommandPanel({
  options,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  onItemSelect,
  selectedValues = [],
  multiple = false,
  renderItem,
  className,
  onClose,
  onReset,
}: CommandPanelProps) {
  const selectedSet = React.useMemo(() => {
    if (Array.isArray(selectedValues)) {
      return new Set(selectedValues);
    }
    return selectedValues;
  }, [selectedValues]);

  const hasGroups = options.some((opt) => opt.groupKey);

  const handleItemSelect = (option: Option, isSelected: boolean) => {
    onItemSelect?.(option, isSelected);
    // Close panel only if not in multiple selection mode
    if (!multiple && onClose) {
      onClose();
    }
  };

  const defaultRenderItem = (option: Option, isSelected: boolean) => (
    <CommandItem
      keywords={[option.label]}
      key={option.value}
      value={option.value}
      onSelect={() => handleItemSelect(option, isSelected)}
      className="cursor-pointer"
    >
      {option.label}
    </CommandItem>
  );

  const renderOption = (option: Option) => {
    const isSelected = selectedSet.has(option.value);
    const node = renderItem
      ? renderItem(option, isSelected)
      : defaultRenderItem(option, isSelected);

    if (React.isValidElement(node)) {
      return React.cloneElement(node, { key: option.value });
    }
    return <React.Fragment key={option.value}>{node}</React.Fragment>;
  };

  const renderCommandGroups = () => {
    if (hasGroups) {
      // Group options by groupKey
      const groupedOptions = options.reduce((acc, option) => {
        const groupKey = option.groupKey || 'Other';
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(option);
        return acc;
      }, {} as Record<string, typeof options>);

      return Object.entries(groupedOptions).map(([groupKey, groupOptions]: [string, Option[]]) => (
        <CommandGroup
          key={groupKey}
          heading={groupOptions[0]?.groupLabel || groupKey}
        >
          {groupOptions.map(renderOption)}
        </CommandGroup>
      ));
    }

    // No grouping, render as single group
    return <CommandGroup>{options.map(renderOption)}</CommandGroup>;
  };

  return (
    <Command className={className}>
      <CommandInput placeholder={searchPlaceholder} className="h-9" />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {renderCommandGroups()}
        {selectedSet.size > 0 && onReset && (
          <>
            <CommandSeparator />
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onReset(e)}
                className="w-full justify-center"
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </CommandList>
    </Command>
  );
}
