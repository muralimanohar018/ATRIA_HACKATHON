#!/usr/bin/env python3
"""
Automated setup script for Mastersolis Infotech project.
Creates .env files, sets up virtual environment, and installs dependencies.
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_step(message):
    """Print a step message with emoji."""
    print(f"\n{message}")

def print_success(message):
    """Print a success message."""
    print(f"✅ {message}")

def print_warning(message):
    """Print a warning message."""
    print(f"⚠️  {message}")

def create_env_file(env_path, example_path):
    """Create .env file from .env.example if it doesn't exist."""
    env_file = Path(env_path)
    example_file = Path(example_path)
    
    if env_file.exists():
        print_warning(f"{env_path} already exists, skipping...")
        return False
    
    if not example_file.exists():
        print_warning(f"{example_path} not found, skipping...")
        return False
    
    shutil.copy(example_file, env_file)
    print_success(f"Created {env_path}")
    return True

def setup_backend():
    """Set up Python backend."""
    print_step("🐍 Setting up Python backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print_warning("Backend directory not found!")
        return False
    
    os.chdir(backend_dir)
    
    # Create .env file
    create_env_file(".env", ".env.example")
    
    # Create virtual environment
    venv_dir = Path(".venv")
    if not venv_dir.exists():
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", ".venv"], check=True)
        print_success("Virtual environment created")
    else:
        print_warning("Virtual environment already exists")
    
    # Determine activation script path
    if sys.platform == "win32":
        pip_path = venv_dir / "Scripts" / "pip"
        python_path = venv_dir / "Scripts" / "python"
    else:
        pip_path = venv_dir / "bin" / "pip"
        python_path = venv_dir / "bin" / "python"
    
    # Install dependencies
    print("Installing Python dependencies...")
    subprocess.run([str(pip_path), "install", "-q", "-r", "requirements.txt"], check=True)
    print_success("Dependencies installed")
    
    os.chdir("..")
    return True

def setup_frontend():
    """Set up Node.js frontend."""
    print_step("📦 Setting up Node.js frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print_warning("Frontend directory not found!")
        return False
    
    # Create .env file in root
    create_env_file(".env", ".env.example")
    
    os.chdir(frontend_dir)
    
    # Install dependencies
    node_modules = Path("node_modules")
    if not node_modules.exists():
        print("Installing npm dependencies...")
        subprocess.run(["npm", "install"], check=True)
        print_success("Dependencies installed")
    else:
        print_warning("Node modules already installed, skipping...")
    
    os.chdir("..")
    return True

def main():
    """Main setup function."""
    print("🚀 Setting up Mastersolis Infotech Project...")
    print("=" * 50)
    
    # Create environment files
    print_step("📝 Creating environment files...")
    create_env_file("backend/.env", "backend/.env.example")
    create_env_file(".env", ".env.example")
    
    # Setup backend
    try:
        setup_backend()
    except Exception as e:
        print_warning(f"Backend setup error: {e}")
        return False
    
    # Setup frontend
    try:
        setup_frontend()
    except Exception as e:
        print_warning(f"Frontend setup error: {e}")
        return False
    
    # Final message
    print("\n" + "=" * 50)
    print_success("✨ Setup complete!")
    print("\nTo start the backend:")
    print("  ./start-backend.sh")
    print("  or: cd backend && source .venv/bin/activate && python app.py")
    print("\nTo start the frontend (in a new terminal):")
    print("  ./start-frontend.sh")
    print("  or: cd frontend && npm run dev")
    print("\nAccess the application:")
    print("  Frontend: http://localhost:5173")
    print("  Backend API: http://localhost:5001")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Setup failed: {e}")
        sys.exit(1)

