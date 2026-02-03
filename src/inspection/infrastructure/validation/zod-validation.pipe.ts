import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/**
 * Zod Validation Pipe
 * 
 * Custom NestJS pipe for Zod schema validation.
 * Provides better error messages than class-validator for 2026 standards.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: error.errors,
            });
        }
    }
}
