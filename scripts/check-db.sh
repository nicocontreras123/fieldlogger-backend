#!/bin/bash

echo "🔍 Checking PostgreSQL setup..."

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    
    # Try to connect to default database
    if psql -U postgres -c '\q' 2>/dev/null; then
        echo "✅ PostgreSQL is running"
        
        # Check if fieldlogger database exists
        if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw fieldlogger; then
            echo "✅ Database 'fieldlogger' exists"
        else
            echo "⚠️  Database 'fieldlogger' does not exist"
            echo "Creating database..."
            psql -U postgres -c "CREATE DATABASE fieldlogger;"
            echo "✅ Database created"
        fi
    else
        echo "❌ PostgreSQL is not running"
        echo "Start it with: brew services start postgresql@16"
        exit 1
    fi
else
    echo "⚠️  PostgreSQL not found locally"
    echo ""
    echo "Options:"
    echo "1. Install PostgreSQL: brew install postgresql@16"
    echo "2. Use Docker: docker run --name fieldlogger-postgres -e POSTGRES_DB=fieldlogger -p 5432:5432 -d postgres:16"
    exit 1
fi

echo ""
echo "✅ PostgreSQL setup complete!"
echo "Run: npm run db:push"
