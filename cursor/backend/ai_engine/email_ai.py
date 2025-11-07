from ..config import Config

def generate_job_email(name: str, job_title: str) -> str:
    """Generate AI-powered job application confirmation email."""
    return f"""
Dear {name},

Thank you for your interest in the {job_title} position at {Config.COMPANY_NAME}.

We have received your application and our team will review it carefully. We appreciate the time you took to apply and will get back to you soon.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_contact_email(name: str) -> str:
    """Generate AI-powered contact form confirmation email."""
    return f"""
Dear {name},

Thank you for reaching out to {Config.COMPANY_NAME}. We have received your message and will respond to you shortly.

We appreciate your interest and look forward to connecting with you.

Best regards,
{Config.COMPANY_NAME} Team
"""

def generate_shortlist_email(name: str, job_title: str) -> str:
    """Generate AI-powered shortlist notification email."""
    return f"""
Dear {name},

Congratulations! Your application for the {job_title} position at {Config.COMPANY_NAME} has been shortlisted.

Our team will contact you soon to schedule the next steps in the recruitment process.

Best regards,
{Config.COMPANY_NAME} Team
"""

