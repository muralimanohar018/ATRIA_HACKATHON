#!/bin/bash
# Complete Setup Script - Backend First, Then Frontend Integration

set -e  # Exit on error

echo "🚀 COMPLETE SETUP - Backend First, Then Frontend Integration"
echo "============================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Backend Setup
echo -e "${GREEN}STEP 1: BACKEND SETUP${NC}"
echo "---------------------------"

# Check Python
echo "1.1 Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✅ Python ${PYTHON_VERSION} found${NC}"

# Create backend venv
echo ""
echo "1.2 Setting up backend virtual environment..."
cd backend
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠️  Virtual environment already exists${NC}"
fi

# Activate venv
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null

# Install dependencies
echo ""
echo "1.3 Installing backend dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Create .env if not exists
echo ""
echo "1.4 Setting up backend environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit backend/.env with your values${NC}"
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
        echo -e "${GREEN}✅ Created .env file${NC}"
        echo -e "${YELLOW}⚠️  Please edit backend/.env with your values${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env already exists${NC}"
fi

# Verify backend
echo ""
echo "1.5 Verifying backend..."
cd ..
python3 verify_backend.py
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend verification passed${NC}"
else
    echo -e "${RED}❌ Backend verification failed${NC}"
    exit 1
fi

# Step 2: Frontend Setup
echo ""
echo -e "${GREEN}STEP 2: FRONTEND SETUP${NC}"
echo "---------------------------"

# Check Node
echo "2.1 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node ${NODE_VERSION} found${NC}"

# Check npm
echo ""
echo "2.2 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm ${NPM_VERSION} found${NC}"

# Install frontend dependencies
echo ""
echo "2.3 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules already exists, updating...${NC}"
    npm install
fi

# Install jspdf
echo ""
echo "2.4 Installing jspdf for PDF generation..."
npm install jspdf
echo -e "${GREEN}✅ jspdf installed${NC}"

# Create frontend .env
echo ""
echo "2.5 Setting up frontend environment..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
VITE_API_BASE=http://localhost:5001
EOF
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env already exists${NC}"
fi

cd ..

# Step 3: Integration Verification
echo ""
echo -e "${GREEN}STEP 3: INTEGRATION VERIFICATION${NC}"
echo "---------------------------"

echo ""
echo "3.1 Testing integration..."
echo -e "${YELLOW}⚠️  Note: This requires both servers to be running${NC}"
echo "   Start backend: cd backend && source .venv/bin/activate && python app.py"
echo "   Start frontend: cd frontend && npm run dev"
echo "   Then run: python3 verify_integration.py"

# Summary
echo ""
echo "============================================================"
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Start backend: ./start-backend.sh"
echo "3. Start frontend: ./start-frontend.sh (in new terminal)"
echo "4. Access: http://localhost:5173"
echo ""
echo "Verification:"
echo "- Backend: python3 verify_backend.py"
echo "- Integration: python3 verify_integration.py (after starting servers)"
echo ""

