# PostgreSQL Setup Guide

## 🗄️ Database Configuration

The backend now uses **PostgreSQL** with **Drizzle ORM** for persistence.

## 🚀 Quick Start

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS
   brew install postgresql@16
   brew services start postgresql@16
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**:
   ```bash
   psql postgres
   CREATE DATABASE fieldlogger;
   \q
   ```

3. **Update `.env`**:
   ```env
   DATABASE_URL=postgresql://localhost:5432/fieldlogger
   ```

4. **Push Schema to Database**:
   ```bash
   npm run db:push
   ```

5. **Start Backend**:
   ```bash
   npm run start:dev
   ```

### Option 2: Docker PostgreSQL

1. **Run PostgreSQL Container**:
   ```bash
   docker run --name fieldlogger-postgres \
     -e POSTGRES_DB=fieldlogger \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **Update `.env`**:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fieldlogger
   ```

3. **Push Schema**:
   ```bash
   npm run db:push
   ```

### Option 3: Railway (Production)

1. **Create PostgreSQL Database** in Railway dashboard

2. **Copy Database URL** from Railway

3. **Set Environment Variable** in Railway:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/database
   ```

4. **Deploy** - migrations run automatically on startup

## 📊 Database Scripts

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to database (development) |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations (production) |

## 🔧 Drizzle Studio (Database GUI)

View and edit your database with Drizzle Studio:

```bash
npx drizzle-kit studio
```

Opens at: http://localhost:4983

## 📋 Schema

The database schema is defined in:
- `src/inspection/infrastructure/persistence/drizzle/schema.ts`

Current tables:
- **inspections**: Stores all inspection records

## 🔄 Migration Workflow

### Development
```bash
# Make schema changes in schema.ts
# Push directly to database
npm run db:push
```

### Production
```bash
# Generate migration file
npm run db:generate

# Review migration in /drizzle folder

# Apply migration
npm run db:migrate
```

## 🧪 Testing Database Connection

```bash
# Start backend
npm run start:dev

# Check logs for:
# ✅ "Backend running on http://localhost:3000"
# ✅ No database connection errors
```

## ⚠️ Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
```bash
# macOS
brew services start postgresql@16

# Linux
sudo systemctl start postgresql
```

### Authentication Failed
```
Error: password authentication failed
```
**Solution**: Update DATABASE_URL with correct credentials

### Database Does Not Exist
```
Error: database "fieldlogger" does not exist
```
**Solution**: Create the database
```bash
psql postgres -c "CREATE DATABASE fieldlogger;"
```

## 🎯 Hexagonal Architecture Benefits

The repository implementation is **swappable**:
- Domain layer: Unchanged
- Application layer: Unchanged
- Infrastructure layer: `DrizzleInspectionRepository` replaces `InMemoryInspectionRepository`

To switch back to in-memory:
```typescript
// inspection.module.ts
{
  provide: 'InspectionRepositoryPort',
  useClass: InMemoryInspectionRepository, // Change this line
}
```

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
