import { z } from 'zod';

/**
 * Zod Schema for Inspection Creation
 * 
 * Modern validation approach for 2026 - type-safe, composable, and runtime-validated.
 */
export const createInspectionSchema = z.object({
    id: z.string().uuid('ID must be a valid UUID'),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    technician: z.string().min(2, 'Technician name must be at least 2 characters'),
    findings: z.string().min(10, 'Findings must be at least 10 characters'),
});

export type CreateInspectionDto = z.infer<typeof createInspectionSchema>;
