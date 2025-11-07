# 📊 Backend Database Location & Information

## 📍 Database Location

### SQLite Database File
- **Default Location**: `instance/app.db` (Flask default)
- **Alternative**: `backend/app.db` (if configured)
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/instance/app.db`

### How Flask Creates Database
Flask creates the database in the `instance` directory by default when using relative paths like `sqlite:///app.db`.

---

## 🔍 Find Your Database

### Check Current Location
```bash
cd /Users/muralimanoharmga/Desktop/cursor

# Check instance directory
ls -lah instance/app.db

# Or check backend directory
ls -lah backend/app.db

# Or find all .db files
find . -name "*.db" -type f
```

### View Database Contents
```bash
# Use the view script
python3 view_database.py

# Or use SQLite directly
sqlite3 instance/app.db
.tables
SELECT * FROM job;
SELECT * FROM application;
.quit
```

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

## 🔧 View Database

### Option 1: Python Script
```bash
python3 view_database.py
```

### Option 2: SQLite Command Line
```bash
sqlite3 instance/app.db

# Commands:
.tables              # List all tables
.schema job          # Show job table structure
SELECT * FROM job;   # View all jobs
SELECT * FROM application;  # View all applications
SELECT COUNT(*) FROM application;  # Count applications
.quit                # Exit
```

### Option 3: Database Browser
- Download DB Browser for SQLite
- Open `instance/app.db`
- Browse all tables and data

---

## 📊 Database Statistics

### View Database Info
```bash
python3 view_database.py
```

This will show:
- Database location
- File size
- Number of jobs
- Number of applications
- Number of blog posts
- Number of admin users

---

## 🔧 Change Database Location

### Update `.env` File
```env
# In backend/.env
# Use absolute path
DB_URL=sqlite:////Users/muralimanoharmga/Desktop/cursor/backend/app.db

# Or use relative path (creates in instance directory)
DB_URL=sqlite:///app.db

# Or use PostgreSQL for production
DB_URL=postgresql://user:password@localhost/dbname
```

---

## 📁 Database File Location

### Default (Flask Instance Directory)
```
/Users/muralimanoharmga/Desktop/cursor/instance/app.db
```

### If Configured in .env
```
/Users/muralimanoharmga/Desktop/cursor/backend/app.db
```

---

## ✅ Quick Commands

### View Database Location
```bash
python3 view_database.py
```

### View Database Size
```bash
ls -lh instance/app.db
```

### Backup Database
```bash
cp instance/app.db instance/app.db.backup
```

### View All Data
```bash
python3 view_database.py
```

---

## 📊 Current Database Status

**Location**: `instance/app.db` (Flask default)  
**Full Path**: `/Users/muralimanoharmga/Desktop/cursor/instance/app.db`

---

**Your backend data is saved in: `instance/app.db`** 📊

