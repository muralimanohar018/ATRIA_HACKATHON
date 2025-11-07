"""Generate professional emails using Hugging Face Inference API."""

from __future__ import annotations

import os
from typing import Any, Dict

import requests
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN_ENV = "HUGGINGFACE_API_KEY"
API_TOKEN = os.getenv(HF_TOKEN_ENV)

if not API_TOKEN:
    raise RuntimeError(
        f"Missing {HF_TOKEN_ENV} environment variable required for Hugging Face API access."
    )


HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
}

MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"


def generate_job_email(name: str, job_title: str) -> str:
    """Generate a professional email offering a job opportunity."""

    prompt = (
        "Write a professional email for inviting a candidate to apply for a job opportunity.\n"
        f"Candidate Name: {name}\nJob Title: {job_title}"
    )
    return _invoke_model(prompt, "Failed to generate job email")


def generate_contact_email(name: str) -> str:
    """Generate a professional email for contacting a candidate."""

    prompt = (
        "Write a professional email for reaching out to a candidate to discuss potential opportunities.\n"
        f"Candidate Name: {name}"
    )
    return _invoke_model(prompt, "Failed to generate contact email")


def generate_shortlist_email(name: str, job_title: str) -> str:
    """Generate a professional email for notifying a candidate of shortlist status."""

    prompt = (
        "Write a professional email for congratulating a candidate on being shortlisted for a job.\n"
        f"Candidate Name: {name}\nJob Title: {job_title}"
    )
    return _invoke_model(prompt, "Failed to generate shortlist email")


def _invoke_model(prompt: str, error_prefix: str) -> str:
    """Call the Hugging Face model and return generated text."""

    payload: Dict[str, Any] = {"inputs": prompt}

    try:
        response = requests.post(MODEL_URL, headers=HEADERS, json=payload, timeout=60)
    except requests.RequestException as exc:  # pragma: no cover - network dependent
        raise RuntimeError(f"{error_prefix}: {exc}") from exc

    if response.status_code != 200:
        raise RuntimeError(
            f"{error_prefix}: {response.status_code} {response.text}"
        )

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError("Failed to parse Hugging Face response JSON.") from exc

    if not isinstance(data, list) or not data:
        raise RuntimeError("Unexpected response format from email model.")

    generated_text = data[0].get("generated_text")
    if not isinstance(generated_text, str):
        raise RuntimeError("Email model response missing 'generated_text'.")

    return generated_text


__all__ = [
    "generate_job_email",
    "generate_contact_email",
    "generate_shortlist_email",
]


