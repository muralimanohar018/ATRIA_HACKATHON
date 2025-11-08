#!/usr/bin/env python3
"""
Start script for backend - can be run from backend directory
"""
import os
import sys

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Change to project root
os.chdir(project_root)

# Now import and run
from backend.app import create_app

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 Starting backend server on port {port}...")
    print(f"📡 API available at: http://localhost:{port}")
    print(f"💚 Health check: http://localhost:{port}/health")
    app.run(host="0.0.0.0", port=port, debug=True)

