"""AI-assisted case study analyzer using Hugging Face Inference API."""

from __future__ import annotations

import json
import os
import re
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

MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8B-Instruct"


def analyze_case_study_ai(text: str) -> Dict[str, Any]:
    """Analyze a case study and return structured insights as JSON."""

    prompt = (
        "Analyze this case study and return JSON:\n"
        "{\n"
        "   \"summary\": \"...\",\n"
        "   \"key_insights\": [...],\n"
        "   \"challenges\": [...],\n"
        "   \"recommendations\": [...]\n"
        "}\n"
        f"Case Study:\n{text}"
    )

    payload: Dict[str, Any] = {
        "inputs": prompt,
        "parameters": {
            "temperature": 0.2,
            "max_new_tokens": 512,
        },
        "options": {
            "wait_for_model": True,
        },
    }

    try:
        response = requests.post(MODEL_URL, headers=HEADERS, json=payload, timeout=60)
    except requests.RequestException as exc:  # pragma: no cover - network dependent
        raise RuntimeError(f"Failed to call Hugging Face API: {exc}") from exc

    if response.status_code != 200:
        raise RuntimeError(
            f"Hugging Face API error {response.status_code}: {response.text}"
        )

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError("Failed to parse Hugging Face response JSON.") from exc

    generated_text = None
    if isinstance(data, list) and data:
        generated_text = data[0].get("generated_text")
    elif isinstance(data, dict):
        generated_text = data.get("generated_text")

    if not isinstance(generated_text, str):
        raise RuntimeError("Case study model response missing 'generated_text'.")

    return clean_json_output(generated_text)


def clean_json_output(text: str) -> Dict[str, Any]:
    """Extract and sanitize JSON content from model output."""

    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx == -1 or end_idx == -1 or end_idx <= start_idx:
        raise RuntimeError("No JSON object found in AI output.")

    json_candidate = text[start_idx : end_idx + 1]

    json_candidate = re.sub(r"'(?=[^\"]*?(?:\"|$))", '"', json_candidate)
    json_candidate = re.sub(r",\s*(?=[}\]])", "", json_candidate)

    try:
        parsed = json.loads(json_candidate)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Failed to parse cleaned AI JSON output.") from exc

    return parsed


__all__ = ["analyze_case_study_ai"]


