import { eq, and, desc, asc, ilike } from "drizzle-orm"
import { db } from "#/db"
import { task } from "#/db/schema"
import type { Task, TaskInsert, TaskUpdate,TaskQueryOptions, TaskPaginationResponse } from "../types"

// main functions

export const getTasks = async (options: TaskQueryOptions): Promise<TaskPaginationResponse> => {
  const { search, page = 1, limit = 10, orderBy = "desc", priority, status } = options

  const whereConditions = [eq(task.isDeleted, false)];

  if (search) {
    whereConditions.push(ilike(task.title, `%${search}%`))
  }

  if (priority) {
    whereConditions.push(eq(task.priority, priority))
  }

  if (status) {
    whereConditions.push(eq(task.status, status))
  }

  const result = await db
    .select()
    .from(task)
    .where(and(...whereConditions))
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(orderBy === "desc" ? desc(task.createdAt) : asc(task.createdAt))

  const total = await db.$count(task)

    return {
      data: result.map(mapResponseToTask),
      totalItems: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    }

}

export const getTaskById = async (id: string): Promise<Task | null> => {
  const result = await db
    .select()
    .from(task)
    .where(and(eq(task.id, id), eq(task.isDeleted, false)))
    .limit(1)
  
  return result[0] ?? null
}

export const createTask = async (data: TaskInsert): Promise<Task> => {
  const result = await db
    .insert(task)
    .values(data)
    .returning()
  
  return result[0]
}

export const updateTask = async (data: TaskUpdate): Promise<Task> => {

  const {id, ...updateData} = data

  if (!id) {
    throw new Error("Task id is required")
  }

  await checkTaskExists(id)

  const result = await db
    .update(task)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(task.id, id))
    .returning()
  
  return result[0]
}

export const deleteTask = async (id: string): Promise<void> => {
  await checkTaskExists(id)

  await db
    .update(task)
    .set({
      isDeleted: true,
      deletedAt: new Date()
    })
    .where(eq(task.id, id))

}

// helper functions

const checkTaskExists = async (id: string) => {
  const existingTask = await getTaskById(id)

  if (!existingTask) {
    throw new Error("Task not found")
  }
}

const mapResponseToTask = (task: Task): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    isDeleted: task.isDeleted,
    deletedAt: task.deletedAt
  }
}