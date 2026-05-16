"""
Post management routes.

Handles CRUD for club posts (meetings, events, volunteer opportunities).
All routes are open during Phase 1 for testing.

Blueprint prefix: /api
"""

from datetime import date
from flask import Blueprint, jsonify, request
from extensions import db
from models import Post, User

posts_bp = Blueprint("posts", __name__, url_prefix="/api")

VALID_POST_TYPES = {"meeting", "event", "volunteer"}


def _get_or_create_default_author():
    """
    Return the default test author, creating one if the table is empty.

    TODO (Phase 2): Remove this and use the logged-in user from the session.
    """
    author = User.query.get(1)
    if not author:
        author = User(id=1, email="admin@gvhs.org", name="Admin User", role="admin")
        db.session.add(author)
        db.session.commit()
    return author


@posts_bp.route("/posts", methods=["GET"])
def list_posts():
    """
    Return all posts ordered newest-first.

    Query params:
      ?type=meeting   — filter by post_type ('meeting', 'event', 'volunteer')

    Response: [{id, title, content, post_type, event_date, created_at, author: {name}}, ...]

    TODO (Phase 2): Require club-member authentication.
    """
    try:
        query = Post.query.order_by(Post.created_at.desc())

        post_type = request.args.get("type")
        if post_type:
            if post_type not in VALID_POST_TYPES:
                return jsonify({"error": f"Invalid type. Must be one of: {', '.join(VALID_POST_TYPES)}"}), 400
            query = query.filter_by(post_type=post_type)

        posts = query.all()
        return jsonify([p.to_dict() for p in posts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@posts_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """
    Return a single post by ID.

    Response: {id, title, content, post_type, event_date, created_at, author: {name}}

    TODO (Phase 2): Require club-member authentication.
    """
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": f"Post {post_id} not found"}), 404
        return jsonify(post.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@posts_bp.route("/posts", methods=["POST"])
def create_post():
    """
    Create a new post.

    Input:
      {
        "title": "First Meeting",
        "content": "Welcome everyone!",
        "post_type": "meeting",          # required: meeting | event | volunteer
        "event_date": "2026-09-01"       # optional ISO date string
      }

    Response (201): created post object

    TODO (Phase 2): Set author_id from the authenticated session user.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # Validate required fields
        missing = [f for f in ("title", "content", "post_type") if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        if data["post_type"] not in VALID_POST_TYPES:
            return jsonify({"error": f"post_type must be one of: {', '.join(VALID_POST_TYPES)}"}), 400

        event_date = None
        if data.get("event_date"):
            try:
                event_date = date.fromisoformat(data["event_date"])
            except ValueError:
                return jsonify({"error": "event_date must be ISO format: YYYY-MM-DD"}), 400

        author = _get_or_create_default_author()

        post = Post(
            title=data["title"],
            content=data["content"],
            post_type=data["post_type"],
            event_date=event_date,
            author_id=author.id,
        )
        db.session.add(post)
        db.session.commit()
        return jsonify(post.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@posts_bp.route("/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    """
    Update an existing post. Only provided fields are changed.

    Input: same shape as POST (all fields optional)
    Response: updated post object

    TODO (Phase 2): Verify requester is the author or an admin.
    """
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": f"Post {post_id} not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        if "title" in data:
            post.title = data["title"]
        if "content" in data:
            post.content = data["content"]
        if "post_type" in data:
            if data["post_type"] not in VALID_POST_TYPES:
                return jsonify({"error": f"post_type must be one of: {', '.join(VALID_POST_TYPES)}"}), 400
            post.post_type = data["post_type"]
        if "event_date" in data:
            if data["event_date"] is None:
                post.event_date = None
            else:
                try:
                    post.event_date = date.fromisoformat(data["event_date"])
                except ValueError:
                    return jsonify({"error": "event_date must be ISO format: YYYY-MM-DD"}), 400

        db.session.commit()
        return jsonify(post.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@posts_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    """
    Delete a post by ID.

    Response: {"message": "Post deleted successfully"}

    TODO (Phase 2): Verify requester is the author or an admin.
    """
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": f"Post {post_id} not found"}), 404

        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Post deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
