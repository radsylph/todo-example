import { eq, and, desc } from "drizzle-orm"
import { db } from "#/db"
import { task } from "#/db/schema"

import type { Task, TaskInsert, TaskUpdate } from "../types"

// main functions

export const getTasks = async (): Promise<Task[]> => {
  return await db
    .select()
    .from(task)
    .where(eq(task.isDeleted, false))
    .orderBy(desc(task.createdAt))
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