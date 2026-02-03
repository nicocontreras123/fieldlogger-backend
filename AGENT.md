# FieldLogger Backend - NestJS 11 Hexagonal Architecture

## 🏗️ Architecture Overview

This backend implements **Hexagonal Architecture** (Ports & Adapters) with NestJS 11, ensuring clean separation of concerns and testability.

### Architecture Layers

```
src/inspection/
├── domain/                    # Core Business Logic (Framework-agnostic)
│   ├── inspection.entity.ts   # Domain Entity with business rules
│   └── inspection.repository.port.ts  # Repository Interface (Port)
│
├── application/               # Use Cases (Application Logic)
│   └── create-inspection.use-case.ts  # Orchestrates business operations
│
└── infrastructure/            # External Adapters
    ├── web/                   # HTTP Adapter
    │   └── inspection.controller.ts
    ├── persistence/           # Database Adapter
    │   ├── drizzle/
    │   │   ├── schema.ts      # Drizzle schema definition
    │   │   └── db.ts          # Database connection
    │   └── drizzle-inspection.repository.ts  # Drizzle repository
    └── validation/            # Validation Layer
        ├── inspection.schema.ts
        └── zod-validation.pipe.ts
```

## 🎯 Key Design Principles

### 1. Dependency Inversion
- **Domain** defines interfaces (Ports)
- **Infrastructure** implements those interfaces (Adapters)
- **Application** depends on Domain interfaces, not concrete implementations

### 2. Technology Independence
- Domain layer has ZERO dependencies on NestJS, HTTP, or databases
- Easy to swap persistence (Drizzle → TypeORM → Prisma)
- Easy to swap delivery mechanism (REST → GraphQL → gRPC)

### 3. Testability
- Domain entities can be tested in isolation
- Use cases can be tested with mock repositories
- Controllers can be tested with mock use cases

## 🔧 Technology Stack (2026)

- **Framework**: NestJS 11 with SWC compiler
- **Validation**: Zod (modern, type-safe schema validation)
- **Architecture**: Hexagonal (Ports & Adapters)
- **Database**: PostgreSQL with Drizzle ORM
- **Environment**: dotenv for configuration

## 📝 Adding New Features

### Adding a New Use Case

1. **Define Domain Logic** (`domain/`)
   ```typescript
   // domain/inspection.entity.ts
   markAsCompleted(): Inspection {
     return new Inspection(..., 'completed', ...);
   }
   ```

2. **Create Use Case** (`application/`)
   ```typescript
   // application/complete-inspection.use-case.ts
   @Injectable()
   export class CompleteInspectionUseCase {
     constructor(
       @Inject('InspectionRepositoryPort')
       private readonly repository: InspectionRepositoryPort,
     ) {}
     
     async execute(id: string): Promise<Inspection> {
       const inspection = await this.repository.findById(id);
       const completed = inspection.markAsCompleted();
       return await this.repository.save(completed);
     }
   }
   ```

3. **Expose via Controller** (`infrastructure/web/`)
   ```typescript
   @Patch(':id/complete')
   async complete(@Param('id') id: string) {
     return await this.completeInspectionUseCase.execute(id);
   }
   ```

### Working with Drizzle ORM

The current implementation uses **Drizzle ORM** with PostgreSQL. Here's how it works:

1. **Schema Definition** (`infrastructure/persistence/drizzle/schema.ts`)
   ```typescript
   export const inspections = pgTable('inspections', {
     id: uuid('id').primaryKey(),
     location: varchar('location', { length: 255 }).notNull(),
     technician: varchar('technician', { length: 255 }).notNull(),
     findings: text('findings').notNull(),
     status: varchar('status', { length: 20 }).notNull().default('pending'),
     createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
     syncedAt: timestamp('synced_at', { withTimezone: true }),
   });
   ```

2. **Repository Implementation** (`infrastructure/persistence/drizzle-inspection.repository.ts`)
   ```typescript
   @Injectable()
   export class DrizzleInspectionRepository implements InspectionRepositoryPort {
     constructor(private readonly db: DrizzleDB) {}
     
     async save(inspection: Inspection): Promise<Inspection> {
       await this.db.insert(inspections).values({
         id: inspection.id,
         location: inspection.location,
         // ... other fields
       });
       return inspection;
     }
   }
   ```

3. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Or generate migrations
   npm run db:generate
   npm run db:migrate
   ```

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete setup instructions.

## 🗄️ Database Management

```bash
# Push schema changes (development)
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations (production)
npm run db:migrate

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

## 🚀 Running the Backend

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 🧪 Testing Strategy

```bash
# Unit tests (domain + use cases)
npm run test

# Integration tests (controllers + repositories)
npm run test:e2e
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inspections` | Create new inspection |
| GET | `/inspections` | List all inspections |
| GET | `/inspections/:id` | Get inspection by ID |
| GET | `/inspections/status/:status` | Filter by status |

## 🔐 Validation with Zod

Zod provides runtime type safety and better error messages:

```typescript
// inspection.schema.ts
export const createInspectionSchema = z.object({
  id: z.string().uuid(),
  location: z.string().min(3),
  technician: z.string().min(2),
  findings: z.string().min(10),
});

// Auto-infer TypeScript type
export type CreateInspectionDto = z.infer<typeof createInspectionSchema>;
```

## 🎓 Learning Resources

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [NestJS Documentation](https://docs.nestjs.com)
- [Zod Documentation](https://zod.dev)
