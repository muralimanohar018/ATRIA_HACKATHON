# 📊 YOUR BACKEND DATA LOCATION

## ✅ Database Files Found

Your backend data is saved in **TWO locations**:

### 1. Primary Database (Active)
- **Location**: `backend/instance/app.db`
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db`
- **Size**: 36 KB
- **Status**: ✅ Active (contains your data)

### 2. Secondary Database
- **Location**: `instance/app.db`
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/instance/app.db`
- **Size**: 36 KB
- **Status**: May also contain data

---

## 📍 Where Your Data Is Saved

### Active Database Location
```
/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db
```

### Relative Path
```
backend/instance/app.db
```

---

## 🔍 View Your Data

### Option 1: Use View Script
```bash
cd /Users/muralimanoharmga/Desktop/cursor
python3 view_database.py
```

### Option 2: SQLite Command Line
```bash
cd /Users/muralimanoharmga/Desktop/cursor
sqlite3 backend/instance/app.db

# Then run:
.tables                    # List all tables
SELECT * FROM job;         # View all jobs
SELECT * FROM application; # View all applications
SELECT * FROM blog_post;   # View all blogs
SELECT * FROM admin_user;  # View admin users
.quit                      # Exit
```

### Option 3: Database Browser
- Download DB Browser for SQLite
- Open: `/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db`
- Browse all tables and data

---

## 📋 What Data is Stored

### Tables in Database
1. **job** - Job postings
2. **application** - Job applications (with resume text and AI match scores)
3. **blog_post** - Blog posts (with AI summaries)
4. **testimonial** - Testimonials
5. **case_study** - Case studies
6. **admin_user** - Admin users

---

## 🔧 Quick Commands

### View Database Location
```bash
cd /Users/muralimanoharmga/Desktop/cursor
python3 view_database.py
```

### View Database Size
```bash
ls -lh backend/instance/app.db
```

### Backup Database
```bash
cp backend/instance/app.db backend/instance/app.db.backup
```

### View All Data
```bash
sqlite3 backend/instance/app.db "SELECT * FROM job; SELECT * FROM application;"
```

---

## 📊 Database Statistics

### View All Data
```bash
python3 view_database.py
```

This shows:
- Database location
- File size
- Number of jobs
- Number of applications
- Number of blog posts
- Number of admin users

---

## ✅ Summary

**Your backend data is saved in:**
- **Primary**: `backend/instance/app.db` ✅
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db`

**To view your data:**
```bash
python3 view_database.py
```

---

**Your data is safe and stored in: `backend/instance/app.db`** 📊

