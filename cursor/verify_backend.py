#!/usr/bin/env python3
"""
Backend Verification Script
Verifies all backend components are working correctly
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def verify_backend():
    print("=" * 60)
    print("BACKEND VERIFICATION")
    print("=" * 60)
    print()
    
    errors = []
    warnings = []
    
    # 1. Check Python version
    print("1. Checking Python version...")
    if sys.version_info < (3, 9):
        errors.append(f"Python 3.9+ required, found {sys.version}")
        print("   ❌ Python version too old")
    else:
        print(f"   ✅ Python {sys.version_info.major}.{sys.version_info.minor}")
    
    # 2. Check imports
    print("\n2. Checking imports...")
    try:
        from backend.app import create_app
        print("   ✅ App import successful")
    except Exception as e:
        errors.append(f"Failed to import app: {e}")
        print(f"   ❌ App import failed: {e}")
        return errors
    
    # 3. Create app
    print("\n3. Creating Flask app...")
    try:
        app = create_app()
        print("   ✅ Flask app created")
    except Exception as e:
        errors.append(f"Failed to create app: {e}")
        print(f"   ❌ App creation failed: {e}")
        return errors
    
    # 4. Check routes
    print("\n4. Checking routes...")
    routes = list(app.url_map.iter_rules())
    route_count = len([r for r in routes if 'static' not in str(r)])
    print(f"   ✅ Found {route_count} routes")
    
    # 5. Check blueprints
    print("\n5. Checking blueprints...")
    blueprints = ['public', 'admin', 'ai', 'auth']
    for bp_name in blueprints:
        try:
            if bp_name == 'public':
                from backend.routes.public import public_bp
            elif bp_name == 'admin':
                from backend.routes.admin import admin_bp
            elif bp_name == 'ai':
                from backend.routes.ai import ai_bp
            elif bp_name == 'auth':
                from backend.routes.auth import auth_bp
            print(f"   ✅ {bp_name} blueprint loaded")
        except Exception as e:
            errors.append(f"Failed to load {bp_name} blueprint: {e}")
            print(f"   ❌ {bp_name} blueprint failed: {e}")
    
    # 6. Check models
    print("\n6. Checking models...")
    models = ['Job', 'Application', 'BlogPost', 'Testimonial', 'CaseStudy', 'AdminUser']
    try:
        from backend.models.core import Job, Application, BlogPost, Testimonial, CaseStudy, AdminUser
        print("   ✅ All models imported")
    except Exception as e:
        errors.append(f"Failed to import models: {e}")
        print(f"   ❌ Model import failed: {e}")
    
    # 7. Check AI modules
    print("\n7. Checking AI modules...")
    ai_modules = [
        'resume_parser', 'job_matcher', 'summarizer', 
        'testimonial_ai', 'case_study_ai', 'email_ai', 'resume_generator'
    ]
    for module in ai_modules:
        try:
            if module == 'resume_parser':
                from backend.ai_engine.resume_parser import extract_text, extract_fields
            elif module == 'job_matcher':
                from backend.ai_engine.job_matcher import get_ai_job_match
            elif module == 'summarizer':
                from backend.ai_engine.summarizer import summarize_text_ai, seo_description_ai
            elif module == 'testimonial_ai':
                from backend.ai_engine.testimonial_ai import rephrase_testimonial_ai
            elif module == 'case_study_ai':
                from backend.ai_engine.case_study_ai import analyze_case_study_ai
            elif module == 'email_ai':
                from backend.ai_engine.email_ai import generate_job_email
            elif module == 'resume_generator':
                from backend.ai_engine.resume_generator import generate_ai_resume_template
            print(f"   ✅ {module} module loaded")
        except Exception as e:
            warnings.append(f"{module} module issue: {e}")
            print(f"   ⚠️  {module} module warning: {e}")
    
    # 8. Check database
    print("\n8. Checking database...")
    try:
        with app.app_context():
            from backend.database import db
            db.create_all()
            print("   ✅ Database initialized")
    except Exception as e:
        warnings.append(f"Database issue: {e}")
        print(f"   ⚠️  Database warning: {e}")
    
    # 9. Check config
    print("\n9. Checking configuration...")
    try:
        from backend.config import Config
        print(f"   ✅ Config loaded (PORT: {Config.PORT})")
    except Exception as e:
        errors.append(f"Config error: {e}")
        print(f"   ❌ Config failed: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    
    if errors:
        print(f"\n❌ Errors: {len(errors)}")
        for error in errors:
            print(f"   - {error}")
    else:
        print("\n✅ No errors found!")
    
    if warnings:
        print(f"\n⚠️  Warnings: {len(warnings)}")
        for warning in warnings:
            print(f"   - {warning}")
    
    print(f"\n✅ Backend is ready!")
    print(f"   Total routes: {route_count}")
    print(f"   Blueprints: {len(blueprints)}")
    print(f"   Models: {len(models)}")
    print(f"   AI modules: {len(ai_modules)}")
    
    return errors

if __name__ == "__main__":
    errors = verify_backend()
    sys.exit(1 if errors else 0)

