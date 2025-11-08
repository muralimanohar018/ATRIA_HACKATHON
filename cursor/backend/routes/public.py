from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..database import db
from ..models.core import Job, Application, BlogPost, Testimonial, CaseStudy, ContactSubmission
from ..config import Config
from ..services.email_sender import send_email

public_bp = Blueprint("public", __name__)

def ok(data): return jsonify({"success": True, "data": data})
def err(msg, code=400): return jsonify({"success": False, "error": msg}), code

@public_bp.route("/health", methods=["GET"])
@cross_origin()
def health(): return ok({"service": "AI Backend"})

@public_bp.route("/jobs", methods=["GET"])
@cross_origin()
def jobs_list():
    try:
        jobs = Job.query.order_by(Job.created_at.desc()).all()
        return ok([{"id": j.id, "title": j.title, "location": j.location, "description": j.description} for j in jobs])
    except Exception as e:
        return err(f"Error loading jobs: {str(e)}", 500)

@public_bp.route("/apply", methods=["POST"])
@cross_origin()
def apply():
    try:
        data = request.get_json(force=True) or {}
        name, email, phone = data.get("name"), data.get("email"), data.get("phone")
        job_id, resume_text = data.get("job_id"), data.get("resume_text")
        if not all([name, email, job_id, resume_text]): return err("name, email, job_id, resume_text required")

        job = Job.query.get(job_id)
        if not job: return err("Invalid job_id")

        # AI job match (with error handling)
        from ..ai_engine.job_matcher import get_ai_job_match
        try:
            match = get_ai_job_match(resume_text, job.description)
        except Exception as e:
            # Fallback match on error
            from ..ai_engine.job_matcher import extract_skills_from_text, generate_recommendations
            job_skills = extract_skills_from_text(job.description)
            matched_skills = [skill for skill in job_skills if skill.lower() in resume_text.lower()]
            missing_skills = [skill for skill in job_skills if skill.lower() not in resume_text.lower()]
            score = min(100, int((len(matched_skills) / len(job_skills)) * 100)) if job_skills else 50
            match = {
                "match_score": score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills[:5],
                "analysis": f"Matched {len(matched_skills)} skills",
                "recommendations": generate_recommendations(score, missing_skills)
            }

        app = Application(name=name, email=email, phone=phone or "", resume_text=resume_text,
                          job_id=job_id, ai_match=match, status="applied")
        db.session.add(app); db.session.commit()

        # Generate resume PDF and send via email
        resume_pdf_sent = False
        try:
            from ..ai_engine.resume_generator import generate_ai_resume_template, format_resume_for_pdf
            from ..ai_engine.pdf_generator import generate_pdf_resume
            from ..ai_engine.email_ai import generate_resume_email
            
            # Create resume data from application
            resume_data = {
                "personalInfo": {
                    "name": name,
                    "email": email,
                    "phone": phone or "",
                },
                "summary": resume_text[:200] if resume_text else "",
                "experience": [],
                "education": [],
                "skills": match.get("matched_skills", []),
            }
            
            # Generate resume PDF
            enhanced_resume = generate_ai_resume_template(resume_data, "ats-modern")
            formatted_resume = format_resume_for_pdf(enhanced_resume, "ats-modern")
            pdf_buffer = generate_pdf_resume(formatted_resume, "ats-modern")
            
            # Read PDF bytes
            pdf_bytes = pdf_buffer.read()
            pdf_filename = f"{name.replace(' ', '_')}_resume.pdf"
            
            # Generate email with resume attachment
            email_body = generate_resume_email(name, pdf_filename)
            resume_pdf_sent = send_email(
                to=email,
                subject=f"Your Resume - Application for {job.title}",
                body=email_body,
                attachments=[(pdf_filename, pdf_bytes)]
            )
        except Exception as e:
            print(f"Warning: Could not generate/send resume PDF: {e}")
            # Continue with regular email even if PDF fails

        # AI email body for application confirmation
        from ..ai_engine.email_ai import generate_job_email
        body = generate_job_email(name, job.title)
        sent = send_email(email, f"Application Received – {Config.COMPANY_NAME}", body)

        return ok({
            "application_id": app.id, 
            "match": match, 
            "email_sent": bool(sent),
            "resume_pdf_sent": bool(resume_pdf_sent)
        })
    except Exception as e:
        import traceback
        print(f"Error in apply: {e}\n{traceback.format_exc()}")
        return err(f"Error processing application: {str(e)}", 500)

@public_bp.route("/blogs", methods=["GET"])
@cross_origin()
def blogs_list():
    try:
        posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
        return ok([{"id": b.id, "title": b.title, "summary": b.summary, "created_at": str(b.created_at)} for b in posts])
    except Exception as e:
        return err(f"Error loading blogs: {str(e)}", 500)

@public_bp.route("/blogs", methods=["POST"])
@cross_origin()
def blogs_create():
    try:
        data = request.get_json(force=True) or {}
        title, content = data.get("title"), data.get("content")
        if not title or not content: return err("title and content required")

        from ..ai_engine.summarizer import summarize_text_ai, seo_description_ai
        summary = summarize_text_ai(content)
        seo = seo_description_ai(content)
        post = BlogPost(title=title, content=content, summary=summary, seo_description=seo)
        db.session.add(post); db.session.commit()
        return ok({"id": post.id, "title": post.title, "summary": post.summary, "seo": post.seo_description})
    except Exception as e:
        import traceback
        print(f"Error in blogs_create: {e}\n{traceback.format_exc()}")
        return err(f"Error creating blog: {str(e)}", 500)

@public_bp.route("/testimonials", methods=["POST"])
@cross_origin()
def testimonials_create():
    try:
        data = request.get_json(force=True) or {}
        raw, author = data.get("raw_text"), data.get("author", "Anonymous")
        if not raw: return err("raw_text required")
        from ..ai_engine.testimonial_ai import rephrase_testimonial_ai
        polished = rephrase_testimonial_ai(raw)
        t = Testimonial(raw_text=raw, polished_text=polished, author=author)
        db.session.add(t); db.session.commit()
        return ok({"id": t.id, "polished_text": polished})
    except Exception as e:
        import traceback
        print(f"Error in testimonials_create: {e}\n{traceback.format_exc()}")
        return err(f"Error creating testimonial: {str(e)}", 500)

@public_bp.route("/case-studies/analyze", methods=["POST"])
@cross_origin()
def case_studies_analyze():
    try:
        data = request.get_json(force=True) or {}
        content = data.get("content")
        if not content: return err("content required")
        from ..ai_engine.case_study_ai import analyze_case_study_ai
        analysis = analyze_case_study_ai(content)
        cs = CaseStudy(content=content, ai_analysis=analysis)
        db.session.add(cs); db.session.commit()
        return ok({"id": cs.id, "analysis": analysis})
    except Exception as e:
        import traceback
        print(f"Error in case_studies_analyze: {e}\n{traceback.format_exc()}")
        return err(f"Error analyzing case study: {str(e)}", 500)

@public_bp.route("/contact", methods=["POST"])
@cross_origin()
def contact_submit():
    """Store contact form submission and send AI-generated email response."""
    try:
        data = request.get_json(force=True) or {}
        name, email, message = data.get("name"), data.get("email"), data.get("message")
        if not all([name, email, message]): return err("name, email, and message required")
        
        # Store in database
        submission = ContactSubmission(name=name, email=email, message=message)
        db.session.add(submission); db.session.commit()
        
        # Generate AI email response
        from ..ai_engine.email_ai import generate_contact_email
        body = generate_contact_email(name)
        sent = send_email(email, f"Thank You for Contacting {Config.COMPANY_NAME}", body)
        
        return ok({"id": submission.id, "email_sent": bool(sent)})
    except Exception as e:
        import traceback
        print(f"Error in contact_submit: {e}\n{traceback.format_exc()}")
        return err(f"Error submitting contact: {str(e)}", 500)

@public_bp.route("/testimonials", methods=["GET"])
@cross_origin()
def testimonials_list():
    """Get all testimonials."""
    try:
        testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
        return ok([{
            "id": t.id,
            "polished_text": t.polished_text,
            "author": t.author,
            "created_at": str(t.created_at)
        } for t in testimonials])
    except Exception as e:
        return err(f"Error loading testimonials: {str(e)}", 500)

@public_bp.route("/case-studies", methods=["GET"])
@cross_origin()
def case_studies_list():
    """Get all case studies."""
    try:
        case_studies = CaseStudy.query.order_by(CaseStudy.created_at.desc()).all()
        return ok([{
            "id": cs.id,
            "content": cs.content,
            "ai_analysis": cs.ai_analysis,
            "created_at": str(cs.created_at)
        } for cs in case_studies])
    except Exception as e:
        return err(f"Error loading case studies: {str(e)}", 500)

