#!/bin/bash
# Setup Supabase Database Connection

echo "🗄️  SUPABASE DATABASE SETUP"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env from .env.example"
    else
        echo "❌ backend/.env.example not found"
        exit 1
    fi
fi

echo ""
echo "📋 Please provide your Supabase connection details:"
echo ""
echo "1. Go to Supabase Dashboard → Settings → Database"
echo "2. Copy the Connection string (URI format)"
echo "3. It should look like:"
echo "   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
echo ""

read -p "Enter your Supabase DB URL (or press Enter to skip): " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  Skipping Supabase setup. Using SQLite instead."
    exit 0
fi

# Update .env file
cd backend

# Check if SUPABASE_DB_URL already exists
if grep -q "SUPABASE_DB_URL" .env; then
    # Update existing
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|SUPABASE_DB_URL=.*|SUPABASE_DB_URL=$SUPABASE_URL|" .env
    else
        # Linux
        sed -i "s|SUPABASE_DB_URL=.*|SUPABASE_DB_URL=$SUPABASE_URL|" .env
    fi
    echo "✅ Updated SUPABASE_DB_URL in .env"
else
    # Add new
    echo "" >> .env
    echo "# Supabase Database" >> .env
    echo "SUPABASE_DB_URL=$SUPABASE_URL" >> .env
    echo "✅ Added SUPABASE_DB_URL to .env"
fi

cd ..

# Install psycopg2-binary
echo ""
echo "📦 Installing PostgreSQL driver..."
cd backend
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null
pip install -q psycopg2-binary
cd ..

echo ""
echo "✅ Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart backend: ./start-backend.sh"
echo "2. Verify connection: python3 view_database.py"
echo ""

