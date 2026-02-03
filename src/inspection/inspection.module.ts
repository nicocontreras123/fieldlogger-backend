import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InspectionController } from './infrastructure/web/inspection.controller';
import { CreateInspectionUseCase } from './application/create-inspection.use-case';
import { DrizzleInspectionRepository } from './infrastructure/persistence/drizzle-inspection.repository';
import { createDrizzleConnection } from './infrastructure/persistence/drizzle/db';

/**
 * Inspection Module
 * 
 * Wires together all layers of the hexagonal architecture:
 * - Controllers (Web Adapters)
 * - Use Cases (Application Layer)
 * - Repositories (Persistence Adapters)
 * 
 * Now using DrizzleInspectionRepository with PostgreSQL.
 * The repository is provided as 'InspectionRepositoryPort' to enforce
 * dependency on the interface, not the implementation.
 */
@Module({
    imports: [ConfigModule],
    controllers: [InspectionController],
    providers: [
        CreateInspectionUseCase,
        {
            provide: 'DrizzleDB',
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
                if (!databaseUrl) {
                    throw new Error('DATABASE_URL is not defined in environment variables');
                }
                return createDrizzleConnection(databaseUrl);
            },
            inject: [ConfigService],
        },
        {
            provide: 'InspectionRepositoryPort',
            useFactory: (db) => {
                return new DrizzleInspectionRepository(db);
            },
            inject: ['DrizzleDB'],
        },
    ],
    exports: ['InspectionRepositoryPort'],
})
export class InspectionModule { }

