# 🚀 Quick Start Guide

## Automated Setup (Recommended)

### For macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

This will automatically:
- ✅ Create `.env` files from examples
- ✅ Set up Python virtual environment
- ✅ Install backend dependencies
- ✅ Install frontend dependencies

## Manual Setup

### 1. Create Environment Files

**Backend:**
```bash
cp backend/.env.example backend/.env
```

**Frontend:**
```bash
cp .env.example .env
```

### 2. Start Backend
```bash
./start-backend.sh
```
Or manually:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 3. Start Frontend (in a new terminal)
```bash
./start-frontend.sh
```
Or manually:
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

## Environment Variables

### Backend (`backend/.env`)
- `SECRET_KEY`: Flask secret (change in production)
- `DB_URL`: Database URL (sqlite:///app.db for local)
- `HF_API_KEY`: Hugging Face API key (optional)
- `SENDER_EMAIL`: Gmail for sending emails (optional)
- `SENDER_PASSWORD`: Gmail app password (optional)
- `COMPANY_NAME`: Company name
- `PORT`: Server port (default: 5001)

### Frontend (`.env`)
- `VITE_API_BASE`: Backend API URL (http://localhost:5001)

## Notes

- Email features require Gmail App Password (not regular password)
- AI features work with fallbacks if `HF_API_KEY` is not set
- Database is SQLite by default (created automatically on first run)

