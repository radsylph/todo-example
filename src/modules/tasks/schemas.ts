import { createInsertSchema, createSelectSchema, createUpdateSchema} from 'drizzle-zod';
import {task} from '#/db/schema';

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

export const selectTaskSchema = createSelectSchema(task);