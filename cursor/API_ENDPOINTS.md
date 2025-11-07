# API Endpoints Documentation

## Base URL
```
http://localhost:5001
```

## Endpoint Summary

### ✅ Health & Public (2 endpoints)
- `GET /` - Root endpoint
- `GET /health` - Health check

### ✅ Jobs (2 endpoints)
- `GET /jobs` - List all jobs
- `POST /apply` - Submit job application

### ✅ Blogs (2 endpoints)
- `GET /blogs` - List all blog posts
- `POST /blogs` - Create blog post (AI summary + SEO)

### ✅ Testimonials (1 endpoint)
- `POST /testimonials` - Create testimonial (AI rephrase)

### ✅ Case Studies (1 endpoint)
- `POST /case-studies/analyze` - Analyze case study

### ✅ AI Endpoints (8 endpoints)
- `POST /ai/parse-resume` - Parse resume file
- `POST /ai/job-match` - Match resume to job
- `POST /ai/summarize` - Summarize text
- `POST /ai/seo` - Generate SEO description
- `POST /ai/rephrase` - Rephrase testimonial
- `POST /ai/case-study` - Analyze case study
- `POST /ai/email/preview` - Preview AI email

### ✅ Admin (4 endpoints)
- `POST /admin/jobs` - Create job
- `GET /admin/jobs` - List jobs (admin view)
- `GET /admin/applications` - List applications
- `POST /admin/blogs` - Create blog

**Total: 20 endpoints**

---

## Detailed Endpoint Documentation

### Health & Public

#### GET /health
**Description:** Health check endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "service": "AI Backend"
  }
}
```

#### GET /
**Description:** Root endpoint

**Response:**
```json
{
  "message": "AI Backend Running"
}
```

---

### Jobs

#### GET /jobs
**Description:** Get list of all available jobs

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI Engineer",
      "location": "Bengaluru",
      "description": "Job description..."
    }
  ]
}
```

#### POST /apply
**Description:** Submit job application with resume. Returns AI match score.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "job_id": 1,
  "resume_text": "Resume content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "application_id": 1,
    "match": {
      "match_score": 85,
      "matched_skills": ["Python", "Flask", "SQL"],
      "missing_skills": ["Docker"],
      "analysis": "Strong match with 85% compatibility",
      "recommendations": ["Consider mentioning: Docker"]
    },
    "email_sent": true
  }
}
```

---

### Blogs

#### GET /blogs
**Description:** Get list of all blog posts

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Blog Title",
      "summary": "AI-generated summary...",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### POST /blogs
**Description:** Create blog post with AI-generated summary and SEO

**Request Body:**
```json
{
  "title": "Blog Title",
  "content": "Blog content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Blog Title",
    "summary": "AI-generated summary...",
    "seo": "SEO description..."
  }
}
```

---

### Testimonials

#### POST /testimonials
**Description:** Create testimonial with AI rephrasing

**Request Body:**
```json
{
  "raw_text": "Great company, amazing service!",
  "author": "Jane Smith"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "polished_text": "AI-polished testimonial text..."
  }
}
```

---

### Case Studies

#### POST /case-studies/analyze
**Description:** Analyze case study content

**Request Body:**
```json
{
  "content": "Case study content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "analysis": {
      "word_count": 150,
      "key_points": ["Point 1", "Point 2"],
      "sentiment": "positive",
      "summary": "Analysis summary..."
    }
  }
}
```

---

### AI Endpoints

#### POST /ai/parse-resume
**Description:** Parse resume from file (PDF/DOCX)

**Request Body:**
```json
{
  "file_path": "/path/to/resume.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text...",
    "fields": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "skills": ["Python", "Flask"]
    }
  }
}
```

#### POST /ai/job-match
**Description:** Analyze resume match against job description

**Request Body:**
```json
{
  "resume_text": "Resume content...",
  "job_description": "Job description..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "match_score": 85,
    "matched_skills": ["Python", "Flask", "SQL"],
    "missing_skills": ["Docker", "Kubernetes"],
    "analysis": "Strong match with 85% compatibility",
    "recommendations": [
      "Strong match - minor improvements can optimize your resume",
      "Consider mentioning: Docker, Kubernetes"
    ]
  }
}
```

#### POST /ai/summarize
**Description:** Generate AI summary of text

**Request Body:**
```json
{
  "text": "Long text content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary..."
  }
}
```

#### POST /ai/seo
**Description:** Generate SEO description (max 160 chars)

**Request Body:**
```json
{
  "text": "Article content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "seo": "SEO description..."
  }
}
```

#### POST /ai/rephrase
**Description:** Rephrase testimonial text

**Request Body:**
```json
{
  "text": "Raw testimonial text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "polished": "AI-polished text..."
  }
}
```

#### POST /ai/case-study
**Description:** Analyze case study

**Request Body:**
```json
{
  "text": "Case study content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "word_count": 150,
    "key_points": ["Point 1", "Point 2"],
    "sentiment": "positive",
    "summary": "Summary..."
  }
}
```

#### POST /ai/email/preview
**Description:** Preview AI-generated email

**Request Body (Job Application):**
```json
{
  "name": "John Doe",
  "kind": "job",
  "job_title": "AI Engineer"
}
```

**Request Body (Contact):**
```json
{
  "name": "Jane Smith",
  "kind": "contact"
}
```

**Request Body (Shortlist):**
```json
{
  "name": "John Doe",
  "kind": "shortlist",
  "job_title": "Senior Developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "body": "Email body text..."
  }
}
```

---

### Admin Endpoints

#### POST /admin/jobs
**Description:** Create new job posting

**Request Body:**
```json
{
  "title": "AI Engineer",
  "description": "Job description...",
  "location": "Bengaluru"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI Engineer"
  }
}
```

#### GET /admin/jobs
**Description:** List all jobs (admin view with full descriptions)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI Engineer",
      "location": "Bengaluru",
      "description": "Full job description..."
    }
  ]
}
```

#### GET /admin/applications
**Description:** List all job applications with AI match scores

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "job_id": 1,
      "status": "applied",
      "ai_match": {
        "match_score": 85,
        "matched_skills": ["Python", "Flask"],
        "missing_skills": ["Docker"],
        "analysis": "Strong match...",
        "recommendations": ["Consider mentioning: Docker"]
      },
      "resume_text": "Full resume text...",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### POST /admin/blogs
**Description:** Create blog post (admin)

**Request Body:**
```json
{
  "title": "Blog Title",
  "content": "Blog content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Blog Title"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `500` - Internal Server Error

---

## Postman Collection

Import `Mastersolis_API.postman_collection.json` into Postman:

1. Open Postman
2. Click "Import"
3. Select `Mastersolis_API.postman_collection.json`
4. Set `base_url` variable to `http://localhost:5001`
5. Start testing!

---

## Testing with cURL

### Health Check
```bash
curl http://localhost:5001/health
```

### List Jobs
```bash
curl http://localhost:5001/jobs
```

### Apply for Job
```bash
curl -X POST http://localhost:5001/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "job_id": 1,
    "resume_text": "Resume content..."
  }'
```

### AI Job Match
```bash
curl -X POST http://localhost:5001/ai/job-match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python developer with Flask experience",
    "job_description": "Looking for Python developer with Flask and SQL"
  }'
```

### Create Job (Admin)
```bash
curl -X POST http://localhost:5001/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Engineer",
    "description": "Python, Flask, SQL, AI/ML",
    "location": "Bengaluru"
  }'
```

---

## Notes

- All POST endpoints require `Content-Type: application/json` header
- CORS is enabled for all endpoints
- AI endpoints have fallbacks if Hugging Face API key is not configured
- Email sending requires SMTP configuration in `.env`

