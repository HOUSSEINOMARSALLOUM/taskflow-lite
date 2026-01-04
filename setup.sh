#!/bin/bash
# TaskFlow Lite - Quick Start Setup Script
# This script helps set up the entire application

echo "=========================================="
echo "TaskFlow Lite - Quick Start Setup"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    echo "   Windows: https://www.postgresql.org/download/windows/"
    echo "   Mac: brew install postgresql"
    echo "   Linux: sudo apt-get install postgresql"
    exit 1
fi
echo "✅ PostgreSQL detected"
echo ""

# Get PostgreSQL password
read -p "Enter PostgreSQL admin password (default: postgres): " PG_PASSWORD
PG_PASSWORD=${PG_PASSWORD:-postgres}

# Create database
echo ""
echo "Creating taskflow_lite database..."
PGPASSWORD=$PG_PASSWORD psql -U postgres -h localhost -c "CREATE DATABASE taskflow_lite;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "⚠️  Database might already exist, continuing..."
fi

# Setup Server
echo ""
echo "=========================================="
echo "Setting up Backend Server"
echo "=========================================="
cd server || exit

# Update .env file
echo ""
echo "Updating server/.env with database credentials..."
sed -i "s|postgresql://postgres:.*@|postgresql://postgres:${PG_PASSWORD}@|g" .env
echo "✅ .env file updated"

# Install dependencies
echo ""
echo "Installing server dependencies..."
npm install

# Generate Prisma Client
echo ""
echo "Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo ""
echo "Running database migrations..."
npm run migrate

echo "✅ Backend setup complete!"

# Setup Client
echo ""
echo "=========================================="
echo "Setting up Frontend Client"
echo "=========================================="
cd ../client || exit

# Install dependencies
echo ""
echo "Installing client dependencies..."
npm install

echo "✅ Frontend setup complete!"

echo ""
echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd client"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "4. Register or login to start using TaskFlow Lite!"
echo ""
