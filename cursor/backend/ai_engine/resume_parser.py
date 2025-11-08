import os
from pdfminer.high_level import extract_text as extract_pdf
import docx2txt
from ..config import Config

def extract_text(file_path: str) -> str:
    """Extract text from PDF or DOCX file."""
    try:
        if file_path.endswith('.pdf'):
            return extract_pdf(file_path)
        elif file_path.endswith('.docx') or file_path.endswith('.doc'):
            return docx2txt.process(file_path)
        else:
            return ""
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def extract_fields(text: str) -> dict:
    """Extract structured fields from resume text."""
    # Simple field extraction - can be enhanced with AI
    fields = {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": "",
        "education": ""
    }
    
    # Extract email
    import re
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    if email_match:
        fields["email"] = email_match.group()
    
    # Extract phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        fields["phone"] = phone_match.group()
    
    # Extract skills (basic keyword matching)
    skill_keywords = ["Python", "JavaScript", "React", "Flask", "SQL", "AI", "ML", "AWS", "Docker"]
    fields["skills"] = [skill for skill in skill_keywords if skill.lower() in text.lower()]
    
    return fields

