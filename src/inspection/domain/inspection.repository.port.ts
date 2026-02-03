import { Inspection } from './inspection.entity';

/**
 * Repository Port (Interface) - Domain Layer
 * 
 * This is the contract that any persistence adapter must implement.
 * The domain layer defines WHAT operations are needed, not HOW they're implemented.
 * This is the core of Hexagonal Architecture's Dependency Inversion.
 */
export interface InspectionRepositoryPort {
    /**
     * Save a new inspection
     */
    save(inspection: Inspection): Promise<Inspection>;

    /**
     * Find an inspection by its ID
     */
    findById(id: string): Promise<Inspection | null>;

    /**
     * Find all inspections
     */
    findAll(): Promise<Inspection[]>;

    /**
     * Find inspections by status
     */
    findByStatus(status: 'pending' | 'synced'): Promise<Inspection[]>;
}
