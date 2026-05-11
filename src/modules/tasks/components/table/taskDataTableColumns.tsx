import DataTableBadgeCell from '#components/layout/DataTable/dataTableBadgeCell';
import DataTableTextCell from '#components/layout/DataTable/dataTableTextCell';
import { m } from '#/paraglide/messages';
import { DataTableColumnHeader } from '#components/layout/DataTable/dataTableColumnHeader';
import { type ColumnDef } from '@tanstack/react-table';
import { type Task, TaskStatus, TaskPriority } from '../../types';
import {Search} from "lucide-react"
export const taskColumns: ColumnDef<Task>[] = [
  {
    id:"title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={m.task_form_title_label()}
        
      />
    ),
    cell: ({ row }) => <DataTableTextCell text={row.original.title} />,
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={m.task_form_status_label()}
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status  ;
      return (
        <DataTableBadgeCell
          text={status}
          variant={status === TaskStatus.COMPLETED ? "default" : "outline"}
        />
      );
    },
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={m.task_form_priority_label()}
      />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority as TaskPriority;
      return (
        <DataTableBadgeCell
          text={priority}
          variant={
            priority === TaskPriority.HIGH
              ? "destructive"
              : priority === TaskPriority.MEDIUM
                ? "secondary"
                : "outline"
          }
        />
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: m.task_form_priority_label(),
      variant: "select",
      options: [
        { label: m.priority_high(), value: TaskPriority.HIGH },
        { label: m.priority_medium(), value: TaskPriority.MEDIUM },
        { label: m.priority_low(), value: TaskPriority.LOW },
      ],
    },
  },
];
