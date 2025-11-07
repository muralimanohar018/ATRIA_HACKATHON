#!/usr/bin/env python3
"""
Quick script to configure Supabase connection
"""
import os
import sys

def configure_supabase():
    print("🗄️  SUPABASE DATABASE CONFIGURATION")
    print("=" * 50)
    print()
    
    # Check if .env exists
    env_path = "backend/.env"
    if not os.path.exists(env_path):
        if os.path.exists("backend/.env.example"):
            print("📋 Creating backend/.env from .env.example...")
            with open("backend/.env.example", "r") as f:
                content = f.read()
            with open(env_path, "w") as f:
                f.write(content)
            print("✅ Created backend/.env")
        else:
            print("❌ backend/.env.example not found")
            return False
    
    print("📋 Please provide your Supabase connection details:")
    print()
    print("1. Go to Supabase Dashboard → Settings → Database")
    print("2. Copy the Connection string (URI format)")
    print("3. It should look like:")
    print("   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres")
    print()
    
    supabase_url = input("Enter your Supabase DB URL (or press Enter to skip): ").strip()
    
    if not supabase_url:
        print("⚠️  Skipping Supabase setup. Using SQLite instead.")
        return False
    
    # Read existing .env
    with open(env_path, "r") as f:
        lines = f.readlines()
    
    # Update or add SUPABASE_DB_URL
    updated = False
    new_lines = []
    for line in lines:
        if line.startswith("SUPABASE_DB_URL="):
            new_lines.append(f"SUPABASE_DB_URL={supabase_url}\n")
            updated = True
        else:
            new_lines.append(line)
    
    if not updated:
        new_lines.append(f"\n# Supabase Database\n")
        new_lines.append(f"SUPABASE_DB_URL={supabase_url}\n")
    
    # Write back
    with open(env_path, "w") as f:
        f.writelines(new_lines)
    
    print("✅ Updated SUPABASE_DB_URL in backend/.env")
    
    # Install psycopg2-binary
    print()
    print("📦 Installing PostgreSQL driver...")
    os.system("cd backend && source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate 2>/dev/null && pip install -q psycopg2-binary")
    
    print()
    print("✅ Supabase setup complete!")
    print()
    print("Next steps:")
    print("1. Restart backend: ./start-backend.sh")
    print("2. Verify connection: python3 view_database.py")
    print()
    
    return True

if __name__ == "__main__":
    configure_supabase()

