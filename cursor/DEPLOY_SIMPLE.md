# 🚀 Simple Vercel Deployment Guide

## Step 1: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to https://vercel.com** and sign up/login
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
4. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Add Environment Variable:**
   - Key: `VITE_API_BASE`
   - Value: `https://your-backend-url.onrender.com` (or your backend URL)
6. **Click "Deploy"**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel

# Deploy to production
vercel --prod
```

## Step 2: Deploy Backend to Render (Recommended)

**Why Render?** Better for Flask apps with databases.

1. **Go to https://render.com** and sign up
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `mastersolis-backend`
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn backend.app:create_app --bind 0.0.0.0:$PORT`
5. **Add Environment Variables:**
   - `SECRET_KEY` - Any random string
   - `SUPABASE_DB_URL` - Your Supabase connection string
   - `HF_API_KEY` - (Optional) Hugging Face API key
   - `SENDER_EMAIL` - Your email
   - `SENDER_PASSWORD` - Your email password
   - `COMPANY_NAME` - Mastersolis Infotech
6. **Click "Create Web Service"**

## Step 3: Update Frontend with Backend URL

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Update `VITE_API_BASE`** with your Render backend URL
3. **Redeploy** (Vercel will auto-redeploy or click "Redeploy")

## Step 4: Update Backend CORS

Update `backend/app.py` to include your Vercel URL in allowed origins.

## ✅ Done!

Your website will be live at: `https://your-app.vercel.app`

---

## Quick Commands Reference

```bash
# Deploy frontend
cd frontend && vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs
```

