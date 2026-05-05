import type { z } from "zod";
import { createTaskSchema, updateTaskSchema, selectTaskSchema } from "./schemas";

export type Task = z.infer<typeof selectTaskSchema>;
export type TaskInsert = z.infer<typeof createTaskSchema>;
export type TaskUpdate = z.infer<typeof updateTaskSchema>;

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