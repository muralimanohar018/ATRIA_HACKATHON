"""Resume parsing utilities for text extraction and field identification."""

from __future__ import annotations

import os
import re
from typing import Dict, List

from docx2txt import process as docx_process
from pdfminer.high_level import extract_text as pdf_extract_text


SKILLS: List[str] = [
    "python",
    "java",
    "c++",
    "sql",
    "javascript",
    "react",
    "django",
    "flask",
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "machine learning",
    "data analysis",
]

EDUCATION_LEVELS = [
    (re.compile(r"\bm\.tech\b", re.IGNORECASE), "M.Tech"),
    (re.compile(r"\bm\s*tech\b", re.IGNORECASE), "M.Tech"),
    (re.compile(r"\bb\.tech\b", re.IGNORECASE), "B.Tech"),
    (re.compile(r"\bb\s*tech\b", re.IGNORECASE), "B.Tech"),
    (re.compile(r"\bb\.e\b", re.IGNORECASE), "B.E"),
    (re.compile(r"\bdiploma\b", re.IGNORECASE), "Diploma"),
]


def extract_text(file_path: str) -> str:
    """Extract plain text from a PDF or DOCX resume.

    Args:
        file_path: Absolute or relative path to the resume file.

    Returns:
        Cleaned plain text content from the resume.

    Raises:
        FileNotFoundError: If the provided file path does not exist.
        ValueError: If the file extension is unsupported.
        RuntimeError: If extraction fails for the given file.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File does not exist: {file_path}")

    _, extension = os.path.splitext(file_path)
    extension = extension.lower()

    try:
        if extension == ".pdf":
            raw_text = pdf_extract_text(file_path) or ""
        elif extension == ".docx":
            raw_text = docx_process(file_path) or ""
        else:
            raise ValueError(f"Unsupported file type: {extension}")
    except ValueError:
        raise
    except Exception as exc:  # pragma: no cover - defensive path
        raise RuntimeError(f"Failed to extract text: {exc}") from exc

    cleaned_text = re.sub(r"\s+", " ", raw_text).strip()
    return cleaned_text


def extract_fields(text: str) -> Dict[str, object]:
    """Extract structured resume information from raw text.

    Args:
        text: Plain text representation of a resume.

    Returns:
        Dictionary containing extracted skills, experience (years) and education level.
    """

    normalized_text = (text or "").strip()
    lowered_text = normalized_text.lower()

    skills_found = [skill for skill in SKILLS if skill in lowered_text]

    experience_years = 0
    experience_pattern = re.compile(
        r"(?P<years>\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:years?|yrs?)",
        re.IGNORECASE,
    )

    experience_matches = experience_pattern.findall(lowered_text)
    if experience_matches:
        try:
            experience_years = int(float(max(experience_matches, key=lambda val: float(val))))
        except ValueError:
            experience_years = 0

    education_level = ""
    for pattern, label in EDUCATION_LEVELS:
        if pattern.search(normalized_text):
            education_level = label
            break

    return {
        "skills": skills_found,
        "experience": experience_years,
        "education": education_level,
    }

