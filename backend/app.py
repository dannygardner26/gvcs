"""
Main Flask application entry point.

Run with:
    python app.py
Or with Flask CLI:
    flask run --port 5001

Test endpoints with curl (examples at bottom of file).
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # CORS is required because Next.js runs on port 3000 and Flask on port 5001.
    # Without this, browsers block cross-origin requests as a security policy.
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    db.init_app(app)

    # Register route blueprints
    from routes.content import content_bp
    from routes.posts import posts_bp

    app.register_blueprint(content_bp)
    app.register_blueprint(posts_bp)

    # TODO (Phase 2): Register auth blueprint here
    # from routes.auth import auth_bp
    # app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()  # Creates tables on first run; safe to call repeatedly

    @app.route("/health")
    def health_check():
        """Simple liveness probe for the backend."""
        return jsonify({"status": "ok", "message": "GVCS backend is running"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)


# ---------------------------------------------------------------------------
# Example curl commands for manual testing
# ---------------------------------------------------------------------------
# Health check:
#   curl http://localhost:5001/health
#
# Seed site content:
#   curl -X POST http://localhost:5001/api/site-content/seed
#
# Get all site content:
#   curl http://localhost:5001/api/site-content
#
# Get one content key:
#   curl http://localhost:5001/api/site-content/hero_title
#
# Update content:
#   curl -X PUT http://localhost:5001/api/site-content \
#        -H "Content-Type: application/json" \
#        -d '{"hero_title": "New Title"}'
#
# List posts:
#   curl http://localhost:5001/api/posts
#
# Filter posts by type:
#   curl "http://localhost:5001/api/posts?type=meeting"
#
# Create a post:
#   curl -X POST http://localhost:5001/api/posts \
#        -H "Content-Type: application/json" \
#        -d '{"title": "First Meeting", "content": "Welcome!", "post_type": "meeting"}'
#
# Get a post:
#   curl http://localhost:5001/api/posts/1
#
# Update a post:
#   curl -X PUT http://localhost:5001/api/posts/1 \
#        -H "Content-Type: application/json" \
#        -d '{"title": "Updated Title"}'
#
# Delete a post:
#   curl -X DELETE http://localhost:5001/api/posts/1
