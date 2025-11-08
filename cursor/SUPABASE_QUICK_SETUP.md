# 🗄️ Quick Supabase Setup

## 🚀 Quick Setup

### Option 1: Automated Setup Script
```bash
./setup_supabase.sh
```

This will:
1. Ask for your Supabase connection string
2. Update `backend/.env` automatically
3. Install PostgreSQL driver
4. Configure everything

### Option 2: Manual Setup

#### Step 1: Get Supabase Connection String
1. Go to Supabase Dashboard
2. Settings → Database
3. Copy **Connection string** (URI format)

#### Step 2: Update `.env` File
Edit `backend/.env`:
```env
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Step 3: Install PostgreSQL Driver
```bash
cd backend
source .venv/bin/activate
pip install psycopg2-binary
```

#### Step 4: Restart Backend
```bash
./start-backend.sh
```

---

## 📋 Connection String Format

Your Supabase connection string should look like:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Or direct connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

## ✅ Verification

After setup, verify connection:
```bash
python3 view_database.py
```

Should show:
- ✅ Database connected to Supabase
- ✅ All tables created
- ✅ Ready to use

---

## 🔧 What Happens

1. ✅ Backend connects to Supabase PostgreSQL
2. ✅ All tables created automatically
3. ✅ Data stored in cloud
4. ✅ Accessible from anywhere
5. ✅ Automatic backups (Supabase feature)

---

**Ready to connect! Just provide your Supabase connection string!** 🚀

