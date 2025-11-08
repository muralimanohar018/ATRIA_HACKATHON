import requests
from ..config import Config

def generate_ai_email_content(prompt: str) -> str:
    """Generate email content using AI (Hugging Face) with fallback."""
    try:
        if not Config.HF_API_KEY:
            return None  # Will use template fallback
        
        # Use Hugging Face text generation model
        api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
        headers = {"Authorization": f"Bearer {Config.HF_API_KEY}"}
        
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": prompt[:200]},
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                generated = result[0].get("generated_text", "")
                if generated and len(generated) > 20:
                    # Clean up the generated text
                    generated = generated.replace(prompt, "").strip()
                    if generated:
                        return generated[:500]  # Limit length
    except Exception:
        pass
    
    return None  # Fallback to template

def generate_job_email(name: str, job_title: str) -> str:
    """Generate AI-powered job application confirmation email."""
    # Try AI generation first
    prompt = f"Write a professional email thanking {name} for applying to {job_title} position at {Config.COMPANY_NAME}. Be warm and professional."
    ai_content = generate_ai_email_content(prompt)
    
    if ai_content:
        return f"""
Dear {name},

{ai_content}

Thank you for your interest in the {job_title} position at {Config.COMPANY_NAME}.

We have received your application and our team will review it carefully. We appreciate the time you took to apply and will get back to you soon.

Best regards,
{Config.COMPANY_NAME} Team
"""
    
    # Fallback template
    return f"""
Dear {name},

Thank you for your interest in the {job_title} position at {Config.COMPANY_NAME}.

We have received your application and our team will review it carefully. We appreciate the time you took to apply and will get back to you soon.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_contact_email(name: str) -> str:
    """Generate AI-powered contact form confirmation email."""
    # Try AI generation first
    prompt = f"Write a professional email thanking {name} for contacting {Config.COMPANY_NAME}. Be warm and welcoming."
    ai_content = generate_ai_email_content(prompt)
    
    if ai_content:
        return f"""
Dear {name},

{ai_content}

Thank you for reaching out to {Config.COMPANY_NAME}. We have received your message and will respond to you shortly.

We appreciate your interest and look forward to connecting with you.

Best regards,
{Config.COMPANY_NAME} Team
"""
    
    # Fallback template
    return f"""
Dear {name},

Thank you for reaching out to {Config.COMPANY_NAME}. We have received your message and will respond to you shortly.

We appreciate your interest and look forward to connecting with you.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_shortlist_email(name: str, job_title: str) -> str:
    """Generate AI-powered shortlist notification email."""
    # Try AI generation first
    prompt = f"Write a congratulatory email to {name} informing them their application for {job_title} at {Config.COMPANY_NAME} has been shortlisted. Be professional and encouraging."
    ai_content = generate_ai_email_content(prompt)
    
    if ai_content:
        return f"""
Dear {name},

{ai_content}

Congratulations! Your application for the {job_title} position at {Config.COMPANY_NAME} has been shortlisted.

Our team will contact you soon to schedule the next steps in the recruitment process.

Best regards,
{Config.COMPANY_NAME} Team
"""
    
    # Fallback template
    return f"""
Dear {name},

Congratulations! Your application for the {job_title} position at {Config.COMPANY_NAME} has been shortlisted.

Our team will contact you soon to schedule the next steps in the recruitment process.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_welcome_email(name: str, username: str) -> str:
    """Generate AI-powered welcome email for admin registration."""
    # Try AI generation first
    prompt = f"Write a professional welcome email to {name} (username: {username}) for registering as admin at {Config.COMPANY_NAME}. Be welcoming and professional."
    ai_content = generate_ai_email_content(prompt)
    
    if ai_content:
        return f"""
Dear {name},

{ai_content}

Welcome to {Config.COMPANY_NAME}! Your admin account has been successfully created.

Username: {username}

You can now access the admin dashboard to manage the website content, view analytics, and handle applications.

Best regards,
{Config.COMPANY_NAME} Team
"""
    
    # Fallback template
    return f"""
Dear {name},

Welcome to {Config.COMPANY_NAME}! Your admin account has been successfully created.

Username: {username}

You can now access the admin dashboard to manage the website content, view analytics, and handle applications.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_resume_email(name: str, filename: str) -> str:
    """Generate AI-powered email for resume delivery."""
    # Try AI generation first
    prompt = f"Write a professional email to {name} informing them that their resume has been generated and is attached. Be warm and encouraging."
    ai_content = generate_ai_email_content(prompt)
    
    if ai_content:
        return f"""
Dear {name},

{ai_content}

Your professional resume has been generated and is attached to this email.

Filename: {filename}

This resume has been optimized for ATS (Applicant Tracking Systems) and is ready to use for your job applications.

If you have any questions or need any modifications, please don't hesitate to reach out to us.

Best regards,
{Config.COMPANY_NAME} Team
"""
    
    # Fallback template
    return f"""
Dear {name},

Thank you for using our Resume Builder service!

Your professional resume has been generated and is attached to this email.

Filename: {filename}

This resume has been optimized for ATS (Applicant Tracking Systems) and is ready to use for your job applications. We've enhanced it with AI-powered suggestions to make it stand out to recruiters.

Key features of your resume:
• ATS-friendly format
• Professional layout
• AI-enhanced content
• Ready for job applications

If you have any questions or need any modifications, please don't hesitate to reach out to us.

Best of luck with your job search!

Best regards,
{Config.COMPANY_NAME} Team
"""

