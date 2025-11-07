"""Flask Blueprint for AI engine API routes."""

from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from ..ai_engine.resume_parser import extract_text, extract_fields
from ..ai_engine.job_matcher import get_ai_job_match
from ..ai_engine.summarizer import summarize_text_ai, seo_description_ai
from ..ai_engine.testimonial_ai import rephrase_testimonial_ai
from ..ai_engine.case_study_ai import analyze_case_study_ai
from ..ai_engine.email_ai import (
    generate_job_email,
    generate_contact_email,
    generate_shortlist_email,
)

ai_bp = Blueprint("ai_bp", __name__)


@ai_bp.route("/parse-resume", methods=["POST"])
@cross_origin()
def parse_resume():
    """Parse resume file and extract text and structured fields.

    Body: { "file_path": "path/to/resume.pdf" }
    Returns: { "success": true, "data": { "text": "...", "fields": {...} } }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        file_path = data.get("file_path")
        if not file_path:
            return jsonify({"success": False, "error": "Missing required field: file_path"}), 400

        extracted_text = extract_text(file_path)
        extracted_fields = extract_fields(extracted_text)

        return jsonify(
            {
                "success": True,
                "data": {
                    "text": extracted_text,
                    "fields": extracted_fields,
                },
            }
        )

    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/job-match", methods=["POST"])
@cross_origin()
def job_match():
    """Get AI-based job match analysis.

    Body: { "resume_text": "...", "job_description": "..." }
    Returns: { "success": true, "data": {...} }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        resume_text = data.get("resume_text")
        job_description = data.get("job_description")

        if not resume_text:
            return jsonify({"success": False, "error": "Missing required field: resume_text"}), 400
        if not job_description:
            return jsonify({"success": False, "error": "Missing required field: job_description"}), 400

        match_result = get_ai_job_match(resume_text, job_description)

        return jsonify({"success": True, "data": match_result})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/summarize", methods=["POST"])
@cross_origin()
def summarize():
    """Generate a summary of the provided text.

    Body: { "text": "..." }
    Returns: { "success": true, "data": "summary text" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        text = data.get("text")
        if not text:
            return jsonify({"success": False, "error": "Missing required field: text"}), 400

        summary = summarize_text_ai(text)

        return jsonify({"success": True, "data": summary})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/seo", methods=["POST"])
@cross_origin()
def seo():
    """Generate an SEO meta description for the provided text.

    Body: { "text": "..." }
    Returns: { "success": true, "data": "seo description" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        text = data.get("text")
        if not text:
            return jsonify({"success": False, "error": "Missing required field: text"}), 400

        seo_desc = seo_description_ai(text)

        return jsonify({"success": True, "data": seo_desc})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/rephrase", methods=["POST"])
@cross_origin()
def rephrase():
    """Rephrase a testimonial in a professional tone.

    Body: { "text": "..." }
    Returns: { "success": true, "data": "rephrased text" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        text = data.get("text")
        if not text:
            return jsonify({"success": False, "error": "Missing required field: text"}), 400

        rephrased = rephrase_testimonial_ai(text)

        return jsonify({"success": True, "data": rephrased})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/case-study", methods=["POST"])
@cross_origin()
def case_study():
    """Analyze a case study and return structured insights.

    Body: { "text": "..." }
    Returns: { "success": true, "data": {...} }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        text = data.get("text")
        if not text:
            return jsonify({"success": False, "error": "Missing required field: text"}), 400

        analysis = analyze_case_study_ai(text)

        return jsonify({"success": True, "data": analysis})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/email/job", methods=["POST"])
@cross_origin()
def email_job():
    """Generate a professional job offer email.

    Body: { "name": "...", "job_title": "..." }
    Returns: { "success": true, "data": "generated email" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        name = data.get("name")
        job_title = data.get("job_title")

        if not name:
            return jsonify({"success": False, "error": "Missing required field: name"}), 400
        if not job_title:
            return jsonify({"success": False, "error": "Missing required field: job_title"}), 400

        email = generate_job_email(name, job_title)

        return jsonify({"success": True, "data": email})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/email/contact", methods=["POST"])
@cross_origin()
def email_contact():
    """Generate a professional contact email.

    Body: { "name": "..." }
    Returns: { "success": true, "data": "generated email" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        name = data.get("name")
        if not name:
            return jsonify({"success": False, "error": "Missing required field: name"}), 400

        email = generate_contact_email(name)

        return jsonify({"success": True, "data": email})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@ai_bp.route("/email/shortlist", methods=["POST"])
@cross_origin()
def email_shortlist():
    """Generate a professional shortlist notification email.

    Body: { "name": "...", "job_title": "..." }
    Returns: { "success": true, "data": "generated email" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body must be JSON"}), 400

        name = data.get("name")
        job_title = data.get("job_title")

        if not name:
            return jsonify({"success": False, "error": "Missing required field: name"}), 400
        if not job_title:
            return jsonify({"success": False, "error": "Missing required field: job_title"}), 400

        email = generate_shortlist_email(name, job_title)

        return jsonify({"success": True, "data": email})

    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500

