/**
 * Script to clear all inspections from the database
 * Run with: npx ts-node scripts/clear-inspections.ts
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { inspections } from '../src/inspection/infrastructure/persistence/drizzle/schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function clearInspections() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL environment variable is not set');
        console.error('Make sure you have a .env file in the backend directory with DATABASE_URL');
        process.exit(1);
    }

    const client = new Client({
        connectionString: databaseUrl,
    });

    try {
        await client.connect();
        console.log('🔌 Connected to database');

        const db = drizzle(client);

        // Delete all inspections
        const result = await db.delete(inspections);

        console.log('✅ All inspections have been deleted from the database');
        console.log('📝 You can now start fresh with new inspections');

    } catch (error) {
        console.error('❌ Error clearing inspections:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

clearInspections();
