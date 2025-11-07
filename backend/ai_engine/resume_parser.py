"""Utilities for extracting structured information from resume files."""

from __future__ import annotations

import os
import re
from typing import Dict, List

from docx2txt import docx2txt
from pdfminer.high_level import extract_text as pdf_extract_text


SKILL_LIST: List[str] = [
    "python",
    "java",
    "c++",
    "javascript",
    "sql",
    "machine learning",
    "deep learning",
    "django",
    "flask",
    "react",
    "node.js",
]


def extract_text(file_path: str) -> str:
    """Extract raw text from a resume file.

    Args:
        file_path: Absolute or relative path to the resume file.

    Returns:
        A whitespace-normalized string containing the extracted text.

    Raises:
        ValueError: If the file extension is unsupported or extraction fails.
    """

    _, ext = os.path.splitext(file_path.lower())

    try:
        if ext == ".pdf":
            raw_text = pdf_extract_text(file_path)
        elif ext in {".docx"}:
            raw_text = docx2txt.process(file_path)
        else:
            raise ValueError(f"Unsupported resume format: {ext}")
    except Exception as exc:  # pragma: no cover - error handling path
        raise ValueError(f"Failed to extract text from {file_path}: {exc}") from exc

    if not raw_text:
        return ""

    cleaned_text = re.sub(r"\s+", " ", raw_text).strip()
    return cleaned_text


def extract_fields(text: str) -> Dict[str, object]:
    """Extract structured resume information from plain text.

    Args:
        text: Resume content as a string.

    Returns:
        A dictionary with extracted `skills`, `experience`, and `education` data.
    """

    lowered_text = text.lower()

    skills = [skill for skill in SKILL_LIST if skill in lowered_text]

    experience_match = re.search(r"(\d+)\s*(?:years?|yrs?)", lowered_text)
    experience = int(experience_match.group(1)) if experience_match else None

    education_keywords = [
        ("B.E", r"b\.e\.", "Bachelor of Engineering"),
        ("B.Tech", r"b\.tech", "Bachelor of Technology"),
        ("M.Tech", r"m\.tech", "Master of Technology"),
        ("Diploma", r"diploma", "Diploma"),
    ]

    education = None
    for label, pattern, normalized in education_keywords:
        if re.search(pattern, lowered_text):
            education = normalized
            break

    return {
        "skills": skills,
        "experience": experience,
        "education": education,
    }


__all__ = ["extract_text", "extract_fields"]


