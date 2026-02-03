import { Injectable } from '@nestjs/common';
import { Inspection } from '../../domain/inspection.entity';
import { InspectionRepositoryPort } from '../../domain/inspection.repository.port';

/**
 * In-Memory Repository - Infrastructure Layer
 * 
 * Concrete implementation of the Repository Port.
 * In a real application, this would be replaced with a database adapter
 * (e.g., TypeORM, Prisma, MongoDB) without changing the domain or application layers.
 */
@Injectable()
export class InMemoryInspectionRepository implements InspectionRepositoryPort {
    private inspections: Map<string, Inspection> = new Map();

    async save(inspection: Inspection): Promise<Inspection> {
        this.inspections.set(inspection.id, inspection);
        return inspection;
    }

    async findById(id: string): Promise<Inspection | null> {
        return this.inspections.get(id) || null;
    }

    async findAll(): Promise<Inspection[]> {
        return Array.from(this.inspections.values());
    }

    async findByStatus(status: 'pending' | 'synced'): Promise<Inspection[]> {
        return Array.from(this.inspections.values()).filter(
            (inspection) => inspection.status === status,
        );
    }
}
