#!/bin/bash

echo "🚀 Setting up Mastersolis Infotech Project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create .env file if it doesn't exist
create_env_file() {
    local env_file=$1
    local example_file=$2
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$example_file" ]; then
            cp "$example_file" "$env_file"
            echo -e "${GREEN}✅ Created $env_file${NC}"
        else
            echo -e "${YELLOW}⚠️  $example_file not found, skipping...${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  $env_file already exists, skipping...${NC}"
    fi
}

# Create backend .env file
echo "📝 Creating backend environment file..."
create_env_file "backend/.env" "backend/.env.example"

# Create frontend .env file
echo "📝 Creating frontend environment file..."
create_env_file ".env" ".env.example"

# Setup backend
echo ""
echo "🐍 Setting up Python backend..."
cd backend

if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

echo "Activating virtual environment..."
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null

echo "Installing Python dependencies..."
pip install -q -r requirements.txt

cd ..

# Setup frontend
echo ""
echo "📦 Setting up Node.js frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "Node modules already installed, skipping..."
fi

cd ..

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "To start the backend:"
echo "  cd backend && source .venv/bin/activate && python app.py"
echo ""
echo "To start the frontend (in a new terminal):"
echo "  cd frontend && npm run dev"
echo ""
echo "Or use the convenience scripts:"
echo "  ./start-backend.sh"
echo "  ./start-frontend.sh"

