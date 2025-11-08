"""
AI-Powered PDF Resume Generator with Multiple Templates
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from io import BytesIO
from ..config import Config

def generate_pdf_resume(resume_data: dict, template: str = "ats-modern") -> BytesIO:
    """
    Generate PDF resume using AI-enhanced data and selected template.
    
    Args:
        resume_data: Dictionary with resume information (header, summary, experience, etc.)
        template: Template style (ats-modern, ats-classic, professional, executive)
    
    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Get template-specific styles
    styles = get_template_styles(template)
    story = []
    
    # Generate content based on template
    if template == "ats-modern":
        story = generate_ats_modern_template(resume_data, styles)
    elif template == "ats-classic":
        story = generate_ats_classic_template(resume_data, styles)
    elif template == "professional":
        story = generate_professional_template(resume_data, styles)
    elif template == "executive":
        story = generate_executive_template(resume_data, styles)
    else:
        story = generate_ats_modern_template(resume_data, styles)  # Default
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

def get_template_styles(template: str):
    """Get styles for the selected template."""
    styles = getSampleStyleSheet()
    
    # Custom styles
    custom_styles = {
        'header_name': ParagraphStyle(
            'HeaderName',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#00B8D4') if template in ['ats-modern', 'professional'] else colors.HexColor('#1a1a1a'),
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            spaceAfter=6
        ),
        'header_contact': ParagraphStyle(
            'HeaderContact',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
            spaceAfter=12
        ),
        'section_heading': ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#00B8D4') if template in ['ats-modern', 'professional'] else colors.HexColor('#1a1a1a'),
            fontName='Helvetica-Bold',
            spaceAfter=6,
            spaceBefore=12
        ),
        'body_text': ParagraphStyle(
            'BodyText',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#333333'),
            alignment=TA_JUSTIFY,
            spaceAfter=6
        ),
        'experience_title': ParagraphStyle(
            'ExperienceTitle',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#1a1a1a'),
            fontName='Helvetica-Bold',
            spaceAfter=2
        ),
        'experience_company': ParagraphStyle(
            'ExperienceCompany',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            fontName='Helvetica',
            spaceAfter=4
        ),
    }
    
    return {**styles, **custom_styles}

def generate_ats_modern_template(resume_data: dict, styles: dict):
    """Generate ATS Modern template."""
    story = []
    header = resume_data.get("header", {})
    
    # Header Section
    story.append(Paragraph(header.get("name", "Your Name"), styles['header_name']))
    
    # Contact Info
    contact_parts = []
    if header.get("email"):
        contact_parts.append(header["email"])
    if header.get("phone"):
        contact_parts.append(header["phone"])
    if header.get("address"):
        contact_parts.append(header["address"])
    if header.get("linkedin"):
        contact_parts.append(f"LinkedIn: {header['linkedin']}")
    if header.get("github"):
        contact_parts.append(f"GitHub: {header['github']}")
    
    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), styles['header_contact']))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Professional Summary
    summary = resume_data.get("summary", "")
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", styles['section_heading']))
        story.append(Paragraph(summary, styles['body_text']))
        story.append(Spacer(1, 0.15*inch))
    
    # Experience Section
    experience = resume_data.get("experience", [])
    if experience:
        story.append(Paragraph("PROFESSIONAL EXPERIENCE", styles['section_heading']))
        for exp in experience:
            position = exp.get("position", "")
            company = exp.get("company", "")
            period = exp.get("period", exp.get("startDate", "") + " - " + exp.get("endDate", "Present"))
            description = exp.get("description", "")
            
            # Title and Company
            title_text = f"{position}" if position else ""
            if company:
                title_text += f" | {company}"
            if period:
                title_text += f" | {period}"
            
            story.append(Paragraph(title_text, styles['experience_title']))
            
            # Description
            if description:
                story.append(Paragraph(description, styles['body_text']))
            
            story.append(Spacer(1, 0.1*inch))
        story.append(Spacer(1, 0.1*inch))
    
    # Education Section
    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", styles['section_heading']))
        for edu in education:
            degree = edu.get("degree", "")
            field = edu.get("field", "")
            institution = edu.get("institution", "")
            year = edu.get("year", "")
            
            edu_text = ""
            if degree:
                edu_text = degree
            if field:
                edu_text += f" in {field}"
            if institution:
                edu_text += f" | {institution}"
            if year:
                edu_text += f" | {year}"
            
            if edu_text:
                story.append(Paragraph(edu_text, styles['body_text']))
            story.append(Spacer(1, 0.05*inch))
        story.append(Spacer(1, 0.1*inch))
    
    # Skills Section
    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", styles['section_heading']))
        skills_text = ", ".join(skills)
        story.append(Paragraph(skills_text, styles['body_text']))
        story.append(Spacer(1, 0.15*inch))
    
    # Achievements Section
    achievements = resume_data.get("achievements", [])
    if achievements:
        story.append(Paragraph("KEY ACHIEVEMENTS", styles['section_heading']))
        for achievement in achievements:
            story.append(Paragraph(f"• {achievement}", styles['body_text']))
        story.append(Spacer(1, 0.1*inch))
    
    return story

def generate_ats_classic_template(resume_data: dict, styles: dict):
    """Generate ATS Classic template (similar to modern but with different styling)."""
    # Similar structure but with classic styling
    return generate_ats_modern_template(resume_data, styles)

def generate_professional_template(resume_data: dict, styles: dict):
    """Generate Professional template."""
    # Similar to ATS Modern but with enhanced formatting
    return generate_ats_modern_template(resume_data, styles)

def generate_executive_template(resume_data: dict, styles: dict):
    """Generate Executive template."""
    # Similar structure but with executive-level formatting
    return generate_ats_modern_template(resume_data, styles)

