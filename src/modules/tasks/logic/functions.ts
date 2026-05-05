import { createServerFn } from "@tanstack/react-start";
import {
  createTask,
  updateTask,
  getTasks,
  getTaskById,
  deleteTask,
} from "./queries.server";
import { createTaskSchema, updateTaskSchema, selectTaskSchema } from "../schemas";
import {z} from "zod";

export const getTasksFn = createServerFn({method: "GET"}).handler(async () => {
  const response = await getTasks();
  return selectTaskSchema.array().parse(response);
})

export const getTaskByIdFn = createServerFn({method: "GET"}).inputValidator(z.object({taskId: z.string()})).handler(async ({data}) => {
  const response = await getTaskById(data.taskId);
  return selectTaskSchema.parse(response);
})

export const createTaskFn = createServerFn({method: "POST"}).inputValidator(createTaskSchema).handler(async ({data}) => {
  return await createTask(data);
})

export const updateTaskFn = createServerFn({method: "POST"}).inputValidator(updateTaskSchema).handler(async ({data}) => {
  return await updateTask(data);
})

export const deleteTaskFn = createServerFn({method: "GET"}).inputValidator(z.object({taskId: z.string()})).handler(async ({data}) => {
  return await deleteTask(data.taskId);
})