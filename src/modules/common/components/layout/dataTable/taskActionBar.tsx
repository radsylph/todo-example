import type { Table, Row } from '@tanstack/react-table';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { m } from "#/paraglide/messages";
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from '#components/ui/action-bar';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '#components/ui/button';

export type TaskAction<TData> = {
  label: string;
  icon: React.ReactNode;
  onClick: (rows: Row<TData>[]) => void;
  variant?: VariantProps<typeof buttonVariants>['variant'];
};

interface TaskActionBarProps<TData> {
  table: Table<TData>;
  actions: TaskAction<TData>[];
}

export function TaskActionBar<TData>({
  table,
  actions,
}: TaskActionBarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleClearSelection = useCallback(() => {
    table.toggleAllRowsSelected(false);
  }, [table]);

  return (
    <ActionBar open={selectedRows.length > 0}>
      <ActionBarSelection>
        <span className="font-medium">{selectedRows.length}</span>
        <span>{m.data_table_selected()}</span>
        <ActionBarSeparator />
        <ActionBarClose onClick={handleClearSelection}>
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        {actions.map((action) => (
          <ActionBarItem
            key={action.label}
            onClick={() => action.onClick(selectedRows)}
            variant={action.variant}
          >
            {action.icon}
            {action.label}
          </ActionBarItem>
        ))}
      </ActionBarGroup>
    </ActionBar>
  );
}
