import { Controller, Post, Get, Body, Param, UsePipes } from '@nestjs/common';
import { CreateInspectionUseCase } from '../../application/create-inspection.use-case';
import type { InspectionRepositoryPort } from '../../domain/inspection.repository.port';
import { Inject } from '@nestjs/common';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { createInspectionSchema, type CreateInspectionDto } from '../validation/inspection.schema';

/**
 * Inspection Controller - Infrastructure Layer (Web Adapter)
 * 
 * HTTP adapter that translates web requests into application use cases.
 * Uses Zod for modern schema validation (2026 best practice).
 */
@Controller('inspections')
export class InspectionController {
    constructor(
        private readonly createInspectionUseCase: CreateInspectionUseCase,
        @Inject('InspectionRepositoryPort')
        private readonly repository: InspectionRepositoryPort,
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(createInspectionSchema))
    async create(@Body() dto: CreateInspectionDto) {
        const inspection = await this.createInspectionUseCase.execute(dto);
        return inspection.toJSON();
    }

    @Get()
    async findAll() {
        const inspections = await this.repository.findAll();
        return inspections.map((i) => i.toJSON());
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const inspection = await this.repository.findById(id);
        if (!inspection) {
            return { error: 'Inspection not found' };
        }
        return inspection.toJSON();
    }

    @Get('status/:status')
    async findByStatus(@Param('status') status: 'pending' | 'synced') {
        const inspections = await this.repository.findByStatus(status);
        return inspections.map((i) => i.toJSON());
    }
}
