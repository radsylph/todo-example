import { Check } from 'lucide-react';
import { CommandItem } from '#modules/common/components/ui/command';
import { cn } from '#/lib/utils';
import type { Option } from '#modules/common/components/layout/dataTable/types';

export interface MultiselectCommandItemProps {
  option: Option;
  isSelected: boolean;
  onSelect: (option: Option, isSelected: boolean) => void;
}

/**
 * Command item specifically designed for multiselect with checkbox
 */
export function MultiselectCommandItem({
  option,
  isSelected,
  onSelect,
}: MultiselectCommandItemProps) {
  const Icon = option.icon;
  return (
    <CommandItem
      keywords={[option.label]}
      key={option.value}
      value={option.value}
      onSelect={() => {
        onSelect(option, isSelected)
      }}
      className="cursor-pointer"
    >
      <div
        className={cn(
          'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
          isSelected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible'
        )}
      >
        <Check className="size-4 text-white" />
      </div>
      {Icon && <Icon />}
      <span className="truncate">{option.label}</span>
      {option.count && (
        <span className="ml-auto font-mono text-xs">{option.count}</span>
      )}
    </CommandItem>
  );
}
