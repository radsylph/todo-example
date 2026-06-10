import { boolean, pgTable, uuid, text, varchar, timestamp, pgEnum, numeric, integer } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['active', 'inactive', 'completed'])
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])
export const typeEnum = pgEnum('type', ['income', 'expense'])
export const paymentMethod = pgEnum('payment_method', ['cash', 'card', 'bank_transfer'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'cancelled', 'shipped'])




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

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

export const movement = pgTable("movement" , {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id),
	productId: uuid("product_id").notNull().references(() => product.id),
	name: varchar("name", { length: 255 }).notNull(),
	amount: numeric("amount").notNull(),
	type: typeEnum("type").notNull(),
	paymentMethod: paymentMethod("payment_method").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at"),
})

export const product = pgTable('product', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	imageLink: varchar('image_link', { length: 255 }).notNull(),
	price: numeric('price').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
	userId: text('user_id').notNull().references(() => user.id),
})

export const salesOrder = pgTable('sales_order', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().references(() => user.id),
	customerName: varchar('customer_name', { length: 255 }),
	total: numeric('total').default('0').notNull(),
	status: orderStatusEnum('status').default('pending').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const orderItem = pgTable('order_item', {
	id: uuid('id').primaryKey().defaultRandom(),
	orderId: uuid('order_id').notNull().references(() => salesOrder.id),
	productId: uuid('product_id').notNull().references(() => product.id),
	quantity: integer('quantity').notNull(),
	unitPrice: numeric('unit_price').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const payment = pgTable('payment', {
	id: uuid('id').primaryKey().defaultRandom(),
	orderId: uuid('order_id').notNull().references(() => salesOrder.id),
	amount: numeric('amount').notNull(),
	method: paymentMethod('method').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})


	

