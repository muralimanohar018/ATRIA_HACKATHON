from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os
import tempfile
from werkzeug.utils import secure_filename

# Import existing AI modules (already implemented by AI engineer)
from ..ai_engine.resume_parser import extract_text, extract_fields
from ..ai_engine.job_matcher import get_ai_job_match
from ..ai_engine.summarizer import summarize_text_ai, seo_description_ai
from ..ai_engine.testimonial_ai import rephrase_testimonial_ai
from ..ai_engine.case_study_ai import analyze_case_study_ai
from ..ai_engine.email_ai import (
    generate_job_email, generate_contact_email, generate_shortlist_email
)

ai_bp = Blueprint("ai", __name__)

def ok(data): return jsonify({"success": True, "data": data})
def err(msg, code=400): return jsonify({"success": False, "error": msg}), code

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@ai_bp.route("/upload-resume", methods=["POST"])
@cross_origin()
def upload_resume():
    """Upload and parse resume file (PDF/DOCX)."""
    if 'file' not in request.files:
        return err("No file provided", 400)
    
    file = request.files['file']
    if file.filename == '':
        return err("No file selected", 400)
    
    if not allowed_file(file.filename):
        return err("Invalid file type. Only PDF, DOCX, DOC allowed", 400)
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        file.save(file_path)
        
        # Extract text and fields
        text = extract_text(file_path)
        fields = extract_fields(text)
        
        # Clean up temp file
        try:
            os.remove(file_path)
        except:
            pass
        
        return ok({
            "text": text,
            "fields": fields,
            "filename": filename
        })
    except Exception as e:
        return err(f"Error processing file: {str(e)}", 500)

@ai_bp.route("/parse-resume", methods=["POST"])
@cross_origin()
def parse_resume():
    data = request.get_json(force=True)
    file_path = data.get("file_path")
    if not file_path: return err("file_path required")
    try:
        text = extract_text(file_path)
        fields = extract_fields(text)
        return ok({"text": text, "fields": fields})
    except Exception as e:
        return err(str(e), 500)

@ai_bp.route("/job-match", methods=["POST"])
@cross_origin()
def job_match():
    data = request.get_json(force=True)
    r, j = data.get("resume_text"), data.get("job_description")
    if not r or not j: return err("resume_text and job_description required")
    try: 
        result = get_ai_job_match(r, j)
        return ok(result)
    except Exception as e: 
        # Ensure we always return a valid response even on error
        import traceback
        print(f"Job match error: {e}\n{traceback.format_exc()}")
        # Return fallback result
        from ..ai_engine.job_matcher import extract_skills_from_text, generate_recommendations
        job_skills = extract_skills_from_text(j)
        matched_skills = [skill for skill in job_skills if skill.lower() in r.lower()]
        missing_skills = [skill for skill in job_skills if skill.lower() not in r.lower()]
        score = min(100, int((len(matched_skills) / len(job_skills)) * 100)) if job_skills else 50
        return ok({
            "match_score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills[:5],
            "analysis": f"Matched {len(matched_skills)} skills (fallback mode)",
            "recommendations": generate_recommendations(score, missing_skills)
        })

@ai_bp.route("/summarize", methods=["POST"])
@cross_origin()
def summarize():
    data = request.get_json(force=True)
    txt = data.get("text")
    if not txt: return err("text required")
    try: return ok({"summary": summarize_text_ai(txt)})
    except Exception as e: return err(str(e), 500)

@ai_bp.route("/seo", methods=["POST"])
@cross_origin()
def seo():
    data = request.get_json(force=True)
    txt = data.get("text")
    if not txt: return err("text required")
    try: return ok({"seo": seo_description_ai(txt)})
    except Exception as e: return err(str(e), 500)

@ai_bp.route("/rephrase", methods=["POST"])
@cross_origin()
def rephrase():
    data = request.get_json(force=True)
    txt = data.get("text")
    if not txt: return err("text required")
    try: return ok({"polished": rephrase_testimonial_ai(txt)})
    except Exception as e: return err(str(e), 500)

@ai_bp.route("/case-study", methods=["POST"])
@cross_origin()
def case_study():
    data = request.get_json(force=True)
    txt = data.get("text")
    if not txt: return err("text required")
    try: return ok(analyze_case_study_ai(txt))
    except Exception as e: return err(str(e), 500)

@ai_bp.route("/email/preview", methods=["POST"])
@cross_origin()
def email_preview():
    data = request.get_json(force=True)
    name = data.get("name", "Candidate")
    kind = data.get("kind", "job")
    title = data.get("job_title", "Position")
    try:
        if kind == "contact":
            body = generate_contact_email(name)
        elif kind == "shortlist":
            body = generate_shortlist_email(name, title)
        else:
            body = generate_job_email(name, title)
        return ok({"body": body})
    except Exception as e:
        return err(str(e), 500)

@ai_bp.route("/generate-resume", methods=["POST"])
@cross_origin()
def generate_resume():
    """Generate AI-enhanced resume with template formatting."""
    data = request.get_json(force=True)
    resume_data = data.get("resume_data")
    template = data.get("template", "ats-modern")
    
    if not resume_data:
        return err("resume_data required", 400)
    
    try:
        from ..ai_engine.resume_generator import generate_ai_resume_template, format_resume_for_pdf
        enhanced_resume = generate_ai_resume_template(resume_data, template)
        formatted_resume = format_resume_for_pdf(enhanced_resume, template)
        # Return both formats - resume is the formatted one for PDF, enhanced is the full structure
        return ok({
            "resume": formatted_resume,  # This is what frontend uses for PDF generation
            "enhanced": enhanced_resume  # Full enhanced structure
        })
    except Exception as e:
        import traceback
        print(f"Error generating resume: {e}\n{traceback.format_exc()}")
        return err(f"Error generating resume: {str(e)}", 500)

@ai_bp.route("/generate-resume-pdf", methods=["POST"])
@cross_origin()
def generate_resume_pdf():
    """Generate AI-enhanced resume PDF using templates and return PDF file."""
    from flask import send_file
    data = request.get_json(force=True)
    resume_data = data.get("resume_data")
    template = data.get("template", "ats-modern")
    
    if not resume_data:
        return err("resume_data required", 400)
    
    try:
        # Step 1: Generate AI-enhanced resume content
        from ..ai_engine.resume_generator import generate_ai_resume_template, format_resume_for_pdf
        enhanced_resume = generate_ai_resume_template(resume_data, template)
        formatted_resume = format_resume_for_pdf(enhanced_resume, template)
        
        # Step 2: Generate PDF using template
        from ..ai_engine.pdf_generator import generate_pdf_resume
        pdf_buffer = generate_pdf_resume(formatted_resume, template)
        
        # Step 3: Return PDF file
        name = formatted_resume.get("header", {}).get("name", "resume")
        filename = f"{name.replace(' ', '_')}_{template}_resume.pdf"
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        import traceback
        print(f"Error generating PDF resume: {e}\n{traceback.format_exc()}")
        return err(f"Error generating PDF resume: {str(e)}", 500)
