# 🚀 Run Application - Complete Guide

## ✅ Current Status

**Both services are running!**

- ✅ **Backend**: http://localhost:5001
- ✅ **Frontend**: http://localhost:5173
- ✅ **Database**: Supabase PostgreSQL

---

## 🎯 Quick Start

### Option 1: Services Already Running
If services are already running, just open:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

### Option 2: Start Services Manually

#### Start Backend
```bash
cd /Users/muralimanoharmga/Desktop/cursor
./start-backend.sh
```

#### Start Frontend
```bash
cd /Users/muralimanoharmga/Desktop/cursor/frontend
npm run dev
```

---

## 📋 Features Working

### ✅ PDF Generation
1. **Resume Builder** (http://localhost:5173/resume-builder)
   - Fill in resume data
   - Click "Download PDF Resume"
   - PDF downloads with AI-enhanced content

2. **Careers Page** (http://localhost:5173/careers)
   - Select a job
   - Fill application form
   - Click "Generate PDF Resume"
   - PDF downloads before submitting

### ✅ Database
- All data stored in Supabase PostgreSQL
- Tables: Job, Application, BlogPost, AdminUser
- Accessible from anywhere

### ✅ All Pages
- Home Page
- About Page
- Services Page
- Projects Page
- Contact Page
- Careers Page (with PDF generation)
- Resume Builder (with PDF generation)
- Blog Page
- Admin Dashboard
- Login Page

---

## 🧪 Testing PDF Generation

### Test 1: Resume Builder
1. Go to http://localhost:5173/resume-builder
2. Fill in:
   - Name, Email, Phone
   - Summary
   - Experience (at least one)
   - Skills
3. Click "Download PDF Resume"
4. ✅ PDF should download

### Test 2: Careers Page
1. Go to http://localhost:5173/careers
2. Click "Apply" on any job
3. Fill in:
   - Name, Email, Phone
   - Resume Text
4. Click "Generate PDF Resume"
5. ✅ PDF should download

---

## 🔧 Troubleshooting

### Backend Not Running
```bash
cd /Users/muralimanoharmga/Desktop/cursor
./start-backend.sh
```

### Frontend Not Running
```bash
cd /Users/muralimanoharmga/Desktop/cursor/frontend
npm run dev
```

### PDF Generation Not Working
1. Check backend is running: http://localhost:5001/health
2. Check browser console for errors
3. Verify jspdf is installed: `cd frontend && npm list jspdf`

### Database Connection Issues
- Check `backend/.env` has `SUPABASE_DB_URL` set
- Verify Supabase connection string is correct
- Run: `python3 view_database.py`

---

## 📊 Services Status

### Check Backend
```bash
curl http://localhost:5001/health
```

### Check Frontend
```bash
curl http://localhost:5173
```

### Check Database
```bash
python3 view_database.py
```

---

## 🎉 Everything is Ready!

- ✅ Backend running on port 5001
- ✅ Frontend running on port 5173
- ✅ Database connected to Supabase
- ✅ PDF generation working
- ✅ All features functional

**Open http://localhost:5173 to start using the application!** 🚀

