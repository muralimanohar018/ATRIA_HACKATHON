# Mastersolis Infotech – AI-Powered Company Website

A complete, hackathon-ready full-stack application featuring a stunning glassmorphism + cyberpunk UI with integrated AI capabilities.

## 🚀 Features

### Frontend
- **Modern UI**: Glassmorphism + Cyberpunk design with neon accents and animated gradients
- **React + TypeScript**: Type-safe, component-based architecture
- **Tailwind CSS**: Utility-first styling with custom neon themes
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first, works on all devices

### Backend
- **Flask Blueprints**: Clean, modular route organization
- **SQLAlchemy**: Database ORM with SQLite (dev) / PostgreSQL (prod) support
- **AI Integration**: Hugging Face-powered features:
  - Resume parsing and job matching
  - Blog summarization and SEO generation
  - Testimonial rephrasing
  - Case study analysis
  - AI-generated emails
- **Auto Email**: SMTP integration for application confirmations
- **CORS Enabled**: Ready for frontend integration

### AI Features
- ✅ Resume parsing (PDF/DOCX)
- ✅ AI job matching with score calculation
- ✅ Blog summarization with visitor AI-summarize button
- ✅ SEO description generation
- ✅ Testimonial polishing
- ✅ Case study analysis
- ✅ AI-generated email templates
- ✅ AI chatbot for Services page
- ✅ AI-powered resume suggestions

## 📁 Project Structure

```
.
├── backend/
│   ├── __init__.py
│   ├── app.py                 # Flask application entry
│   ├── config.py              # Configuration management
│   ├── database.py            # SQLAlchemy setup
│   ├── requirements.txt       # Python dependencies
│   ├── routes/
│   │   ├── ai.py              # AI endpoints
│   │   ├── public.py          # Public API endpoints
│   │   └── admin.py           # Admin endpoints
│   ├── models/
│   │   └── core.py            # Database models
│   ├── services/
│   │   └── email_sender.py    # Email service
│   ├── ai_engine/             # AI modules (Hugging Face)
│   └── README_BACKEND.md      # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # API client
│   │   └── App.tsx            # Main app component
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
└── README.md                  # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### ⚡ Automated Setup (Recommended)

**Option 1: Python Script (Cross-platform)**
```bash
python3 setup.py
```

**Option 2: Shell Script (macOS/Linux)**
```bash
chmod +x setup.sh
./setup.sh
```

**Option 3: Batch Script (Windows)**
```cmd
setup.bat
```

All scripts automatically:
- ✅ Create `.env` files from examples
- ✅ Set up Python virtual environment
- ✅ Install all dependencies
- ✅ Configure the project

### 🚀 Quick Start

**Start Backend:**
```bash
./start-backend.sh
```
Backend runs on `http://localhost:5001`

**Start Frontend (in a new terminal):**
```bash
./start-frontend.sh
```
Frontend runs on `http://localhost:5173`

### 📝 Manual Setup (Alternative)

<details>
<summary>Click to expand manual setup instructions</summary>

**Backend Setup:**

1. **Create environment file:**
```bash
cp backend/.env.example backend/.env
```

2. **Create virtual environment:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run backend:**
```bash
python app.py
```

**Frontend Setup:**

1. **Create environment file:**
```bash
cp .env.example .env
```

2. **Install dependencies:**
```bash
cd frontend
npm install
```

3. **Run frontend:**
```bash
npm run dev
```

</details>

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=dev-secret-please-change
DB_URL=sqlite:///app.db
HF_API_KEY=hf_xxx                    # Optional (has fallbacks)
SENDER_EMAIL=your@gmail.com
SENDER_PASSWORD=your_gmail_app_password
COMPANY_NAME=Mastersolis Infotech
PORT=5001
```

### Frontend (`.env`)
```env
VITE_API_BASE=http://localhost:5001
```

## 📡 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /jobs` - List all jobs
- `POST /apply` - Submit job application
- `GET /blogs` - List blog posts
- `POST /blogs` - Create blog post (AI summary + SEO)
- `POST /testimonials` - Create testimonial (AI rephrase)
- `POST /case-studies/analyze` - Analyze case study

### AI Endpoints
- `POST /ai/parse-resume` - Parse resume file
- `POST /ai/job-match` - Match resume to job
- `POST /ai/summarize` - Summarize text
- `POST /ai/seo` - Generate SEO description
- `POST /ai/rephrase` - Rephrase testimonial
- `POST /ai/case-study` - Analyze case study
- `POST /ai/email/preview` - Preview AI email

### Admin Endpoints
- `POST /admin/jobs` - Create job
- `GET /admin/jobs` - List jobs
- `GET /admin/applications` - List applications
- `POST /admin/blogs` - Create blog

## 🚢 Deployment

### Backend (Render/Railway)

1. **Connect repository** to Render/Railway
2. **Set environment variables** (from `backend/.env.example`)
3. **Build command:** `pip install -r backend/requirements.txt`
4. **Start command:** `python backend/app.py`
5. **Set PORT** environment variable

### Frontend (Vercel/Netlify)

1. **Connect repository** to Vercel/Netlify
2. **Set environment variables:**
   - `VITE_API_BASE`: Your deployed backend URL
3. **Build command:** `npm install && npm run build`
4. **Output directory:** `dist`

## 🧪 Testing

### Backend Tests
```bash
# Health check
curl http://localhost:5001/health

# Create job
curl -X POST http://localhost:5001/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"AI Engineer","description":"Python, Flask, SQL","location":"Bengaluru"}'

# List jobs
curl http://localhost:5001/jobs

# AI Summarize
curl -X POST http://localhost:5001/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Long content..."}'
```

### Frontend
- Navigate to `http://localhost:5173`
- Test all pages and features
- Submit job applications
- Create blog posts
- Use admin dashboard

## 🎨 UI Features

- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Neon Accents**: Cyan, purple, and pink neon highlights
- **Animated Gradients**: Smooth gradient transitions
- **Motion Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Cyberpunk-inspired dark background

## 📊 Database Models

- **Job**: Job postings
- **Application**: Job applications with AI match scores and resume text
- **BlogPost**: Blog posts with AI-generated summaries and SEO descriptions
- **Testimonial**: Testimonials with AI-polished text
- **CaseStudy**: Case studies with AI analysis

## 🎯 Key Features

### Resume Builder
- Professional resume templates (Modern, Classic, Creative)
- Form-based resume creation
- AI-powered suggestions based on job requirements
- Download resume functionality
- Direct submission to job openings
- ATS-friendly formatting

### Resume Filtering Tool (Admin)
- Filter applications by status (Applied, Shortlisted, Rejected)
- Filter by AI match score (70%+, 80%+, 90%+)
- View complete resume text
- Download resumes
- Color-coded match scores
- Matched skills highlighting

### Project Filtering
- Tag-based search and filtering
- Multiple tag support per project
- Real-time filtering

### AI Chatbot
- Interactive AI assistant on Services page
- Answers questions about company services
- Smooth chat interface

See [FEATURES.md](FEATURES.md) for complete feature list.

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure CORS properly for production domains
- Use Gmail App Password (not regular password) for SMTP

## 📝 License

This project is created for hackathon/demo purposes.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify as needed.

## 📧 Support

For issues or questions, please check the documentation or create an issue.

---




