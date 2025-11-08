# 🔧 Fix: "Failed to create blog" and "Failed to create resume"

## Quick Fix

### 1. Restart Backend Server

The backend needs to be restarted to load the new `/ai/generate-resume` endpoint.

**Stop the backend** (Ctrl+C in the terminal running it), then:

```bash
cd /Users/muralimanoharmga/Desktop/cursor/backend
source .venv/bin/activate
python app.py
```

### 2. Verify Backend is Running

```bash
curl http://localhost:5001/health
```

Should return: `{"success": true, ...}`

### 3. Test Endpoints

**Test Blog Creation:**
```bash
curl -X POST http://localhost:5001/blogs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Blog","content":"Test content"}'
```

**Test Resume Generation:**
```bash
curl -X POST http://localhost:5001/ai/generate-resume \
  -H "Content-Type: application/json" \
  -d '{"resume_data":{"personalInfo":{"name":"Test User"},"summary":"Test summary"},"template":"ats-modern"}'
```

---

## Common Issues

### Issue 1: Backend Not Running
**Solution:** Start backend server (see above)

### Issue 2: Port Already in Use
**Solution:**
```bash
# Find process using port 5001
lsof -i :5001

# Kill it
kill -9 <PID>
```

### Issue 3: Import Errors
**Solution:** Make sure you're running from project root:
```bash
cd /Users/muralimanoharmga/Desktop/cursor
python -m backend.app
```

### Issue 4: Missing Dependencies
**Solution:**
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Updated Error Messages

I've updated the error messages to show more details:
- Blog creation errors now show the actual error message
- Resume generation errors now show what went wrong
- Both include troubleshooting steps

---

## After Restarting Backend

1. **Try creating a blog again** - should work now
2. **Try generating a resume** - should work now
3. **Check browser console** (F12) for any remaining errors

---

## Still Not Working?

1. Check backend terminal for error messages
2. Check browser console (F12) for network errors
3. Verify both servers are running:
   - Backend: http://localhost:5001/health
   - Frontend: http://localhost:5177 (or check terminal)

---

**Most likely fix: Just restart the backend server!** 🚀

