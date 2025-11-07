# 🔧 Quick Fix for Errors

## Error 1: Frontend - jsPDF "canvg" Error

**Fix:**
```bash
# Step 1: Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Step 2: Install canvg
cd frontend
npm install canvg html2canvas

# Step 3: Start frontend
npm run dev
```

**OR** if you have permission issues:
```bash
# Fix permissions first
./fix_npm_permissions.sh

# Then install
cd frontend
npm install canvg html2canvas
npm run dev
```

---

## Error 2: Backend - Import Error

**Fix:**
```bash
# ALWAYS run from project root, NOT from backend directory
cd /Users/muralimanoharmga/Desktop/cursor

# Option 1: Use start script (RECOMMENDED)
./start-backend.sh

# Option 2: Run directly
python -m backend.app

# Option 3: Use run.py
python backend/run.py
```

**DO NOT run:**
```bash
cd backend
python app.py  # ❌ This will fail!
```

---

## ✅ Complete Fix Steps

### 1. Fix npm Permissions
```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install canvg html2canvas
```

### 3. Start Backend (from project root)
```bash
cd /Users/muralimanoharmga/Desktop/cursor
./start-backend.sh
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

---

## ✅ All Fixed!

1. ✅ Frontend canvg error - FIXED (install canvg)
2. ✅ Backend import error - FIXED (run from project root)

---

**Everything should work now!** 🚀

