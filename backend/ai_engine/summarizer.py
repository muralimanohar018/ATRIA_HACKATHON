"""Hugging Face powered helpers for text summarization and SEO snippets."""

from __future__ import annotations

import os
from typing import Any, Dict, List

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


def summarize_text_ai(text: str) -> str:
    """Generate a 2–3 sentence summary using facebook/bart-large-cnn."""

    url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    payload: Dict[str, Any] = {"inputs": text}
    data = _post_hf(url, payload, "Failed to generate summary")

    if not isinstance(data, list) or not data:
        raise RuntimeError("Unexpected response format from summarization model.")

    summary = data[0].get("summary_text")
    if not isinstance(summary, str):
        raise RuntimeError("Summarization model response missing 'summary_text'.")

    return summary


def seo_description_ai(text: str) -> str:
    """Generate a 160-character SEO meta description using google/flan-t5-large."""

    url = "https://api-inference.huggingface.co/models/google/flan-t5-large"
    prompt = (
        "Write a 160-character SEO meta description for this content:\n"
        f"{text}"
    )
    payload: Dict[str, Any] = {"inputs": prompt}
    data = _post_hf(url, payload, "Failed to generate SEO description")

    if not isinstance(data, list) or not data:
        raise RuntimeError("Unexpected response format from SEO model.")

    generated_text = data[0].get("generated_text")
    if not isinstance(generated_text, str):
        raise RuntimeError("SEO model response missing 'generated_text'.")

    return generated_text[:160]


def _post_hf(url: str, payload: Dict[str, Any], error_prefix: str) -> Any:
    """Send a POST request to Hugging Face Inference API with basic error handling."""

    try:
        response = requests.post(url, headers=HEADERS, json=payload, timeout=60)
    except requests.RequestException as exc:  # pragma: no cover - network dependent
        raise RuntimeError(f"{error_prefix}: {exc}") from exc

    if response.status_code != 200:
        raise RuntimeError(
            f"{error_prefix}: {response.status_code} {response.text}"
        )

    try:
        return response.json()
    except ValueError as exc:
        raise RuntimeError("Failed to parse Hugging Face response JSON.") from exc


__all__ = ["summarize_text_ai", "seo_description_ai"]


