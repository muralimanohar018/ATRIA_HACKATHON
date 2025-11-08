# 📊 Backend Database Location

## Database Storage

### SQLite Database
- **Type**: SQLite (default for development)
- **Location**: `backend/app.db` (relative to project root)
- **Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/app.db`

### Database Configuration
- **Config File**: `backend/config.py`
- **Environment Variable**: `DB_URL` (in `backend/.env`)
- **Default**: `sqlite:///app.db` (creates `app.db` in backend directory)

---

## 📁 Database File Location

### Default Location
```
/Users/muralimanoharmga/Desktop/cursor/backend/app.db
```

### How to Find It
```bash
# From project root
cd /Users/muralimanoharmga/Desktop/cursor
ls -lah backend/app.db

# Or check if it exists
find . -name "app.db"
```

---

## 📋 What Data is Stored

### Tables in Database
1. **Job** - Job postings
2. **Application** - Job applications
3. **BlogPost** - Blog posts
4. **Testimonial** - Testimonials
5. **CaseStudy** - Case studies
6. **AdminUser** - Admin users

---

## 🔍 How to View Database

### Option 1: SQLite Command Line
```bash
cd /Users/muralimanoharmga/Desktop/cursor/backend
sqlite3 app.db

# Then run SQL commands:
.tables          # List all tables
SELECT * FROM job;  # View jobs
SELECT * FROM application;  # View applications
SELECT * FROM blog_post;  # View blogs
.quit            # Exit
```

### Option 2: Python Script
```python
from backend.database import db
from backend.models.core import Job, Application, BlogPost
from backend.app import create_app

app = create_app()
with app.app_context():
    jobs = Job.query.all()
    applications = Application.query.all()
    blogs = BlogPost.query.all()
    
    print(f"Jobs: {len(jobs)}")
    print(f"Applications: {len(applications)}")
    print(f"Blogs: {len(blogs)}")
```

### Option 3: Database Browser Tool
- Download DB Browser for SQLite
- Open `backend/app.db`
- View all tables and data

---

## 🔧 Change Database Location

### Update `.env` File
```env
# In backend/.env
DB_URL=sqlite:///path/to/your/database.db

# Or use PostgreSQL for production
DB_URL=postgresql://user:password@localhost/dbname
```

---

## 📊 Database Schema

### Job Table
- id (Integer, Primary Key)
- title (String)
- description (Text)
- location (String)
- created_at (DateTime)

### Application Table
- id (Integer, Primary Key)
- name (String)
- email (String)
- phone (String)
- resume_text (Text)
- job_id (Integer, Foreign Key)
- ai_match (JSON)
- status (String)
- created_at (DateTime)

### BlogPost Table
- id (Integer, Primary Key)
- title (String)
- content (Text)
- summary (Text)
- seo_description (String)
- created_at (DateTime)

### AdminUser Table
- id (Integer, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password_hash (String)
- created_at (DateTime)

---

## ✅ Quick Commands

### Check Database Location
```bash
cd /Users/muralimanoharmga/Desktop/cursor
python3 -c "from backend.config import Config; print(Config.SQLALCHEMY_DATABASE_URI)"
```

### View Database Size
```bash
ls -lh backend/app.db
```

### Backup Database
```bash
cp backend/app.db backend/app.db.backup
```

### Reset Database (⚠️ Deletes all data)
```bash
rm backend/app.db
# Database will be recreated on next app start
```

---

## 📍 Current Database Location

**File**: `backend/app.db`  
**Full Path**: `/Users/muralimanoharmga/Desktop/cursor/backend/app.db`

---

**Your backend data is saved in: `backend/app.db`** 📊

