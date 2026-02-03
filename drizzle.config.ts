import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Drizzle Kit Configuration
 * 
 * Used for migrations and schema management.
 * Reads DATABASE_URL from environment variables (compatible with Railway).
 */
export default defineConfig({
    schema: './src/inspection/infrastructure/persistence/drizzle/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://localhost:5432/fieldlogger',
    },
});
