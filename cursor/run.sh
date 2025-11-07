#!/bin/bash
# Run both backend and frontend

echo "🚀 Starting Mastersolis Application..."
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env"
    fi
fi

if [ ! -f "frontend/.env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example frontend/.env
        echo "✅ Created frontend/.env"
    fi
fi

# Start backend in background
echo "📦 Starting Backend Server..."
cd backend
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null
pip install -q -r requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Application is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

