from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..database import db
from ..models.core import Job, BlogPost, Application, ContactSubmission, Testimonial, CaseStudy

admin_bp = Blueprint("admin", __name__)

def ok(data): return jsonify({"success": True, "data": data})
def err(msg, code=400): return jsonify({"success": False, "error": msg}), code

@admin_bp.route("/admin/jobs", methods=["POST"])
@cross_origin()
def admin_jobs_create():
    data = request.get_json(force=True)
    title, desc, loc = data.get("title"), data.get("description"), data.get("location", "Remote")
    if not title or not desc: return err("title and description required")
    job = Job(title=title, description=desc, location=loc)
    db.session.add(job); db.session.commit()
    return ok({"id": job.id, "title": job.title})

@admin_bp.route("/admin/jobs", methods=["GET"])
@cross_origin()
def admin_jobs_list():
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return ok([{"id": j.id, "title": j.title, "location": j.location, "description": j.description} for j in jobs])

@admin_bp.route("/admin/applications", methods=["GET"])
@cross_origin()
def admin_applications_list():
    apps = Application.query.order_by(Application.created_at.desc()).limit(50).all()
    return ok([{
        "id": a.id,
        "name": a.name,
        "email": a.email,
        "phone": a.phone,
        "job_id": a.job_id,
        "status": a.status,
        "ai_match": a.ai_match,
        "resume_text": a.resume_text,
        "created_at": str(a.created_at)
    } for a in apps])

@admin_bp.route("/admin/blogs", methods=["POST"])
@cross_origin()
def admin_blogs_create():
    data = request.get_json(force=True)
    title, content = data.get("title"), data.get("content")
    if not title or not content: return err("title and content required")
    from ..ai_engine.summarizer import summarize_text_ai, seo_description_ai
    summary = summarize_text_ai(content)
    seo = seo_description_ai(content)
    post = BlogPost(title=title, content=content, summary=summary, seo_description=seo)
    db.session.add(post); db.session.commit()
    return ok({"id": post.id, "title": post.title})

@admin_bp.route("/admin/analytics", methods=["GET"])
@cross_origin()
def admin_analytics():
    """Get analytics dashboard with AI-based summaries."""
    from ..ai_engine.summarizer import summarize_text_ai
    
    # Get counts
    jobs_count = Job.query.count()
    applications_count = Application.query.count()
    blogs_count = BlogPost.query.count()
    contacts_count = ContactSubmission.query.count()
    testimonials_count = Testimonial.query.count()
    case_studies_count = CaseStudy.query.count()
    
    # Get recent data for AI summary
    recent_apps = Application.query.order_by(Application.created_at.desc()).limit(10).all()
    recent_contacts = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).limit(5).all()
    
    # Generate AI summary
    summary_text = f"Total: {jobs_count} jobs, {applications_count} applications, {blogs_count} blogs, {contacts_count} contacts. "
    if recent_apps:
        summary_text += f"Recent applications show {len([a for a in recent_apps if a.ai_match and a.ai_match.get('match_score', 0) >= 80])} high-match candidates. "
    if recent_contacts:
        summary_text += f"{len(recent_contacts)} recent contact inquiries received."
    
    ai_summary = summarize_text_ai(summary_text) if summary_text else "No data available for summary."
    
    # Calculate match score distribution
    all_apps = Application.query.all()
    match_scores = [a.ai_match.get('match_score', 0) if a.ai_match else 0 for a in all_apps]
    avg_match = sum(match_scores) / len(match_scores) if match_scores else 0
    high_match = len([s for s in match_scores if s >= 80])
    medium_match = len([s for s in match_scores if 60 <= s < 80])
    low_match = len([s for s in match_scores if s < 60])
    
    return ok({
        "stats": {
            "jobs": jobs_count,
            "applications": applications_count,
            "blogs": blogs_count,
            "contacts": contacts_count,
            "testimonials": testimonials_count,
            "case_studies": case_studies_count,
        },
        "applications": {
            "total": applications_count,
            "average_match": round(avg_match, 1),
            "high_match": high_match,
            "medium_match": medium_match,
            "low_match": low_match,
        },
        "ai_summary": ai_summary,
        "recent_contacts": len(recent_contacts),
        "recent_applications": len(recent_apps)
    })

