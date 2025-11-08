from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def init_db(app):
    # Configure SQLAlchemy with engine options for PostgreSQL
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = Config.SQLALCHEMY_ENGINE_OPTIONS
    db.init_app(app)
    with app.app_context():
        try:
            db.create_all()
            db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
            if 'postgresql' in db_uri:
                print("✅ Connected to Supabase PostgreSQL database")
            else:
                print("✅ Connected to SQLite database")
        except Exception as e:
            print(f"⚠️  Database initialization warning: {e}")
            # Try to create tables anyway
            try:
                db.create_all()
            except:
                pass

