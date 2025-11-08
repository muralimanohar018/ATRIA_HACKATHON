#!/bin/bash
# Auto-Integration Script - Backend First, Then Frontend

set -e

echo "🚀 AUTO-INTEGRATION: Backend First, Then Frontend"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Verify Backend
echo -e "${BLUE}STEP 1: VERIFYING BACKEND${NC}"
echo "---------------------------"
python3 verify_backend.py
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend verification failed${NC}"
    echo "Please fix backend issues first"
    exit 1
fi
echo -e "${GREEN}✅ Backend verified${NC}"
echo ""

# Step 2: Setup Backend
echo -e "${BLUE}STEP 2: SETTING UP BACKEND${NC}"
echo "---------------------------"

cd backend

# Create venv if needed
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null

# Install dependencies
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Create .env if needed
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Created .env - please edit with your values${NC}"
    else
        cat > .env << EOF
SECRET_KEY=dev-secret-key-change-in-production
DB_URL=sqlite:///app.db
PORT=5001
HF_API_KEY=
SENDER_EMAIL=
SENDER_PASSWORD=
COMPANY_NAME=Mastersolis Infotech
EOF
        echo -e "${YELLOW}⚠️  Created .env - please edit with your values${NC}"
    fi
fi

cd ..

# Step 3: Setup Frontend
echo ""
echo -e "${BLUE}STEP 3: SETTING UP FRONTEND${NC}"
echo "---------------------------"

cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Updating frontend dependencies..."
    npm install
fi

# Install jspdf
echo "Installing jspdf..."
npm install jspdf

# Create .env if needed
if [ ! -f ".env" ]; then
    cat > .env << EOF
VITE_API_BASE=http://localhost:5001
EOF
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
fi

cd ..

# Step 4: Integration Summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ AUTO-INTEGRATION COMPLETE!${NC}"
echo "=================================================="
echo ""
echo "Backend Configuration:"
echo "  - Port: 5001"
echo "  - Database: SQLite (auto-created)"
echo "  - Routes: 25 endpoints"
echo ""
echo "Frontend Configuration:"
echo "  - Port: 5173 (or next available)"
echo "  - API Base: http://localhost:5001"
echo "  - PDF Generation: Ready"
echo ""
echo "Next Steps:"
echo "1. Edit backend/.env with your values (optional)"
echo "2. Start backend: ./start-backend.sh"
echo "3. Start frontend: ./start-frontend.sh (new terminal)"
echo "4. Access: http://localhost:5173"
echo ""
echo "Verification:"
echo "  - Backend: python3 verify_backend.py"
echo "  - Integration: python3 verify_integration.py (after starting servers)"
echo ""

