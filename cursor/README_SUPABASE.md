# 🗄️ Supabase Database Setup - Quick Guide

## ✅ What's Been Configured

Your backend is now ready to use Supabase PostgreSQL! Here's what's been set up:

1. ✅ PostgreSQL driver (`psycopg2-binary`) added to requirements
2. ✅ Database configuration updated to support Supabase
3. ✅ Automatic fallback to SQLite if Supabase not configured
4. ✅ Connection pooling and error handling configured

---

## 🚀 Quick Setup (Choose One Method)

### Method 1: Automated Script (Recommended)

```bash
python3 configure_supabase.py
```

This will:
- Ask for your Supabase connection string
- Update `backend/.env` automatically
- Install PostgreSQL driver
- Configure everything

### Method 2: Manual Setup

#### Step 1: Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Copy the **URI** connection string

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Or direct connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Step 2: Update `.env` File

Edit `backend/.env` and add:

```env
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Replace:**
- `[YOUR-PASSWORD]` with your database password
- `[PROJECT-REF]` with your Supabase project reference

#### Step 3: Install PostgreSQL Driver

```bash
cd backend
source .venv/bin/activate  # or .venv/Scripts/activate on Windows
pip install psycopg2-binary
```

#### Step 4: Restart Backend

```bash
./start-backend.sh
```

---

## ✅ Verify Connection

After setup, verify everything works:

```bash
python3 view_database.py
```

You should see:
```
🗄️  Database Type: Supabase PostgreSQL
✅ Connected to cloud database
📊 All data is stored in Supabase
```

---

## 📋 Example Connection String

Here's what a real connection string looks like:

```env
SUPABASE_DB_URL=postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Components:**
- `postgres` - Username
- `abcdefghijklmnop` - Project reference
- `MySecurePassword123` - Your database password
- `us-east-1` - Region
- `6543` - Port (pooler) or `5432` (direct)
- `postgres` - Database name

---

## 🔧 How It Works

1. **Priority Order:**
   - If `SUPABASE_DB_URL` is set → Use Supabase
   - Else if `DB_URL` is set → Use custom database
   - Else → Use SQLite (default for development)

2. **Automatic Table Creation:**
   - Tables are created automatically on first run
   - No migration needed!

3. **Connection Pooling:**
   - Configured for PostgreSQL
   - Automatic reconnection on errors

---

## 🆘 Troubleshooting

### Error: "psycopg2 not found"
```bash
cd backend
source .venv/bin/activate
pip install psycopg2-binary
```

### Error: "Connection refused"
- Check your connection string format
- Verify password is correct
- Ensure Supabase project is active

### Error: "Database does not exist"
- Supabase creates `postgres` database by default
- Use `postgres` as database name in connection string

---

## 📝 Next Steps

Once connected:
1. ✅ All data will be stored in Supabase
2. ✅ Accessible from anywhere
3. ✅ Automatic backups (Supabase feature)
4. ✅ Can view data in Supabase Dashboard

---

**Ready to connect! Just provide your Supabase connection string!** 🚀

