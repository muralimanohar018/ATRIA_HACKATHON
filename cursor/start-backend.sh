#!/bin/bash
# Start backend server

# Auto-create .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env from .env.example"
    fi
fi

cd backend

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null

# Install dependencies
pip install -q -r requirements.txt

# Run app (from project root to avoid import errors)
cd ..
echo "🚀 Starting backend server on port 5001..."
python -m backend.app

