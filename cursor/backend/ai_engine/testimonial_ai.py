import requests
from ..config import Config

def rephrase_testimonial_ai(raw_text: str) -> str:
    """Rephrase and polish testimonial text using AI."""
    try:
        if not Config.HF_API_KEY:
            # Fallback: simple capitalization and cleanup
            return raw_text.strip().capitalize()
        
        # Use Hugging Face text generation for rephrasing
        # Note: Fallback works if HF API is unavailable
        api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
        headers = {"Authorization": f"Bearer {Config.HF_API_KEY}"}
        
        prompt = f"Rephrase this testimonial professionally: {raw_text[:200]}"
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": prompt},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                generated = result[0].get("generated_text", "")
                if generated:
                    # Extract the rephrased part
                    if prompt.lower() in generated.lower():
                        return generated.replace(prompt, "").strip()
                    return generated.strip()
        
        # Fallback
        return raw_text.strip().capitalize()
    except Exception as e:
        return raw_text.strip().capitalize()

