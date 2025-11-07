# 📊 YOUR BACKEND DATA LOCATION

## ✅ Database Location

### Your Data is Saved In:
**Primary Location**: `backend/instance/app.db`  
**Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db`  
**Size**: 36 KB  
**Status**: ✅ Active

### Alternative Location:
**Secondary**: `instance/app.db`  
**Full Path**: `/Users/muralimanoharmga/Desktop/cursor/instance/app.db`  
**Size**: 36 KB

---

## 📍 Where Your Data Is Saved

### Active Database
```
/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db
```

### Relative Path
```
backend/instance/app.db
```

---

## 🔍 View Your Data

### Option 1: Use View Script (Easiest)
```bash
cd /Users/muralimanoharmga/Desktop/cursor
python3 view_database.py
```

This shows:
- Database location
- File size
- Number of jobs
- Number of applications
- Number of blog posts
- Number of admin users

### Option 2: SQLite Command Line
```bash
cd /Users/muralimanoharmga/Desktop/cursor
sqlite3 backend/instance/app.db

# Commands:
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
- Browse all tables and data visually

---

## 📋 What Data is Stored

### Tables in Database
1. **job** - Job postings
   - id, title, description, location, created_at

2. **application** - Job applications
   - id, name, email, phone, resume_text, job_id, ai_match, status, created_at

3. **blog_post** - Blog posts
   - id, title, content, summary, seo_description, created_at

4. **testimonial** - Testimonials
   - id, raw_text, polished_text, author, created_at

5. **case_study** - Case studies
   - id, content, ai_analysis, created_at

6. **admin_user** - Admin users
   - id, username, email, password_hash, created_at

---

## 🔧 Quick Commands

### View Database Location & Contents
```bash
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

### View All Jobs
```bash
sqlite3 backend/instance/app.db "SELECT * FROM job;"
```

### View All Applications
```bash
sqlite3 backend/instance/app.db "SELECT * FROM application;"
```

### Count Records
```bash
sqlite3 backend/instance/app.db "SELECT COUNT(*) FROM job; SELECT COUNT(*) FROM application; SELECT COUNT(*) FROM blog_post;"
```

---

## 📊 Database Statistics

### Current Status
- **Location**: `backend/instance/app.db`
- **Size**: 36 KB
- **Tables**: 6 tables created
- **Data**: Ready to store data

---

## ✅ Summary

**Your backend data is saved in:**
- **Location**: `backend/instance/app.db`
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/instance/app.db`
- **Size**: 36 KB
- **Status**: ✅ Active and ready

**To view your data:**
```bash
python3 view_database.py
```

---

**Your data is safe and stored in: `backend/instance/app.db`** 📊

