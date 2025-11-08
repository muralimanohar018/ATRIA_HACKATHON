# AI Backend – Mastersolis

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # Fill in values
```

## Run

```bash
python backend/app.py
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

- `SECRET_KEY`: Flask secret key
- `DB_URL`: Database URL (sqlite:///app.db for local)
- `HF_API_KEY`: Hugging Face API key (optional, has fallbacks)
- `SENDER_EMAIL`: Gmail address for sending emails
- `SENDER_PASSWORD`: Gmail app password
- `COMPANY_NAME`: Company name
- `PORT`: Server port (default: 5001)

## Test Endpoints

### Health Check
```bash
curl http://localhost:5001/health
```

### Create Job (Admin)
```bash
curl -X POST http://localhost:5001/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"AI Engineer","description":"Python, Flask, SQL","location":"Bengaluru"}'
```

### List Jobs
```bash
curl http://localhost:5001/jobs
```

### AI Summarize
```bash
curl -X POST http://localhost:5001/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Long content..."}'
```

### Apply for Job
```bash
curl -X POST http://localhost:5001/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"1234567890",
    "job_id":1,
    "resume_text":"Experienced Python developer..."
  }'
```

## Deployment (Render/Railway)

1. Set environment variables in dashboard
2. Build command: `pip install -r backend/requirements.txt`
3. Start command: `python backend/app.py`
4. Ensure PORT environment variable is set

## Database

- Development: SQLite (`sqlite:///app.db`)
- Production: Set `DB_URL` to PostgreSQL connection string

