# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to create blog" Error

**Possible Causes:**
- Backend not running
- Missing title or content
- Network/CORS issues

**Solutions:**
1. **Check Backend is Running:**
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"success": true, ...}`

2. **Start Backend if Not Running:**
   ```bash
   cd backend
   source .venv/bin/activate
   python app.py
   ```

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Network tab for failed requests
   - Look for CORS errors

4. **Verify Data:**
   - Make sure title and content fields are filled
   - Check for special characters that might cause issues

---

### 2. "Failed to create resume" / "Failed to generate PDF" Error

**Possible Causes:**
- Backend not running
- Missing resume data
- jsPDF not installed
- AI resume generator endpoint error

**Solutions:**
1. **Check Backend is Running:**
   ```bash
   curl http://localhost:5001/health
   ```

2. **Install jsPDF:**
   ```bash
   cd frontend
   npm install jspdf
   ```

3. **Fill Resume Data:**
   - Make sure at least name is filled in Personal Information
   - Or upload/paste resume text if using upload mode

4. **Check Backend Logs:**
   - Look at backend terminal for error messages
   - Check if resume_generator module is loading correctly

5. **Test Resume Endpoint:**
   ```bash
   curl -X POST http://localhost:5001/ai/generate-resume \
     -H "Content-Type: application/json" \
     -d '{"resume_data":{"personalInfo":{"name":"Test"},"summary":"Test"},"template":"ats-modern"}'
   ```

---

### 3. Backend Not Starting

**Solutions:**
1. **Check Python Version:**
   ```bash
   python3 --version  # Should be 3.11+
   ```

2. **Reinstall Dependencies:**
   ```bash
   cd backend
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Check Port 5001:**
   ```bash
   lsof -i :5001
   # Kill process if needed
   kill -9 <PID>
   ```

4. **Check Database:**
   ```bash
   # Database should auto-create, but check permissions
   ls -la backend/app.db
   ```

---

### 4. Frontend Not Starting

**Solutions:**
1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   npm install jspdf  # For PDF generation
   ```

2. **Check Node Version:**
   ```bash
   node --version  # Should be 18+
   ```

3. **Clear Cache:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check Port:**
   ```bash
   lsof -i :5173
   # Or check if Vite is using different port
   ```

---

### 5. CORS Errors

**Solutions:**
1. **Check Backend CORS:**
   - Make sure `flask-cors` is installed
   - Check `backend/app.py` has `CORS(app)`

2. **Check API Base URL:**
   - Verify `frontend/.env` has: `VITE_API_BASE=http://localhost:5001`
   - Or check `frontend/src/lib/api.ts`

---

### 6. Database Errors

**Solutions:**
1. **Recreate Database:**
   ```bash
   cd backend
   rm app.db  # Delete old database
   source .venv/bin/activate
   python -c "from app import create_app; from database import init_db; app = create_app(); init_db(app)"
   ```

2. **Check Permissions:**
   ```bash
   chmod 666 backend/app.db
   ```

---

### 7. Import Errors (Backend)

**Solutions:**
1. **Run from Project Root:**
   ```bash
   # Always run from project root
   python -m backend.app
   # NOT: cd backend && python app.py
   ```

2. **Check Python Path:**
   ```bash
   # Make sure you're in project root
   pwd
   # Should be: /Users/muralimanoharmga/Desktop/cursor
   ```

---

## Quick Diagnostic Commands

```bash
# Check backend health
curl http://localhost:5001/health

# Test blog creation
curl -X POST http://localhost:5001/blogs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'

# Test resume generation
curl -X POST http://localhost:5001/ai/generate-resume \
  -H "Content-Type: application/json" \
  -d '{"resume_data":{"personalInfo":{"name":"Test"}},"template":"ats-modern"}'

# Check if ports are in use
lsof -i :5001  # Backend
lsof -i :5173  # Frontend
```

---

## Still Having Issues?

1. **Check Browser Console** (F12) for detailed error messages
2. **Check Backend Terminal** for Python errors
3. **Check Network Tab** in DevTools for failed API calls
4. **Verify Environment Variables** in `.env` files
5. **Restart Both Servers** (stop and start again)

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Failed to resolve import jspdf" | Run `npm install jspdf` in frontend |
| "Connection refused" | Start backend server |
| "CORS error" | Check backend CORS configuration |
| "ImportError" | Run backend from project root |
| "Port already in use" | Kill process or use different port |

