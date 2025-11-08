# Vercel Deployment Guide

## 🚀 Quick Deployment

### Option 1: Deploy Frontend Only (Recommended for Start)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? (Press Enter for default)
   - Directory? **./** (or just press Enter)
   - Override settings? **N**

3. **Set Environment Variables**:
   ```bash
   vercel env add VITE_API_BASE
   # Enter: https://your-backend-url.vercel.app
   ```

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy Both Frontend + Backend

**Note**: Vercel supports Python but has limitations. For production, consider:
- **Backend**: Render.com or Railway.app (better for Flask)
- **Frontend**: Vercel (perfect for React/Vite)

#### Deploy Backend to Render/Railway:

1. **Create account** at https://render.com or https://railway.app
2. **Connect your GitHub repository**
3. **Create new Web Service**
4. **Settings**:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python -m backend.app` or `gunicorn backend.app:create_app()`
   - Environment Variables: Add all from `backend/.env`

#### Deploy Frontend to Vercel:

1. **Deploy frontend** (see Option 1 above)
2. **Update API URL** in Vercel environment variables:
   ```bash
   vercel env add VITE_API_BASE production
   # Enter your Render/Railway backend URL
   ```

## 📋 Step-by-Step: Frontend Deployment

### 1. Prepare Frontend

```bash
cd frontend
npm install
npm run build
```

### 2. Deploy to Vercel

**Via CLI:**
```bash
cd frontend
vercel login
vercel
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_BASE`
   - Value: `https://your-backend-url.vercel.app` (or Render/Railway URL)
6. Click "Deploy"

### 3. Update Backend CORS

Update `backend/app.py` to allow your Vercel domain:

```python
CORS(app, 
     supports_credentials=True,
     origins=[
         "http://localhost:5173",
         "http://127.0.0.1:5173",
         "https://your-app.vercel.app",  # Add your Vercel URL
         "https://*.vercel.app"  # Allow all Vercel previews
     ],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
```

## 🔧 Environment Variables

### Frontend (Vercel):
- `VITE_API_BASE` - Your backend URL (e.g., `https://your-backend.onrender.com`)

### Backend (Render/Railway):
- `SECRET_KEY` - Random secret key
- `SUPABASE_DB_URL` - Your Supabase connection string
- `HF_API_KEY` - Hugging Face API key (optional)
- `SENDER_EMAIL` - Email for sending emails
- `SENDER_PASSWORD` - Email password
- `COMPANY_NAME` - Company name
- `PORT` - Port (usually auto-set by platform)

## 📝 Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both platforms
- [ ] CORS updated in backend to allow Vercel domain
- [ ] Database (Supabase) connection working
- [ ] Test all features after deployment

## 🎯 Quick Commands

```bash
# Deploy frontend
cd frontend && vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open deployment
vercel open
```

## 💡 Tips

1. **Use Render/Railway for Backend**: Better suited for Flask apps with database connections
2. **Use Vercel for Frontend**: Perfect for static React apps
3. **Environment Variables**: Set them in both platforms
4. **Custom Domain**: Add your domain in Vercel settings after deployment

