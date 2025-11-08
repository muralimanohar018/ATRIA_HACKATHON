from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    # Support both SQLite (dev) and PostgreSQL/Supabase (production)
    DB_URL = os.getenv("DB_URL", "")
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")  # Direct PostgreSQL connection string
    
    # Use Supabase if provided, otherwise fallback to SQLite
    if SUPABASE_DB_URL:
        SQLALCHEMY_DATABASE_URI = SUPABASE_DB_URL
    elif DB_URL:
        SQLALCHEMY_DATABASE_URI = DB_URL
    else:
        SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    } if "postgresql" in SQLALCHEMY_DATABASE_URI else {}
    
    HF_API_KEY = os.getenv("HF_API_KEY", "")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
    COMPANY_NAME = os.getenv("COMPANY_NAME", "Mastersolis Infotech")
    PORT = int(os.getenv("PORT", 5001))

