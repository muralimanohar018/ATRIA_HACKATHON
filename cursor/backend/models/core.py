from ..database import db
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(160), default="Remote")
    created_at = db.Column(db.DateTime, server_default=func.now())

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(160), nullable=False)
    phone = db.Column(db.String(40))
    resume_text = db.Column(db.Text, nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"), nullable=False)
    ai_match = db.Column(db.JSON, nullable=True)
    status = db.Column(db.String(32), default="applied")
    created_at = db.Column(db.DateTime, server_default=func.now())

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text)
    seo_description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, server_default=func.now())

class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    raw_text = db.Column(db.Text, nullable=False)
    polished_text = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(160), default="Anonymous")
    created_at = db.Column(db.DateTime, server_default=func.now())

class CaseStudy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    ai_analysis = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, server_default=func.now())

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(160), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
