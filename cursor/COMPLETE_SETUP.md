# 🚀 Complete Setup Guide - Backend First, Then Frontend Integration

## Step 1: Backend Setup & Verification

### 1.1 Install Backend Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 1.2 Configure Backend Environment
```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your values:
# - SECRET_KEY (any random string)
# - SENDER_EMAIL (your Gmail)
# - SENDER_PASSWORD (Gmail app password)
# - HF_API_KEY (optional)
```

### 1.3 Test Backend
```bash
cd backend
source .venv/bin/activate
python app.py
```

**Verify Backend is Running:**
```bash
curl http://localhost:5001/health
```

Should return: `{"success": true, "data": {"service": "AI Backend"}}`

### 1.4 Test All Backend Endpoints
```bash
# Health check
curl http://localhost:5001/health

# List jobs
curl http://localhost:5001/jobs

# Test AI endpoint
curl -X POST http://localhost:5001/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text"}'

# Test blog creation
curl -X POST http://localhost:5001/blogs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

---

## Step 2: Frontend Setup & Integration

### 2.1 Install Frontend Dependencies
```bash
cd frontend
npm install
npm install jspdf  # For PDF resume generation
```

### 2.2 Configure Frontend Environment
```bash
# Copy example env file
cp .env.example frontend/.env

# Or create frontend/.env with:
# VITE_API_BASE=http://localhost:5001
```

### 2.3 Verify Frontend Integration
```bash
cd frontend
npm run dev
```

**Check Frontend:**
- Open http://localhost:5173 (or port shown in terminal)
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls

---

## Step 3: Auto-Integration Script

### 3.1 Run Complete Setup Script
```bash
# Make scripts executable
chmod +x setup.sh
chmod +x start-backend.sh
chmod +x start-frontend.sh

# Run setup
./setup.sh
```

### 3.2 Start Both Servers
**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

---

## Step 4: Verify Integration

### 4.1 Test Frontend → Backend Connection
1. Open http://localhost:5173
2. Go to Careers page
3. Try to apply for a job
4. Check browser console for API calls
5. Check backend terminal for requests

### 4.2 Test All Features
- ✅ Home page loads
- ✅ Jobs list loads
- ✅ Apply for job works
- ✅ Blog creation works
- ✅ Resume Builder generates PDF
- ✅ Admin login works
- ✅ All pages accessible

---

## Step 5: Common Integration Issues

### Issue: CORS Errors
**Solution:** Backend already has CORS enabled. If errors persist:
```python
# backend/app.py already has:
CORS(app, supports_credentials=True)
```

### Issue: API Calls Failing
**Solution:** Check:
1. Backend is running on port 5001
2. Frontend .env has correct API_BASE
3. No firewall blocking requests

### Issue: Import Errors
**Solution:** Make sure you're running from project root:
```bash
# Correct way:
cd /Users/muralimanoharmga/Desktop/cursor
python -m backend.app

# NOT:
cd backend
python app.py
```

---

## Step 6: Production Checklist

### Backend
- [ ] Set proper SECRET_KEY
- [ ] Configure production database (PostgreSQL)
- [ ] Set SESSION_COOKIE_SECURE=True (with HTTPS)
- [ ] Configure proper CORS origins
- [ ] Set up environment variables

### Frontend
- [ ] Update VITE_API_BASE to production URL
- [ ] Build production bundle: `npm run build`
- [ ] Test all API endpoints
- [ ] Verify PDF generation works

---

## Quick Start Commands

```bash
# 1. Setup (one time)
./setup.sh

# 2. Start Backend
./start-backend.sh

# 3. Start Frontend (new terminal)
./start-frontend.sh

# 4. Access
# Frontend: http://localhost:5173
# Backend: http://localhost:5001
```

---

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check works: `curl http://localhost:5001/health`
- [ ] Frontend can call backend APIs
- [ ] No CORS errors in browser console
- [ ] All pages load correctly
- [ ] PDF generation works
- [ ] Blog creation works
- [ ] Job application works

---

**Everything should now be integrated and working!** 🎉

