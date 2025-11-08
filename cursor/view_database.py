#!/usr/bin/env python3
"""
View database contents
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import create_app
from backend.database import db
from backend.models.core import Job, Application, BlogPost, AdminUser

def view_database():
    app = create_app()
    with app.app_context():
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        print("=" * 60)
        print("DATABASE INFORMATION")
        print("=" * 60)
        print(f"\nDatabase URI: {db_uri[:80]}..." if len(db_uri) > 80 else f"\nDatabase URI: {db_uri}")
        
        if 'postgresql' in db_uri or 'postgres' in db_uri:
            print(f"\n🗄️  Database Type: Supabase PostgreSQL")
            print(f"✅ Connected to cloud database")
            print(f"📊 All data is stored in Supabase")
        elif 'sqlite' in db_uri:
            # Check all possible locations
            possible_paths = [
                os.path.abspath('backend/instance/app.db'),
                os.path.abspath('instance/app.db'),
                os.path.abspath('app.db'),
                os.path.abspath(db_uri.replace('sqlite:///', '')),
            ]
            
            print(f"\nChecking database locations:")
            active_db = None
            for path in possible_paths:
                exists = os.path.exists(path)
                if exists:
                    size = os.path.getsize(path)
                    print(f"  ✅ {path}")
                    print(f"     Size: {size:,} bytes ({size/1024:.2f} KB)")
                    if active_db is None:
                        active_db = path
                else:
                    print(f"  ❌ {path} (not found)")
            
            if active_db:
                print(f"\n📊 Active Database: {active_db}")
            else:
                print(f"\n⚠️  Database file not found yet (will be created on first write)")
        
        print("\n" + "=" * 60)
        print("DATABASE CONTENTS")
        print("=" * 60)
        
        # Jobs
        jobs = Job.query.all()
        print(f"\n📋 Jobs: {len(jobs)}")
        for job in jobs:
            print(f"  - ID: {job.id}, Title: {job.title}, Location: {job.location}")
        
        # Applications
        applications = Application.query.all()
        print(f"\n📝 Applications: {len(applications)}")
        for app in applications[:5]:  # Show first 5
            print(f"  - ID: {app.id}, Name: {app.name}, Email: {app.email}, Job ID: {app.job_id}")
        if len(applications) > 5:
            print(f"  ... and {len(applications) - 5} more")
        
        # Blog Posts
        blogs = BlogPost.query.all()
        print(f"\n📰 Blog Posts: {len(blogs)}")
        for blog in blogs:
            print(f"  - ID: {blog.id}, Title: {blog.title}")
        
        # Admin Users
        admins = AdminUser.query.all()
        print(f"\n👤 Admin Users: {len(admins)}")
        for admin in admins:
            print(f"  - ID: {admin.id}, Username: {admin.username}, Email: {admin.email}")
        
        print("\n" + "=" * 60)
        print("✅ Database view complete")
        print("=" * 60)

if __name__ == "__main__":
    view_database()

