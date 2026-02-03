import { Injectable, Inject } from '@nestjs/common';
import { Inspection } from '../domain/inspection.entity';
import type { InspectionRepositoryPort } from '../domain/inspection.repository.port';
import { InspectionEventsController } from '../infrastructure/web/inspection-events.controller';

export interface CreateInspectionDto {
    id: string;
    location: string;
    technician: string;
    findings: string;
    status?: 'pending' | 'synced';
    createdAt?: string;
    syncedAt?: string;
}

/**
 * Use Case - Application Layer
 * 
 * Orchestrates business logic without knowing about HTTP, databases, or other infrastructure.
 * Depends on the Repository Port (interface), not on concrete implementations.
 */
@Injectable()
export class CreateInspectionUseCase {
    constructor(
        @Inject('InspectionRepositoryPort')
        private readonly repository: InspectionRepositoryPort,
        private readonly eventsController: InspectionEventsController,
    ) { }

    async execute(dto: CreateInspectionDto): Promise<Inspection> {
        // Business logic: Create domain entity
        // If createdAt is provided (from another device), use it; otherwise use current time
        const createdAt = dto.createdAt ? new Date(dto.createdAt) : new Date();
        // When receiving from sync engine, mark as synced immediately since it's now in the DB
        const status: 'pending' | 'synced' = 'synced';
        const syncedAt = new Date();

        const inspection = new Inspection(
            dto.id,
            dto.location,
            dto.technician,
            dto.findings,
            status,
            createdAt,
            syncedAt,
        );

        // Persist through the port
        const savedInspection = await this.repository.save(inspection);

        // Broadcast update to all connected SSE clients
        // This ensures real-time updates across all devices
        await this.eventsController.broadcastUpdate();

        return savedInspection;
    }
}
