import { drizzle } from 'drizzle-orm/node-postgres'
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (e) {
  // Ignore error if .env file is missing (e.g. in production)
}

import * as schema from './schema.ts'

export const db = drizzle(process.env.DATABASE_URL!, { schema })
