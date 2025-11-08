#!/usr/bin/env python3
"""
Simple script to run the Flask backend.
Usage: python backend/run.py
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 Starting backend server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)

