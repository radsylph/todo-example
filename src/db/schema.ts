import { boolean, pgTable, uuid, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['active', 'inactive', 'completed'])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])

export const task = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(), // the type varchar can be limited in the lenght of the string
  description: text('description'), // the type text is unbounded
  status: statusEnum('status').default('active').notNull(),
  priority: priorityEnum('priority').default('low').notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})

