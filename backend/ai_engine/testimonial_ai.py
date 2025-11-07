"""AI helper for rewriting testimonials via Hugging Face Inference API."""

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


def rephrase_testimonial_ai(text: str) -> str:
    """Rewrite a testimonial in a professional, polished, positive tone."""

    prompt = (
        "Rewrite this testimonial in a professional, polished, positive tone:\n"
        f"{text}"
    )
    payload: Dict[str, Any] = {"inputs": prompt}

    try:
        response = requests.post(MODEL_URL, headers=HEADERS, json=payload, timeout=60)
    except requests.RequestException as exc:  # pragma: no cover - depends on network
        raise RuntimeError(f"Failed to call Hugging Face API: {exc}") from exc

    if response.status_code != 200:
        raise RuntimeError(
            f"Hugging Face API error {response.status_code}: {response.text}"
        )

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError("Failed to parse Hugging Face response JSON.") from exc

    if not isinstance(data, list) or not data:
        raise RuntimeError("Unexpected response format from testimonial model.")

    generated_text = data[0].get("generated_text")
    if not isinstance(generated_text, str):
        raise RuntimeError("Testimonial model response missing 'generated_text'.")

    return generated_text


__all__ = ["rephrase_testimonial_ai"]


