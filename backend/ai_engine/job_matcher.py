"""Helpers for calling Hugging Face Inference API to score resume job fit."""

from __future__ import annotations

import requests, os, json, re
from typing import Any, Dict

from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8B-Instruct"
API_TOKEN_ENV = "HUGGINGFACE_API_KEY"


def get_ai_job_match(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Fetch an AI-based job match analysis from Hugging Face Inference API.

    Args:
        resume_text: Plain text of the candidate's resume.
        job_description: Plain text description of the job role.

    Returns:
        Parsed dictionary containing match insights.

    Raises:
        RuntimeError: If the API call fails or returns malformed data.
    """

    api_token = os.getenv(API_TOKEN_ENV)
    if not api_token:
        raise RuntimeError(f"Missing {API_TOKEN_ENV} environment variable for Hugging Face token.")

    prompt = (
        "You are an expert technical recruiter. Given the resume and job description, "
        "produce ONLY valid JSON with this schema:\n"
        "{\n"
        "  \"match_score\": integer between 0 and 100,\n"
        "  \"matched_skills\": array of strings,\n"
        "  \"missing_skills\": array of strings,\n"
        "  \"strengths\": array of strings,\n"
        "  \"weaknesses\": array of strings,\n"
        "  \"recommendation\": one of [\"Shortlist\", \"Maybe\", \"Reject\"]\n"
        "}\n"
        "Resume:\n"
        f"{resume_text}\n\n"
        "Job Description:\n"
        f"{job_description}\n"
    )

    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "temperature": 0.2,
            "max_new_tokens": 512,
        },
        "options": {
            "wait_for_model": True,
        },
    }

    response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    if response.status_code != 200:
        raise RuntimeError(
            f"Hugging Face API error {response.status_code}: {response.text}"
        )

    try:
        data = response.json()
    except json.JSONDecodeError as exc:  # pragma: no cover - network dependent
        raise RuntimeError("Failed to parse Hugging Face response as JSON.") from exc

    generated_text = None
    if isinstance(data, list) and data:
        generated_text = data[0].get("generated_text")
    elif isinstance(data, dict):
        generated_text = data.get("generated_text")

    if not generated_text:
        raise RuntimeError("Hugging Face API did not return generated_text.")

    return clean_json_output(generated_text)


def clean_json_output(text: str) -> Dict[str, Any]:
    """Normalize JSON-looking AI output into a Python dictionary.

    Args:
        text: Raw text containing JSON.

    Returns:
        Parsed dictionary extracted from the text.

    Raises:
        RuntimeError: If valid JSON cannot be extracted.
    """

    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx == -1 or end_idx == -1 or end_idx <= start_idx:
        raise RuntimeError("No JSON object found in AI output.")

    json_candidate = text[start_idx : end_idx + 1]

    # Replace single quotes with double quotes when they appear as string delimiters.
    json_candidate = re.sub(r"'(?=[^\"]*?(?:\"|$))", '"', json_candidate)

    # Remove trailing commas before closing braces/brackets.
    json_candidate = re.sub(r",\s*(?=[}\]])", "", json_candidate)

    # Ensure recommendation is capitalized correctly.
    json_candidate = re.sub(
        r"\"recommendation\"\s*:\s*\"(shortlist|maybe|reject)\"",
        lambda m: f'"recommendation": "{m.group(1).capitalize()}"',
        json_candidate,
    )

    try:
        parsed = json.loads(json_candidate)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Failed to cleanly parse AI JSON output.") from exc

    return parsed


__all__ = ["get_ai_job_match", "clean_json_output"]


