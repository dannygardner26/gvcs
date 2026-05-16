"""
SQLAlchemy database models for the GVCS website backend.

Import `db` from app.py, not from here, to avoid circular imports.
"""

from datetime import datetime, timezone
from extensions import db


def _now():
    return datetime.now(timezone.utc)


class User(db.Model):
    """
    Represents a club member or admin.

    google_id is null until Phase 2 OAuth is wired up.
    Role controls what the user can do: 'admin' can edit site content and all posts.
    """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    google_id = db.Column(db.String(255), unique=True, nullable=True)  # Populated in Phase 2
    role = db.Column(db.String(50), nullable=False, default="student")  # 'student' | 'admin'
    created_at = db.Column(db.DateTime, nullable=False, default=_now)

    posts = db.relationship("Post", back_populates="author", lazy=True)
    club_access = db.relationship("UserClubAccess", back_populates="user", lazy=True)

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"


class ClubCode(db.Model):
    """
    Represents a membership code distributed to students each year.

    Only one code should be active at a time. Students enter this code
    to confirm they are current club members.
    """

    __tablename__ = "club_codes"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)   # e.g. "FALL2026"
    year = db.Column(db.String(20), nullable=False)                 # e.g. "2026-2027"
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=_now)

    user_access = db.relationship("UserClubAccess", back_populates="club_code", lazy=True)

    def __repr__(self):
        return f"<ClubCode {self.code} ({'active' if self.active else 'inactive'})>"


class UserClubAccess(db.Model):
    """
    Join table recording which users redeemed which club codes.

    Lets us track membership per year and revoke access by deactivating a code.
    """

    __tablename__ = "user_club_access"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    club_code_id = db.Column(db.Integer, db.ForeignKey("club_codes.id"), nullable=False)
    joined_at = db.Column(db.DateTime, nullable=False, default=_now)

    user = db.relationship("User", back_populates="club_access")
    club_code = db.relationship("ClubCode", back_populates="user_access")

    def __repr__(self):
        return f"<UserClubAccess user={self.user_id} code={self.club_code_id}>"


class Post(db.Model):
    """
    A club post — meeting recap, upcoming event, or volunteer opportunity.

    post_type drives how the frontend renders and filters the card.
    event_date is optional; set it for events/volunteer posts with a fixed date.
    """

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    post_type = db.Column(db.String(50), nullable=False)   # 'meeting' | 'event' | 'volunteer'
    event_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=_now)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    author = db.relationship("User", back_populates="posts")

    def to_dict(self):
        """Serialize to a JSON-safe dict for API responses."""
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "post_type": self.post_type,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "created_at": self.created_at.isoformat(),
            "author": {"name": self.author.name} if self.author else None,
        }

    def __repr__(self):
        return f"<Post '{self.title}' ({self.post_type})>"


class SiteContent(db.Model):
    """
    Key-value store for all editable website copy.

    This lets admins update hero text, meeting times, stats, etc. through
    the API without touching code or redeploying the frontend.

    content_type hints to the frontend how to render the value:
      'text'  — plain string, safe to display as-is
      'html'  — render as innerHTML (sanitize on the frontend)
      'json'  — parse before use (e.g. a list of links)
    """

    __tablename__ = "site_content"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)    # e.g. "hero_title"
    value = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(20), nullable=False, default="text")
    updated_at = db.Column(db.DateTime, nullable=False, default=_now, onupdate=_now)

    def to_dict(self):
        """Serialize to a JSON-safe dict for API responses."""
        return {
            "key": self.key,
            "value": self.value,
            "type": self.content_type,
            "updated_at": self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f"<SiteContent {self.key}>"
