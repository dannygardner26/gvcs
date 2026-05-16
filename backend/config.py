"""
Configuration settings loaded from environment variables.

Copy .env.example to .env and fill in values before running.
"""

import os


class Config:
    # Used to sign session cookies and CSRF tokens — keep this secret.
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")

    # SQLite by default; swap for postgresql://user:pass@host/db in production.
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///database.db")

    # Disables modification tracking overhead (not needed with SQLAlchemy 2.x).
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # TODO (Phase 2): Uncomment and populate these when Google OAuth keys are ready.
    # GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    # GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    # GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
