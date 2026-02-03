import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Drizzle Database Connection
 * 
 * Creates a connection pool and Drizzle instance.
 * This is configured via DATABASE_URL environment variable.
 */
export function createDrizzleConnection(databaseUrl: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const pool = new Pool({
        connectionString: databaseUrl,
        ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    });

    return drizzle(pool, { schema });
}

export type DrizzleDB = ReturnType<typeof createDrizzleConnection>;
