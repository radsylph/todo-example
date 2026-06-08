import { m } from '#/paraglide/messages';
import { type ColumnDef } from '@tanstack/react-table';
import { type Task, TaskStatus, TaskPriority } from '../../types';

export const taskColumns: ColumnDef<Task>[] = [
  {
    id:"title",
    accessorKey: "title",
    enableSorting: true,
    enableColumnFilter: false,
    meta: {
      label: m.task_form_title_label(),
      placeholder: m.task_form_title_placeholder(),
    },
  },
  {
    id:"status",
    accessorKey: "status",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: m.task_form_status_label(),
      variant: "multiSelect",
      options: [
        { label: m.status_active(), value: TaskStatus.ACTIVE },
        { label: m.status_inactive(), value: TaskStatus.INACTIVE },
        { label: m.status_completed(), value: TaskStatus.COMPLETED },
      ],
    },
  },
  {
    id:"priority",
    accessorKey: "priority",
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: m.task_form_priority_label(),
      variant: "multiSelect",
      options: [
        { label: m.priority_high(), value: TaskPriority.HIGH },
        { label: m.priority_medium(), value: TaskPriority.MEDIUM },
        { label: m.priority_low(), value: TaskPriority.LOW },
      ],
    },
  },
];
