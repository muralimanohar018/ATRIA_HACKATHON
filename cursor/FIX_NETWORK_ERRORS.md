# 🔧 FIX NETWORK ERRORS - STEP BY STEP GUIDE

## Problem
Network errors when frontend tries to connect to backend.

## Solution Steps

### Step 1: Kill All Processes
```bash
pkill -9 -f "python.*backend"
pkill -9 -f "flask"
pkill -9 -f "vite"
```

### Step 2: Check Backend is Running
```bash
curl http://localhost:5001/health
```
Should return: `{"success": true, "data": {"service": "AI Backend"}}`

### Step 3: Check CORS Headers
```bash
curl -v -H "Origin: http://localhost:5173" http://localhost:5001/jobs
```
Should see: `Access-Control-Allow-Origin: http://localhost:5173`

### Step 4: Start Backend
```bash
cd backend
source .venv/bin/activate  # or: source venv/bin/activate
cd ..
python3 -m backend.app
```

### Step 5: Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### Step 6: Test in Browser
1. Open http://localhost:5173
2. Open Browser DevTools (F12)
3. Go to Network tab
4. Try to use any feature
5. Check if requests show:
   - Status: 200 (success) or error code
   - Response headers include `Access-Control-Allow-Origin`

## Common Issues

### Issue 1: Backend Not Running
**Solution:** Start backend first, wait for it to be ready, then start frontend.

### Issue 2: CORS Error
**Solution:** Backend CORS is configured. If still failing:
- Check `backend/app.py` has correct CORS setup
- Make sure frontend URL matches exactly: `http://localhost:5173`

### Issue 3: Port Already in Use
**Solution:** 
```bash
lsof -i :5001  # Check what's using port 5001
kill -9 <PID>  # Kill that process
```

### Issue 4: Multiple Backend Instances
**Solution:**
```bash
ps aux | grep python | grep backend  # Find all instances
pkill -9 -f "python.*backend"        # Kill all
```

## Quick Fix Script
```bash
./RESTART_CLEAN.sh
```

This script:
1. Kills all processes
2. Starts backend
3. Waits for backend to be ready
4. Starts frontend

## Manual Verification

### Test Backend Directly
```bash
# Health check
curl http://localhost:5001/health

# Jobs list
curl http://localhost:5001/jobs

# With CORS headers
curl -H "Origin: http://localhost:5173" http://localhost:5001/jobs
```

### Test Frontend Connection
1. Open browser console (F12)
2. Run:
```javascript
fetch('http://localhost:5001/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this works, the connection is fine. If not, check backend logs.

## Still Not Working?

1. **Check backend logs:**
   ```bash
   tail -f /tmp/backend_clean.log
   ```

2. **Check frontend logs:**
   ```bash
   tail -f /tmp/frontend_clean.log
   ```

3. **Check browser console** for exact error message

4. **Verify backend is actually listening:**
   ```bash
   lsof -i :5001
   ```

5. **Try accessing backend directly in browser:**
   http://localhost:5001/health

If backend works in browser but not from frontend, it's a CORS issue.
If backend doesn't work in browser, backend isn't running properly.

