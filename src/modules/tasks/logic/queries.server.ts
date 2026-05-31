import { eq, and, desc, asc, ilike, inArray } from "drizzle-orm";
import { db } from "#/db";
import { task } from "#/db/schema";
import type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskQueryOptions,
  TaskPaginationResponse,
} from "../types";
import { handleDatabaseError } from "#/db/errorHandling";

const baseWhereCondition = [eq(task.isDeleted, false)];

// main functions

export const getTasks = async (
  options: TaskQueryOptions,
): Promise<TaskPaginationResponse> => {
  const {
    search,
    page = 1,
    limit = 10,
    orderBy = "desc",
    priority,
    status,
    sortBy,
  } = options;

  const whereConditions = [...baseWhereCondition];

  if (search) {
    whereConditions.push(ilike(task.title, `%${search}%`));
  }

  if (priority) {
    whereConditions.push(inArray(task.priority, priority));
  }

  if (status) {
    whereConditions.push(inArray(task.status, status));
  }

  const sortMapping = {
    title: task.title,
    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  } as const;

  const sortColumn =
    sortBy && sortBy in sortMapping
      ? sortMapping[sortBy as keyof typeof sortMapping]
      : task.createdAt;

  try {
    const total = await db.$count(task);

    const result = await db
      .select()
      .from(task)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(orderBy === "asc" ? asc(sortColumn) : desc(sortColumn));

    return {
      data: result.map(mapResponseToTask),
      totalItems: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  } catch (error) {
    handleDatabaseError(error);
    return {
      data: [],
      totalItems: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  const whereConditions = [...baseWhereCondition];
  whereConditions.push(eq(task.id, id));
  try {
    const result = await db
      .select()
      .from(task)
      .where(and(...whereConditions))
      .limit(1);
    return result[0];
  } catch (error) {
    handleDatabaseError(error);
    return null;
  }
};

export const createTask = async (data: TaskInsert): Promise<Task | null> => {
  try {
    const result = await db.insert(task).values(data).returning();
    return result[0];
  } catch (error) {
    handleDatabaseError(error);
    return null;
  }
};

export const updateTask = async (data: TaskUpdate): Promise<Task | null> => {
  const { id, ...updateData } = data;

  if (!id) {
    throw new Error("Task id is required");
  }

  await checkTaskExists(id);

  try {
    const result = await db
      .update(task)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(task.id, id))
      .returning();

    return result[0];
  } catch (error) {
    handleDatabaseError(error);
    return null;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  await checkTaskExists(id);

  try {
    await db
      .update(task)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where(eq(task.id, id));
  } catch (error) {
    handleDatabaseError(error);
  }
};

// helper functions

const checkTaskExists = async (id: string) => {
  const existingTask = await getTaskById(id);

  if (!existingTask) {
    throw new Error("Task not found");
  }
};

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
    deletedAt: task.deletedAt,
  };
};
