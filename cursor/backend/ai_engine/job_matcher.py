import requests
from ..config import Config

def get_ai_job_match(resume_text: str, job_description: str) -> dict:
    """Get AI-powered job match score and analysis."""
    try:
        # Extract skills from job description
        job_skills = extract_skills_from_text(job_description)
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        if not Config.HF_API_KEY:
            # Fallback: enhanced keyword matching
            matched_skills = [skill for skill in job_skills if skill.lower() in resume_lower]
            missing_skills = [skill for skill in job_skills if skill.lower() not in resume_lower]
            
            # Calculate score based on matched skills
            if len(job_skills) > 0:
                score = min(100, int((len(matched_skills) / len(job_skills)) * 100))
            else:
                # Fallback keywords
                keywords = ["python", "javascript", "react", "flask", "sql", "ai", "ml"]
                matches = sum(1 for kw in keywords if kw in resume_lower and kw in job_lower)
                score = min(100, int((matches / len(keywords)) * 100))
                matched_skills = [kw for kw in keywords if kw in resume_lower and kw in job_lower]
                missing_skills = [kw for kw in keywords if kw not in resume_lower and kw in job_lower]
            
            analysis = f"Matched {len(matched_skills)} out of {len(job_skills)} key skills"
            if missing_skills:
                analysis += f". Consider adding: {', '.join(missing_skills[:3])}"
            
            return {
                "match_score": score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills[:5],
                "analysis": analysis,
                "recommendations": generate_recommendations(score, missing_skills)
            }
        
        # Try Hugging Face API for semantic similarity (with fallback on error)
        try:
            # Note: HF API endpoint may have changed - fallback will handle it
            api_url = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
            headers = {"Authorization": f"Bearer {Config.HF_API_KEY}"} if Config.HF_API_KEY else {}
            
            # Get embeddings for resume and job description
            resume_response = requests.post(
                api_url,
                headers=headers,
                json={"inputs": resume_text[:512]},
                timeout=10
            )
            
            job_response = requests.post(
                api_url,
                headers=headers,
                json={"inputs": job_description[:512]},
                timeout=10
            )
            
            # Check if API call was successful
            if resume_response.status_code == 200 and job_response.status_code == 200:
                resume_emb = resume_response.json()
                job_emb = job_response.json()
                
                # Calculate similarity (simplified without numpy)
                if isinstance(resume_emb, list) and len(resume_emb) > 0 and isinstance(resume_emb[0], list):
                    # Simple dot product and norm calculation
                    try:
                        import numpy as np
                        similarity = np.dot(resume_emb[0], job_emb[0]) / (np.linalg.norm(resume_emb[0]) * np.linalg.norm(job_emb[0]))
                        score = int(similarity * 100)
                    except ImportError:
                        # Fallback without numpy - simple vector similarity
                        vec1, vec2 = resume_emb[0], job_emb[0]
                        dot = sum(a * b for a, b in zip(vec1, vec2))
                        norm1 = sum(a * a for a in vec1) ** 0.5
                        norm2 = sum(b * b for b in vec2) ** 0.5
                        similarity = dot / (norm1 * norm2) if (norm1 * norm2) > 0 else 0
                        score = int(similarity * 100)
                else:
                    raise Exception("Invalid API response format")
            else:
                # API failed (410, 503, etc.) - use fallback
                raise Exception(f"API unavailable (status {resume_response.status_code})")
        except Exception as api_error:
            # Fallback to keyword matching if API fails
            resume_lower = resume_text.lower()
            job_lower = job_description.lower()
            matched_skills = [skill for skill in job_skills if skill.lower() in resume_lower]
            missing_skills = [skill for skill in job_skills if skill.lower() not in resume_lower]
            
            if len(job_skills) > 0:
                score = min(100, int((len(matched_skills) / len(job_skills)) * 100))
            else:
                # Fallback keywords
                keywords = ["python", "javascript", "react", "flask", "sql", "ai", "ml"]
                matches = sum(1 for kw in keywords if kw in resume_lower and kw in job_lower)
                score = min(100, int((matches / len(keywords)) * 100))
                matched_skills = [kw for kw in keywords if kw in resume_lower and kw in job_lower]
                missing_skills = [kw for kw in keywords if kw not in resume_lower and kw in job_lower]
            
            analysis = f"Matched {len(matched_skills)} out of {len(job_skills) if job_skills else len(keywords)} key skills (fallback mode)"
            if missing_skills:
                analysis += f". Consider adding: {', '.join(missing_skills[:3])}"
            
            return {
                "match_score": score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills[:5],
                "analysis": analysis,
                "recommendations": generate_recommendations(score, missing_skills)
            }
        
        # Extract skills for analysis (when API succeeds)
        job_skills = extract_skills_from_text(job_description)
        matched_skills = [skill for skill in job_skills if skill.lower() in resume_text.lower()]
        missing_skills = [skill for skill in job_skills if skill.lower() not in resume_text.lower()]
        
        analysis = f"AI-powered semantic matching: {score}% compatibility. "
        if matched_skills:
            analysis += f"Strong alignment with: {', '.join(matched_skills[:3])}"
        if missing_skills:
            analysis += f". Consider highlighting: {', '.join(missing_skills[:2])}"
        
        return {
            "match_score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills[:5],
            "analysis": analysis,
            "recommendations": generate_recommendations(score, missing_skills)
        }
    except Exception as e:
        # Final fallback on any error
        job_skills = extract_skills_from_text(job_description)
        resume_lower = resume_text.lower()
        matched_skills = [skill for skill in job_skills if skill.lower() in resume_lower]
        missing_skills = [skill for skill in job_skills if skill.lower() not in resume_lower]
        
        if len(job_skills) > 0:
            score = min(100, int((len(matched_skills) / len(job_skills)) * 100))
        else:
            score = 65
        
        return {
            "match_score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills[:5],
            "analysis": f"Matched {len(matched_skills)} skills (fallback mode)",
            "recommendations": generate_recommendations(score, missing_skills)
        }

def extract_skills_from_text(text: str) -> list:
    """Extract technical skills from text."""
    skills_keywords = [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
        "React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask", "FastAPI",
        "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub",
        "Machine Learning", "AI", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
        "Data Science", "Pandas", "NumPy", "Matplotlib", "Seaborn",
        "HTML", "CSS", "SASS", "Tailwind", "Bootstrap",
        "REST API", "GraphQL", "Microservices", "CI/CD", "DevOps",
        "Agile", "Scrum", "JIRA", "Confluence"
    ]
    
    text_lower = text.lower()
    found_skills = [skill for skill in skills_keywords if skill.lower() in text_lower]
    return found_skills

def generate_recommendations(score: int, missing_skills: list) -> list:
    """Generate recommendations based on match score."""
    recommendations = []
    
    if score < 50:
        recommendations.append("Significantly improve alignment by adding required skills and keywords")
        recommendations.append("Highlight relevant experience matching job requirements")
    elif score < 70:
        recommendations.append("Good foundation - add more specific technical skills from job description")
        recommendations.append("Use keywords from job posting in your resume")
    elif score < 85:
        recommendations.append("Strong match - minor improvements can optimize your resume")
    else:
        recommendations.append("Excellent alignment - your resume is well-suited for this role")
    
    if missing_skills:
        recommendations.append(f"Consider mentioning: {', '.join(missing_skills[:3])}")
    
    return recommendations

