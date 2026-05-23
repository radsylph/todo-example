import type { z } from "zod";
import {createTaskSchema, updateTaskSchema, selectTaskSchema, taskQueryOptionsSchema, taskPaginationResponseSchema} from "./schemas";

export type Task = z.infer<typeof selectTaskSchema>;
export type TaskInsert = z.infer<typeof createTaskSchema>;
export type TaskUpdate = z.infer<typeof updateTaskSchema>;
export type TaskQueryOptions = z.infer<typeof taskQueryOptionsSchema>;
export type TaskPaginationResponse = z.infer<typeof taskPaginationResponseSchema>;

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export enum TaskStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    COMPLETED = "completed"
}

export type TaskDialogType = "update" | "delete";

export interface TaskDialogContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    dialog: TaskDialogType | null;
    setDialog: (dialog: TaskDialogType | null) => void;
    task: Task | null;
    setTask: (task: Task | null) => void;
}