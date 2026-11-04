

import os
import re
import uuid
import threading
import webbrowser
import requests
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, session, redirect, url_for

from services.complaints_store import (
    get_all_complaints,
    get_complaint_by_id,
    create_complaint,
    update_complaint_status,
    get_metrics
)
from services.location_service import verify_location
from services.ai_analysis_service import analyze_grievance_with_groq
from services.translation_service import translate_text
from services.auth_service import (
    authenticate_officer,
    get_current_officer,
    officer_required,
    officer_api_required
)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "civicconnect-secure-officer-session-key-2026")

# Configure photo evidence upload directory (Max 6 photos per complaint)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "uploads", "complaints")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024  # 32MB max total upload payload


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS



# Page View Routes


@app.route("/")
@app.route("/file-complaint")
def file_complaint():
    """Page 1: Citizen Grievance Filing Form."""
    return render_template("file_complaint.html")


@app.route("/track-complaint")
def track_complaint():
    """Page 2: Grievance Status & Visual Timeline Tracker."""
    prefill_ref = request.args.get("ref", "").strip()
    initial_ticket = None
    if prefill_ref:
        initial_ticket = get_complaint_by_id(prefill_ref)
    return render_template(
        "track_complaint.html",
        prefill_ref=prefill_ref,
        initial_ticket=initial_ticket
    )


# Officer Authentication & Department Portal Routes


@app.route("/department-login", methods=["GET", "POST"])
def department_login():
    """Restricted login portal for verified municipal officers."""
    # If already authenticated, redirect straight to dashboard
    if session.get("officer"):
        return redirect(url_for("department_dashboard"))

    error = None
    next_url = request.args.get("next") or request.form.get("next") or url_for("department_dashboard")
    identifier = ""

    if request.method == "POST":
        identifier = request.form.get("identifier", "").strip()
        password = request.form.get("password", "").strip()

        officer = authenticate_officer(identifier, password)
        if officer:
            session["officer"] = officer
            return redirect(next_url)
        else:
            error = "Invalid officer credentials or badge ID. Access is restricted to municipal staff."

    return render_template(
        "department_login.html",
        error=error,
        identifier=identifier,
        next_url=next_url
    )


@app.route("/department-logout")
def department_logout():
    """Terminates active officer session."""
    session.pop("officer", None)
    return redirect(url_for("department_login"))


@app.route("/department-dashboard")
@officer_required
def department_dashboard():
    """Page 3: Municipal Department Staff Operations Dashboard (Protected)."""
    officer = get_current_officer()
    complaints = get_all_complaints()
    metrics = get_metrics()
    return render_template(
        "department_dashboard.html",
        officer=officer,
        complaints=complaints,
        total_count=metrics["total"],
        pending_count=metrics["pending"],
        progress_count=metrics["in_progress"],
        resolved_count=metrics["resolved"]
    )


# ============================================================================
# REST APIs for Live Cross-Page Collaboration
# ============================================================================

@app.route("/api/complaints", methods=["POST"])
def api_create_complaint():
    """
    Submits a new citizen grievance.
    1. Validates required fields
    2. Validates Indian phone number format
    3. Validates location with Google Maps & Groq AI
    4. Handles up to 6 uploaded photographic proof attachments
    5. Saves to persistent store and returns unique tracking ID
    """
    if request.is_json:
        data = request.get_json() or {}
    else:
        data = request.form.to_dict()

    category = data.get("category", "").strip()
    location = data.get("location", "").strip()
    description = data.get("description", "").strip()
    citizen_name = data.get("citizenName", "").strip()
    citizen_phone = data.get("citizenPhone", "").strip()

    # 1. Check required fields
    if not location:
        return jsonify({
            "success": False,
            "field": "location",
            "error": "Location or landmark is required."
        }), 400

    if not description:
        return jsonify({
            "success": False,
            "field": "description",
            "error": "Complaint description is required."
        }), 400

    # 2. Validate Phone format if provided
    if citizen_phone:
        cleaned_phone = re.sub(r"[\s\-\(\)\.]", "", citizen_phone)
        if cleaned_phone.startswith("+91"):
            cleaned_phone = cleaned_phone[3:]
        elif cleaned_phone.startswith("91") and len(cleaned_phone) == 12:
            cleaned_phone = cleaned_phone[2:]
        elif cleaned_phone.startswith("0") and len(cleaned_phone) == 11:
            cleaned_phone = cleaned_phone[1:]

        if not re.match(r"^[6-9]\d{9}$", cleaned_phone):
            return jsonify({
                "success": False,
                "field": "citizenPhone",
                "error": "Invalid mobile number. Please enter a 10-digit Indian number starting with 6, 7, 8, or 9 (e.g. 98765 43210), or leave blank."
            }), 400

    # 3. Location Verification using Google Maps & Groq AI
    loc_check = verify_location(location)
    if not loc_check["is_valid"]:
        return jsonify({
            "success": False,
            "field": "location",
            "error": loc_check["reason"]
        }), 400

    verified_location = loc_check.get("formatted_location") or location

    # 4. Process up to 6 photo evidence files
    uploaded_images = []
    if "proofImages" in request.files:
        files = request.files.getlist("proofImages")
        for idx, f in enumerate(files):
            if idx >= 6:
                break
            if f and f.filename and allowed_file(f.filename):
                ext = f.filename.rsplit(".", 1)[1].lower()
                clean_name = secure_filename(f.filename.rsplit(".", 1)[0])[:20]
                safe_name = f"proof_{uuid.uuid4().hex[:8]}_{idx+1}_{clean_name}.{ext}"
                filepath = os.path.join(UPLOAD_FOLDER, safe_name)
                f.save(filepath)
                uploaded_images.append(f"/static/uploads/complaints/{safe_name}")
    # NEW: enforce at least one proof image
    if not uploaded_images:
        return jsonify({
            "success": False,
            "field": "proofImages",
            "error": "At least one proof image is required."
        }), 400

    # 5. Analyze complaint using Groq AI for legal framework & monitoring roadmap
    ai_analysis = analyze_grievance_with_groq(
        description=description,
        category=category,
        location=verified_location
    )

    # 6. Create and persist grievance in SQLite database with images
    ticket = create_complaint(
        category=category,
        location=verified_location,
        description=description,
        citizen_name=citizen_name,
        citizen_phone=citizen_phone,
        ai_analysis=ai_analysis,
        images=uploaded_images
    )

    return jsonify({
        "success": True,
        "ticket": ticket
    }), 201


@app.route("/api/complaints/<ref_id>", methods=["GET"])
def api_get_complaint(ref_id):
    """Retrieves live grievance details for status tracking."""
    ticket = get_complaint_by_id(ref_id)
    if not ticket:
        return jsonify({
            "success": False,
            "error": f"No complaint found matching reference '{ref_id}'."
        }), 404

    return jsonify({
        "success": True,
        "ticket": ticket
    })


@app.route("/api/complaints/<ref_id>/status", methods=["POST"])
@officer_api_required
def api_update_status(ref_id):
    """Department staff updates status and resolution notes (Protected)."""
    officer = get_current_officer()
    data = request.get_json() or {}
    new_status = data.get("status", "").strip()
    notes = data.get("notes", "").strip()

    if not new_status:
        return jsonify({
            "success": False,
            "error": "Status is required."
        }), 400

    # Append officer audit stamp to the resolution notes
    audit_suffix = f" [By {officer['name']} • {officer['badge']}]"
    final_notes = f"{notes}{audit_suffix}" if notes else f"Status updated to '{new_status}' by {officer['name']} ({officer['badge']})."

    res = update_complaint_status(ref_id, new_status, final_notes)
    if not res.get("success"):
        return jsonify(res), 404

    metrics = get_metrics()
    return jsonify({
        "success": True,
        "ticket": res["complaint"],
        "metrics": metrics,
        "updated_by": officer["name"]
    })


@app.route("/api/metrics", methods=["GET"])
def api_get_metrics():
    """Returns current counts for dashboard cards."""
    return jsonify(get_metrics())


@app.route("/api/translate", methods=["POST"])
def api_translate():
    """Translates dynamic text (descriptions, officer notes, roadmaps) via Groq AI."""
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    target = data.get("target", "hi").strip()
    if not text:
        return jsonify({"success": True, "translated": ""})
    translated = translate_text(text, target)
    return jsonify({"success": True, "translated": translated})


@app.route("/api/reverse-geocode")
def api_reverse_geocode():
    """Reverse-geocode using OpenStreetMap Nominatim."""
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"address": ""})
    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={"format": "json", "lat": lat, "lon": lon, "addressdetails": 1},
            headers={"User-Agent": "CivicConnect/1.0"},
            timeout=5,
        )
        data = resp.json()
        return jsonify({"address": data.get("display_name", "")})
    except Exception:
        return jsonify({"address": ""})


# Server Runner


def open_browser():
    """Automatically launches the user's default browser on startup."""
    try:
        webbrowser.open_new_tab("http://127.0.0.1:5000")
    except Exception:
        pass


if __name__ == "__main__":
    port = 5000
    host = "127.0.0.1"

    print("\n" + "=" * 65)
    print("🏛️   CivicConnect - Live Connected Platform")
    print("=" * 65)
    print(f"👉 File a Complaint:     http://{host}:{port}/file-complaint")
    print(f"👉 Track a Complaint:    http://{host}:{port}/track-complaint")
    print(f"👉 Department Dashboard: http://{host}:{port}/department-dashboard")
    print("-" * 65)
    print("✨ Features Active: Location Verification (Google Maps / Groq AI)")
    print("✨ Features Active: Live Cross-Page Data Sync (complaints.json)")
    print("=" * 65 + "\n")

    if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
        threading.Timer(1.2, open_browser).start()

    app.run(debug=True, host=host, port=port)
