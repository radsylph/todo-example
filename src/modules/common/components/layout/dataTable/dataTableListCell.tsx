import React from 'react';
import { cn } from '#lib/utils';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '#components/ui/hover-card';

type IconComponent = React.ComponentType<{ className?: string }>;

type AccessorFn<T> = (item: T) => string | number | undefined | null;

interface Props<T> {
  items?: T[] | null;
  accessorFn?: AccessorFn<T>;
  className?: string;
  maxWidthClass?: string;
  titleAttr?: string;
  maxVisibleItems?: number;
  icon?: IconComponent;
  iconClassName?: string;
}

/**
 * Generic table cell that renders a comma separated list for an array of items.
 * - Infers item type via generics.
 * - Uses accessorFn to extract the displayed value from each item.
 * - Truncates long text by default.
 * - Shows overflow items inside a popover triggered by a "+N" badge.
 */
export default function DataTableListCell<T>({
  items,
  accessorFn,
  className = '',
  maxWidthClass = 'max-w-[300px]',
  titleAttr,
  maxVisibleItems = 3,
  icon: Icon,
  iconClassName = '',
}: Props<T>) {
  const values: (string | number)[] = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!accessorFn) {
      // If no accessor provided, assume items are primitive strings or numbers
      return items.map((x: unknown) =>
        x === null || x === undefined ? '' : String(x)
      );
    }
    return items.map((it) => {
      const v = accessorFn(it);
      return v === null || v === undefined ? '' : v;
    });
  }, [items, accessorFn]);
  // HoverCard will manage hover/focus open/close behavior; we don't need local state
  if (!values || values.length === 0) {
    return (
      <div className={cn('flex items-center', className)}>
        <p className={cn(maxWidthClass, 'truncate')}>-</p>
      </div>
    );
  }

  const visible = values.slice(0, maxVisibleItems);
  const overflow = values.slice(maxVisibleItems);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Icon ? (
        <Icon
          className={cn('size-4 shrink-0 text-muted-foreground', iconClassName)}
        />
      ) : null}

      <p
        className={cn(maxWidthClass, 'truncate')}
        title={titleAttr ?? values.join(', ')}
      >
        {visible.map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 ? ', ' : ''}
            {v}
          </React.Fragment>
        ))}
      </p>

      {overflow.length > 0 ? (
        <HoverCard openDelay={200} closeDelay={150}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground inline-flex items-center"
              aria-label={`Show ${overflow.length} more items`}
            >
              +{overflow.length}
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit max-w-105">
            <ul className="flex flex-col gap-1 list-disc list-inside">
              {overflow.map((v, i) => (
                <li key={i} className="text-sm">
                  {v}
                </li>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>
      ) : null}
    </div>
  );
}
