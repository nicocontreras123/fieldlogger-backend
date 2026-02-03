import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Inspection } from '../../domain/inspection.entity';
import type { InspectionRepositoryPort } from '../../domain/inspection.repository.port';
import type { DrizzleDB } from './drizzle/db';
import { inspections } from './drizzle/schema';

/**
 * Drizzle Repository - Infrastructure Layer
 * 
 * Concrete implementation of the Repository Port using Drizzle ORM + PostgreSQL.
 * This replaces the in-memory implementation without changing domain or application layers.
 */
@Injectable()
export class DrizzleInspectionRepository implements InspectionRepositoryPort {
    constructor(private readonly db: DrizzleDB) { }

    async save(inspection: Inspection): Promise<Inspection> {
        // Atomic UPSERT (Insert or Update on Conflict)
        // This handles race conditions and idempotent syncs perfectly
        await this.db
            .insert(inspections)
            .values({
                id: inspection.id,
                location: inspection.location,
                technician: inspection.technician,
                findings: inspection.findings,
                status: inspection.status,
                createdAt: new Date(inspection.createdAt),
                syncedAt: inspection.syncedAt ? new Date(inspection.syncedAt) : null,
            })
            .onConflictDoUpdate({
                target: inspections.id,
                set: {
                    location: inspection.location,
                    technician: inspection.technician,
                    findings: inspection.findings,
                    status: inspection.status,
                    syncedAt: inspection.syncedAt ? new Date(inspection.syncedAt) : null,
                },
            });

        return inspection;
    }

    async findById(id: string): Promise<Inspection | null> {
        const rows = await this.db
            .select()
            .from(inspections)
            .where(eq(inspections.id, id))
            .limit(1);

        if (rows.length === 0) return null;

        const row = rows[0];
        return new Inspection(
            row.id,
            row.location,
            row.technician,
            row.findings,
            row.status as 'pending' | 'synced',
            row.createdAt,
            row.syncedAt || undefined,
        );
    }

    async findAll(): Promise<Inspection[]> {
        const rows = await this.db.select().from(inspections);

        return rows.map(
            (row) =>
                new Inspection(
                    row.id,
                    row.location,
                    row.technician,
                    row.findings,
                    row.status as 'pending' | 'synced',
                    row.createdAt,
                    row.syncedAt || undefined,
                ),
        );
    }

    async findByStatus(status: 'pending' | 'synced'): Promise<Inspection[]> {
        const rows = await this.db
            .select()
            .from(inspections)
            .where(eq(inspections.status, status));

        return rows.map(
            (row) =>
                new Inspection(
                    row.id,
                    row.location,
                    row.technician,
                    row.findings,
                    row.status as 'pending' | 'synced',
                    row.createdAt,
                    row.syncedAt || undefined,
                ),
        );
    }
}
