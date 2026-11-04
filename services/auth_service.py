"""
Municipal Staff & Department Officer Authentication Service.
Restricts grievance status changes and department triage controls to verified civic personnel.
"""

from functools import wraps
from flask import session, redirect, url_for, request, jsonify

# Pre-registered authorized municipal officers & environmental compliance auditors
OFFICERS_REGISTRY = {
    "tree.officer@civicconnect.gov.in": {
        "email": "tree.officer@civicconnect.gov.in",
        "password": "officer@trees2026",
        "badge": "TREE-OFF-101",
        "name": "Dr. R. K. Sharma",
        "role": "Chief Tree Officer & Environmental Auditor",
        "department": "Municipal Tree Authority & State Forest Wing",
        "jurisdiction": "Environmental Crimes, Deforestation & Parks"
    },
    "pwd.officer@civicconnect.gov.in": {
        "email": "pwd.officer@civicconnect.gov.in",
        "password": "officer@pwd2026",
        "badge": "PWD-ENG-204",
        "name": "Er. Priya Verma",
        "role": "Executive Engineer (Public Works)",
        "department": "Department of Urban Drainage & Public Health",
        "jurisdiction": "Drainage, Roads & Civic Infrastructure"
    },
    "admin@civicconnect.gov.in": {
        "email": "admin@civicconnect.gov.in",
        "password": "admin@civic2026",
        "badge": "ADM-DIR-001",
        "name": "S. K. Nambiar, IAS",
        "role": "Additional Municipal Commissioner",
        "department": "Municipal Corporation Headquarters",
        "jurisdiction": "All City Wards & Inter-Departmental Enforcement"
    }
}


def authenticate_officer(identifier: str, password: str) -> dict:
    """
    Validates officer credentials by email or badge number.
    Returns the officer profile dictionary if valid, else None.
    """
    clean_id = (identifier or "").strip().lower()
    clean_pwd = (password or "").strip()

    for email, profile in OFFICERS_REGISTRY.items():
        if clean_id == email.lower() or clean_id == profile["badge"].lower():
            if profile["password"] == clean_pwd:
                # Return profile without exposing the password
                return {
                    "email": profile["email"],
                    "badge": profile["badge"],
                    "name": profile["name"],
                    "role": profile["role"],
                    "department": profile["department"],
                    "jurisdiction": profile["jurisdiction"]
                }
    return None


def get_current_officer() -> dict:
    """Returns the currently logged-in officer from session, or None."""
    return session.get("officer")


def officer_required(f):
    """
    Decorator for HTML routes to enforce officer login.
    Redirects unauthenticated visitors to the Department Login portal.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("officer"):
            return redirect(url_for("department_login", next=request.path))
        return f(*args, **kwargs)
    return decorated_function


def officer_api_required(f):
    """
    Decorator for JSON API endpoints (e.g. status changes).
    Returns 401 Unauthorized if the client lacks an active officer session.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("officer"):
            return jsonify({
                "success": False,
                "error": "Access Denied: Only verified municipal department officers are authorized to update complaint statuses or post resolution notes.",
                "requires_login": True
            }), 401
        return f(*args, **kwargs)
    return decorated_function
