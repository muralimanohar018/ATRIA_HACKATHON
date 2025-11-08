#!/bin/bash

echo "=========================================="
echo "   🔄 CLEAN RESTART"
echo "=========================================="

# Kill everything
echo "1. Killing all processes..."
pkill -9 -f "python.*backend" 2>/dev/null
pkill -9 -f "flask" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
sleep 3

# Start backend
echo ""
echo "2. Starting backend..."
cd "$(dirname "$0")"
cd backend

if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

cd ..
python3 -m backend.app > /tmp/backend_clean.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend PID: $BACKEND_PID"

# Wait for backend
echo "⏳ Waiting for backend..."
for i in {1..15}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
done

# Start frontend
echo ""
echo "3. Starting frontend..."
cd frontend
npm run dev > /tmp/frontend_clean.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend PID: $FRONTEND_PID"

sleep 3

echo ""
echo "=========================================="
echo "   ✅ RESTARTED"
echo "=========================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "📋 Logs:"
echo "   Backend: tail -f /tmp/backend_clean.log"
echo "   Frontend: tail -f /tmp/frontend_clean.log"
echo ""

