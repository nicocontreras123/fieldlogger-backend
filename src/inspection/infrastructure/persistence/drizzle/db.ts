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
    const pool = new Pool({
        connectionString: databaseUrl,
    });

    return drizzle(pool, { schema });
}

export type DrizzleDB = ReturnType<typeof createDrizzleConnection>;
