import requests
from ..config import Config

def summarize_text_ai(text: str) -> str:
    """Generate AI summary of text."""
    try:
        if not Config.HF_API_KEY:
            # Fallback: simple truncation
            words = text.split()
            return " ".join(words[:50]) + "..." if len(words) > 50 else text
        
        # Use Hugging Face summarization model
        # Note: Fallback works if HF API is unavailable
        api_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
        headers = {"Authorization": f"Bearer {Config.HF_API_KEY}"}
        
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": text[:1024]},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get("summary_text", text[:200] + "...")
        
        # Fallback
        words = text.split()
        return " ".join(words[:50]) + "..." if len(words) > 50 else text
    except Exception as e:
        words = text.split()
        return " ".join(words[:50]) + "..." if len(words) > 50 else text

def seo_description_ai(text: str) -> str:
    """Generate SEO-friendly description."""
    try:
        summary = summarize_text_ai(text)
        # Ensure it's within 160 characters for SEO
        if len(summary) > 160:
            return summary[:157] + "..."
        return summary
    except Exception:
        return text[:160] if len(text) > 160 else text

