#!/bin/bash

echo "=========================================="
echo "   🔧 FIXING ALL ISSUES"
echo "=========================================="
echo ""

# Kill existing processes
echo "1️⃣  Stopping existing processes..."
pkill -f "python.*backend" 2>/dev/null
pkill -f "flask" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Start backend
echo ""
echo "2️⃣  Starting backend..."
cd "$(dirname "$0")"
cd backend
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, creating default..."
    cat > .env << EOF
SECRET_KEY=dev-secret-key-change-in-production
SUPABASE_DB_URL=postgresql://postgres:[EtemJ7dxLnuOq6BN]@db.ydrzdxgaqftrrjtrcuiq.supabase.co:5432/postgres
HF_API_KEY=
SENDER_EMAIL=
SENDER_PASSWORD=
COMPANY_NAME=Mastersolis Infotech
PORT=5001
EOF
fi

# Install dependencies if needed
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -q -r requirements.txt
else
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d ".venv" ]; then
        source .venv/bin/activate
    fi
fi

# Start backend in background
cd ..
python3 -m backend.app > /tmp/backend_fix.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
done

# Start frontend
echo ""
echo "3️⃣  Starting frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --silent
fi

npm run dev > /tmp/frontend_fix.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

# Wait a bit
sleep 3

echo ""
echo "=========================================="
echo "   ✅ FIXES APPLIED"
echo "=========================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "📋 Check logs:"
echo "   Backend: tail -f /tmp/backend_fix.log"
echo "   Frontend: tail -f /tmp/frontend_fix.log"
echo ""
echo "✅ Everything should be working now!"

