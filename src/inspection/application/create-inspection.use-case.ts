import { Injectable, Inject } from '@nestjs/common';
import { Inspection } from '../domain/inspection.entity';
import type { InspectionRepositoryPort } from '../domain/inspection.repository.port';

export interface CreateInspectionDto {
    id: string;
    location: string;
    technician: string;
    findings: string;
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
    ) { }

    async execute(dto: CreateInspectionDto): Promise<Inspection> {
        // Business logic: Create domain entity
        const inspection = Inspection.create(
            dto.id,
            dto.location,
            dto.technician,
            dto.findings,
        );

        // Persist through the port
        return await this.repository.save(inspection);
    }
}
