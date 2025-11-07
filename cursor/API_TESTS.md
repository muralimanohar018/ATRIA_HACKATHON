# API Tests - Postman Collection

## Base URL
```
http://localhost:5001
```

## Health Check
```http
GET /health
```

## Jobs

### List Jobs
```http
GET /jobs
```

### Create Job (Admin)
```http
POST /admin/jobs
Content-Type: application/json

{
  "title": "AI Engineer",
  "description": "Experienced Python developer with Flask and SQL knowledge. Must have AI/ML experience.",
  "location": "Bengaluru"
}
```

## Applications

### Apply for Job
```http
POST /apply
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "job_id": 1,
  "resume_text": "Experienced Python developer with 5 years in Flask, SQL, and machine learning. Worked on multiple AI projects."
}
```

### List Applications (Admin)
```http
GET /admin/applications
```

## Blogs

### List Blogs
```http
GET /blogs
```

### Create Blog
```http
POST /blogs
Content-Type: application/json

{
  "title": "The Future of AI",
  "content": "Artificial Intelligence is transforming the way we work and live. In this comprehensive article, we explore the latest trends and developments in AI technology, machine learning, and their impact on various industries..."
}
```

## AI Endpoints

### Summarize Text
```http
POST /ai/summarize
Content-Type: application/json

{
  "text": "Long article content here..."
}
```

### Generate SEO Description
```http
POST /ai/seo
Content-Type: application/json

{
  "text": "Article content here..."
}
```

### Job Match
```http
POST /ai/job-match
Content-Type: application/json

{
  "resume_text": "Experienced Python developer...",
  "job_description": "We are looking for a Python developer with Flask experience..."
}
```

### Rephrase Testimonial
```http
POST /ai/rephrase
Content-Type: application/json

{
  "text": "This company is great! They helped us a lot."
}
```

### Analyze Case Study
```http
POST /ai/case-study
Content-Type: application/json

{
  "text": "Case study content here..."
}
```

### Preview Email
```http
POST /ai/email/preview
Content-Type: application/json

{
  "name": "John Doe",
  "kind": "job",
  "job_title": "AI Engineer"
}
```

## Testimonials

### Create Testimonial
```http
POST /testimonials
Content-Type: application/json

{
  "raw_text": "Great company, amazing service!",
  "author": "Jane Smith"
}
```

## Case Studies

### Analyze Case Study
```http
POST /case-studies/analyze
Content-Type: application/json

{
  "content": "Case study content here..."
}
```

## Admin

### Create Blog (Admin)
```http
POST /admin/blogs
Content-Type: application/json

{
  "title": "Blog Title",
  "content": "Blog content here..."
}
```

---

## cURL Examples

### Health Check
```bash
curl http://localhost:5001/health
```

### Create Job
```bash
curl -X POST http://localhost:5001/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Engineer",
    "description": "Python, Flask, SQL",
    "location": "Bengaluru"
  }'
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
    "resume_text": "Experienced developer..."
  }'
```

### AI Summarize
```bash
curl -X POST http://localhost:5001/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Long content here..."}'
```

