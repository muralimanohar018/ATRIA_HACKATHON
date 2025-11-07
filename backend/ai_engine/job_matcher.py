"""Job matching utilities leveraging resume parsing insights."""

from __future__ import annotations

from typing import Dict, List, Tuple

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.ai_engine.resume_parser import SKILLS


def _prepare_documents(resume_text: str, job_description: str) -> Tuple[str, str]:
    """Normalize and validate text documents for similarity analysis."""

    resume = (resume_text or "").strip()
    job = (job_description or "").strip()
    return resume, job


def calculate_job_fit(resume_text: str, job_description: str) -> float:
    """Calculate job fit percentage using TF-IDF cosine similarity.

    Args:
        resume_text: Cleaned resume text.
        job_description: Target job description text.

    Returns:
        Job fit score as a percentage rounded to two decimals.
    """

    resume, job = _prepare_documents(resume_text, job_description)

    if not resume or not job:
        return 0.0

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        vectors = vectorizer.fit_transform([resume, job])
        similarity_matrix = cosine_similarity(vectors[0:1], vectors[1:2])
        score = float(np.clip(similarity_matrix[0][0], 0.0, 1.0) * 100)
    except ValueError:
        return 0.0
    except Exception as exc:  # pragma: no cover - defensive path
        raise RuntimeError(f"Failed to calculate job fit score: {exc}") from exc

    return round(score, 2)


def extract_skill_match(resume_text: str, job_description: str) -> Dict[str, List[str]]:
    """Identify overlapping and missing skills between resume and job description."""

    resume, job = _prepare_documents(resume_text, job_description)

    resume_lower = resume.lower()
    job_lower = job.lower()

    matched_skills = sorted({skill for skill in SKILLS if skill in resume_lower and skill in job_lower})
    job_skills = {skill for skill in SKILLS if skill in job_lower}
    missing_skills = sorted(job_skills.difference(matched_skills))

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }


def build_candidate_profile(fields: Dict[str, object], score: float) -> Dict[str, object]:
    """Construct a candidate profile summary.

    Args:
        fields: Field dictionary produced by `extract_fields`.
        score: Job fit score as a percentage.

    Returns:
        Structured candidate profile including a recommendation label.
    """

    if fields is None:
        fields = {}

    safe_skills = fields.get("skills", []) if isinstance(fields.get("skills"), list) else []
    experience = fields.get("experience", 0)
    education = fields.get("education", "")

    if score >= 75:
        recommendation = "Shortlist"
    elif score >= 50:
        recommendation = "Maybe shortlist"
    else:
        recommendation = "Reject"

    return {
        "skills": safe_skills,
        "experience": experience,
        "education": education,
        "job_fit": round(score, 2),
        "recommendation": recommendation,
    }

