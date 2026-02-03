import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Drizzle Schema for Inspections
 * 
 * Reflects the domain entity structure in PostgreSQL.
 * This is the database representation (Infrastructure layer).
 */
export const inspections = pgTable('inspections', {
    id: uuid('id').primaryKey(),
    location: varchar('location', { length: 255 }).notNull(),
    technician: varchar('technician', { length: 255 }).notNull(),
    findings: text('findings').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    syncedAt: timestamp('synced_at', { withTimezone: true }),
});

export type InspectionRow = typeof inspections.$inferSelect;
export type NewInspectionRow = typeof inspections.$inferInsert;
