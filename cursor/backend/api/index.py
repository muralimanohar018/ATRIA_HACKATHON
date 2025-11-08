"""
Vercel Serverless Function Entry Point
This wraps the Flask app for Vercel deployment
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app import create_app

app = create_app()

# Export for Vercel
def handler(request):
    return app(request.environ, lambda status, headers: None)

