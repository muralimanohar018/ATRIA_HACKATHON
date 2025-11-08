# 🚀 Commands to Run the Application

## Quick Start (Recommended)

### Option 1: Use Start Scripts (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd /Users/muralimanoharmga/Desktop/cursor
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
cd /Users/muralimanoharmga/Desktop/cursor
./start-frontend.sh
```

---

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd /Users/muralimanoharmga/Desktop/cursor/backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/muralimanoharmga/Desktop/cursor/frontend
npm install  # First time only
npm run dev
```

---

### Option 3: All-in-One Script (Single Terminal)

```bash
cd /Users/muralimanoharmga/Desktop/cursor
./run.sh
```

This runs both servers in the background. Press `Ctrl+C` to stop both.

---

## First-Time Setup (If Needed)

### Install Frontend Dependencies
```bash
cd frontend
npm install
npm install jspdf  # For PDF resume generation
```

### Install Backend Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Create Environment Files
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend (optional)
cp .env.example frontend/.env
```

---

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Login Page**: http://localhost:5173/login
- **Admin Dashboard**: http://localhost:5173/admin (requires login)
- **Resume Builder**: http://localhost:5173/resume-builder

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port 5173 is in use
lsof -i :5173

# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues (npm)
```bash
sudo chown -R $(whoami) ~/.npm
```

---

## Development Commands

### Backend
- Start: `python app.py`
- Port: 5001 (configurable in `.env`)

### Frontend
- Start: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Port: 5173 (Vite default)

---

## Environment Variables

### Backend (.env)
```env
PORT=5001
SECRET_KEY=your-secret-key
DB_URL=sqlite:///app.db
HF_API_KEY=your-hf-key (optional)
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
COMPANY_NAME=Mastersolis Infotech
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:5001
```

---

## Quick Reference

| Service | Port | Command |
|---------|------|---------|
| Backend | 5001 | `python app.py` |
| Frontend | 5173 | `npm run dev` |

---

**That's it! Your application should be running now! 🎉**

