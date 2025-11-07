from flask import Flask
from flask_cors import CORS
from .config import Config
from .database import init_db
from .routes.public import public_bp
from .routes.admin import admin_bp
from .routes.ai import ai_bp
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
    # Configure CORS to allow frontend connections
    CORS(app, 
         supports_credentials=True,
         origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    init_db(app)

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/")
    app.register_blueprint(ai_bp, url_prefix="/ai")
    app.register_blueprint(auth_bp, url_prefix="/")

    @app.route("/")
    def home():
        return {"message": "AI Backend Running"}

    return app

if __name__ == "__main__":
    import os
    import sys
    # If running directly, add parent to path
    if __name__ == "__main__" and not hasattr(sys, 'ps1'):
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    app = create_app()
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 Starting backend server on port {port}...")
    print(f"📡 API available at: http://localhost:{port}")
    print(f"💚 Health check: http://localhost:{port}/health")
    app.run(host="0.0.0.0", port=port, debug=True)

