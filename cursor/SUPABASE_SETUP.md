# 🗄️ Supabase Database Setup

## 📋 How to Connect to Supabase

### Step 1: Get Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find **Connection string** section
4. Copy the **URI** connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Step 2: Update Backend Configuration

Edit `backend/.env` file:

```env
# Replace with your Supabase connection string
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Example:**
```env
SUPABASE_DB_URL=postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Step 3: Install PostgreSQL Driver

```bash
cd backend
source .venv/bin/activate
pip install psycopg2-binary
```

### Step 4: Restart Backend

```bash
# Stop current backend (Ctrl+C)
# Then restart
./start-backend.sh
```

---

## ✅ Verification

### Check Database Connection
```bash
# Test connection
python3 -c "from backend.app import create_app; from backend.config import Config; app = create_app(); print(f'Database: {Config.SQLALCHEMY_DATABASE_URI[:50]}...')"
```

### View Database Location
```bash
python3 view_database.py
```

---

## 🔧 Connection String Format

### Supabase Connection String
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Components:
- **postgres** - Username
- **[PROJECT-REF]** - Your Supabase project reference
- **[PASSWORD]** - Your database password
- **[REGION]** - Your Supabase region (e.g., us-east-1)
- **6543** - Port (pooler) or **5432** (direct)
- **postgres** - Database name

---

## 📝 Environment Variables

### In `backend/.env`:
```env
# Supabase PostgreSQL Connection
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Optional: Supabase API
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

---

## 🚀 Migration from SQLite to Supabase

### Option 1: Fresh Start (Recommended)
1. Set `SUPABASE_DB_URL` in `.env`
2. Restart backend
3. Database tables will be created automatically in Supabase

### Option 2: Migrate Existing Data
1. Export data from SQLite
2. Import to Supabase
3. Update connection string

---

## ✅ After Setup

1. ✅ Database will be stored in Supabase
2. ✅ All tables created automatically
3. ✅ Data persists in cloud
4. ✅ Accessible from anywhere

---

**Once you provide your Supabase connection string, I'll help you configure it!** 🚀

