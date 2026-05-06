import { createInsertSchema, createSelectSchema, createUpdateSchema} from 'drizzle-zod';
import {task} from '#/db/schema';
import { baseQueryOptionsSchema, basePaginationResponseSchema } from '#modules/common/types/generalPaginationTypes.ts';
import {TaskStatus, TaskPriority} from "./types";
import {z} from "zod";

export const selectTaskSchema = createSelectSchema(task);

export const createTaskSchema = createInsertSchema(task, {
  title: (schema) => schema.min(1, "The title is obligatory"),
  description: (schema) => schema.optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true,
})

export const updateTaskSchema = createUpdateSchema(task, {
  title: (schema) => schema.min(1, "The title is obligatory"),
  description: (schema) => schema.optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedAt: true,
}).partial()

export const taskQueryOptionsSchema = baseQueryOptionsSchema.extend({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
});

export const taskPaginationResponseSchema = basePaginationResponseSchema.extend({
  data: z.array(selectTaskSchema),
});

