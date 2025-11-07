#!/bin/bash
# Test all backend endpoints

BASE_URL="http://localhost:5001"

echo "=========================================="
echo "Testing All Backend Endpoints"
echo "=========================================="
echo ""

# Health Check
echo "1. Health Check"
curl -s "$BASE_URL/health" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Jobs
echo "2. List Jobs"
curl -s "$BASE_URL/jobs" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Create Job
echo "3. Create Job (Admin)"
curl -s -X POST "$BASE_URL/admin/jobs" \
  -H "Content-Type: application/json" \
  -d '{"title":"Backend Developer","description":"Python, Flask, SQL, REST API","location":"Remote"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Job Match
echo "4. AI Job Match"
curl -s -X POST "$BASE_URL/ai/job-match" \
  -H "Content-Type: application/json" \
  -d '{"resume_text":"Python developer with Flask and SQL","job_description":"Looking for Python developer with Flask, SQL, AI"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Apply
echo "5. Apply for Job"
curl -s -X POST "$BASE_URL/apply" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","job_id":1,"resume_text":"Python developer with Flask and SQL"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Admin Applications
echo "6. List Applications (Admin)"
curl -s "$BASE_URL/admin/applications" | python3 -m json.tool | head -30
echo ""
echo "---"
echo ""

# Summarize
echo "7. AI Summarize"
curl -s -X POST "$BASE_URL/ai/summarize" \
  -H "Content-Type: application/json" \
  -d '{"text":"AI is transforming businesses"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

# Create Blog
echo "8. Create Blog"
curl -s -X POST "$BASE_URL/blogs" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Blog","content":"This is a test blog post about AI"}' | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "=========================================="
echo "Testing Complete!"
echo "=========================================="

