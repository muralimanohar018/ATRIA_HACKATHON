"""
Vercel Serverless Function Entry Point
This wraps the Flask app for Vercel deployment

Note: For production, consider deploying backend separately to Render/Railway
as Vercel has limitations for long-running Flask applications.
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app import create_app

# Create Flask app instance
app = create_app()

# Vercel Python runtime expects the app to be callable
# The @vercel/python builder will automatically wrap this
# For now, we export the app directly - Vercel will handle WSGI conversion

