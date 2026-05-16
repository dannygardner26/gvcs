"""
Site content management routes.

All content is stored as key-value pairs in the SiteContent table so that
website copy can be updated through the API without code changes.

Blueprint prefix: /api
"""

from flask import Blueprint, jsonify, request
from extensions import db
from models import SiteContent

content_bp = Blueprint("content", __name__, url_prefix="/api")

# Default content loaded by POST /api/site-content/seed
DEFAULT_CONTENT = {
    "hero_title": "Build the future with code",
    "hero_subtitle": "Join GVCS Club where students learn programming, build projects, and compete in hackathons together",
    "hero_badge_text": "Active club · 50+ members",
    "hero_cta_primary": "Join the club",
    "hero_cta_secondary": "View projects",
    "about_title": "About CS Club",
    "about_text": "We're a community of students passionate about computer science and technology. Join us to learn, build, and compete!",
    "meeting_time": "Thursdays at 3:30 PM",
    "meeting_location": "Room 204",
    "contact_email": "csclub@gvhs.org",
    "stat_members": "50+",
    "stat_projects": "30+",
    "stat_events": "15",
}


@content_bp.route("/site-content", methods=["GET"])
def get_all_content():
    """
    Return all site content as a flat key-value dict.

    No authentication required — this is public read-only content.

    Response: {"hero_title": "Build the future...", "meeting_time": "Thursdays at 3:30 PM", ...}
    """
    try:
        rows = SiteContent.query.all()
        return jsonify({row.key: row.value for row in rows})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@content_bp.route("/site-content/<string:key>", methods=["GET"])
def get_content(key):
    """
    Return a single content entry by key.

    Response: {"key": "hero_title", "value": "Build the future...", "type": "text", "updated_at": "..."}
    """
    try:
        row = SiteContent.query.filter_by(key=key).first()
        if not row:
            return jsonify({"error": f"Content key '{key}' not found"}), 404
        return jsonify(row.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@content_bp.route("/site-content", methods=["PUT"])
def update_content():
    """
    Update (or create) one or more content entries.

    Input:  {"hero_title": "New Title", "meeting_time": "Wednesdays 4PM"}
    Response: {"message": "Content updated", "updated": ["hero_title", "meeting_time"]}

    TODO (Phase 2): Restrict to admin users only.
    """
    try:
        data = request.get_json()
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Request body must be a JSON object"}), 400

        updated_keys = []
        for key, value in data.items():
            row = SiteContent.query.filter_by(key=key).first()
            if row:
                row.value = str(value)
            else:
                row = SiteContent(key=key, value=str(value))
                db.session.add(row)
            updated_keys.append(key)

        db.session.commit()
        return jsonify({"message": "Content updated", "updated": updated_keys})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@content_bp.route("/site-content/seed", methods=["POST"])
def seed_content():
    """
    Populate the database with default site content.

    Only inserts keys that do not already exist, so it is safe to run
    multiple times without overwriting manual edits.

    Response: {"message": "Initial content seeded successfully"}
    """
    try:
        added = []
        for key, value in DEFAULT_CONTENT.items():
            exists = SiteContent.query.filter_by(key=key).first()
            if not exists:
                db.session.add(SiteContent(key=key, value=value))
                added.append(key)

        db.session.commit()
        return jsonify({
            "message": "Initial content seeded successfully",
            "added": added,
            "skipped": [k for k in DEFAULT_CONTENT if k not in added],
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
