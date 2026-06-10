import { defineConfig } from 'drizzle-kit'
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (e) {
  // Ignore error if .env file is missing
}


export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
