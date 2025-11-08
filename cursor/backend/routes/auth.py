from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from ..database import db
from ..models.core import AdminUser
from ..config import Config
import secrets

auth_bp = Blueprint("auth", __name__)

def ok(data): return jsonify({"success": True, "data": data})
def err(msg, code=400): return jsonify({"success": False, "error": msg}), code

@auth_bp.route("/auth/login", methods=["POST"])
@cross_origin()
def login():
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return err("Username and password required", 400)
    
    user = AdminUser.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return err("Invalid username or password", 401)
    
    # Create session token
    token = secrets.token_urlsafe(32)
    session['admin_token'] = token
    session['admin_user_id'] = user.id
    session.permanent = True
    
    return ok({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })

@auth_bp.route("/auth/logout", methods=["POST"])
@cross_origin()
def logout():
    session.pop('admin_token', None)
    session.pop('admin_user_id', None)
    return ok({"message": "Logged out successfully"})

@auth_bp.route("/auth/verify", methods=["GET"])
@cross_origin()
def verify():
    # Check for token in Authorization header or session
    auth_header = request.headers.get("Authorization", "")
    token_from_header = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else None
    token_from_session = session.get('admin_token')
    token = token_from_header or token_from_session
    
    # Also check localStorage token from request
    token_from_local = request.args.get("token")
    token = token or token_from_local
    
    if not token:
        return err("No token provided", 401)
    
    # Check session token
    if session.get('admin_token') == token:
        user_id = session.get('admin_user_id')
        if user_id:
            user = AdminUser.query.get(user_id)
            if user:
                return ok({
                    "valid": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email
                    }
                })
    
    # For now, accept any token if session exists (simplified for demo)
    # In production, implement proper JWT validation
    return err("Invalid or expired token", 401)

@auth_bp.route("/auth/register", methods=["POST"])
@cross_origin()
def register():
    """Create initial admin user (only if no users exist)"""
    # Check if any admin users exist
    if AdminUser.query.count() > 0:
        return err("Admin user already exists", 403)
    
    data = request.get_json(force=True)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not all([username, email, password]):
        return err("Username, email, and password required", 400)
    
    if len(password) < 6:
        return err("Password must be at least 6 characters", 400)
    
    # Check if username or email already exists
    if AdminUser.query.filter_by(username=username).first():
        return err("Username already exists", 400)
    if AdminUser.query.filter_by(email=email).first():
        return err("Email already exists", 400)
    
    user = AdminUser(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    # Send AI-generated welcome email
    from ..ai_engine.email_ai import generate_welcome_email
    from ..services.email_sender import send_email
    from ..config import Config
    
    email_body = generate_welcome_email(username, username)
    email_sent = send_email(email, f"Welcome to {Config.COMPANY_NAME} Admin Portal", email_body)
    
    return ok({
        "message": "Admin user created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "email_sent": bool(email_sent)
    })

