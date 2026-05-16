"""
Standalone seed script — populates the database with initial data for development.

Run once after setting up the backend:
    cd backend/
    python seed_data.py

Safe to re-run: existing records are skipped, not duplicated.
"""

import sys
import os

# Ensure the backend directory is on the path so imports resolve correctly.
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date
from app import create_app
from extensions import db
from models import User, ClubCode, UserClubAccess, Post, SiteContent

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

SAMPLE_POSTS = [
    {
        "title": "Welcome to GVCS Club — First Meeting Recap",
        "content": "We kicked off the year with 45 students attending our first meeting! We covered the year's roadmap, introduced officer roles, and ran a quick Python challenge. See you next Thursday!",
        "post_type": "meeting",
        "event_date": None,
    },
    {
        "title": "Fall Hackathon 2026 — Register Now",
        "content": "Our annual hackathon is back! Teams of 2–4 students will have 24 hours to build something awesome. Prizes, food, and fun guaranteed. Sign up at the link in bio.",
        "post_type": "event",
        "event_date": date(2026, 10, 15),
    },
    {
        "title": "Volunteer Opportunity: Tech Tutoring at Lincoln Middle School",
        "content": "We're partnering with Lincoln Middle School to run a weekly coding workshop for 6th graders. No experience required — just enthusiasm! Volunteering counts toward NHS hours.",
        "post_type": "volunteer",
        "event_date": date(2026, 9, 20),
    },
]


def seed_user():
    existing = User.query.filter_by(email="admin@gvhs.org").first()
    if existing:
        print("  [skip] Admin user already exists.")
        return existing

    user = User(id=1, email="admin@gvhs.org", name="Admin User", role="admin")
    db.session.add(user)
    db.session.commit()
    print("  [created] Admin user: admin@gvhs.org (role=admin)")
    return user


def seed_club_code():
    existing = ClubCode.query.filter_by(code="FALL2026").first()
    if existing:
        print("  [skip] Club code FALL2026 already exists.")
        return existing

    code = ClubCode(code="FALL2026", year="2026-2027", active=True)
    db.session.add(code)
    db.session.commit()
    print("  [created] Club code: FALL2026 (year=2026-2027, active=True)")
    return code


def seed_posts(author):
    created = 0
    for data in SAMPLE_POSTS:
        exists = Post.query.filter_by(title=data["title"]).first()
        if exists:
            print(f"  [skip] Post already exists: '{data['title']}'")
            continue

        post = Post(
            title=data["title"],
            content=data["content"],
            post_type=data["post_type"],
            event_date=data["event_date"],
            author_id=author.id,
        )
        db.session.add(post)
        created += 1
        print(f"  [created] {data['post_type'].capitalize()} post: '{data['title']}'")

    db.session.commit()
    return created


def seed_site_content():
    added = []
    for key, value in DEFAULT_CONTENT.items():
        exists = SiteContent.query.filter_by(key=key).first()
        if not exists:
            db.session.add(SiteContent(key=key, value=value))
            added.append(key)
        else:
            print(f"  [skip] Content key already exists: {key}")

    db.session.commit()
    if added:
        print(f"  [created] {len(added)} site content entries: {', '.join(added)}")
    return len(added)


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        print("\n=== Seeding database ===\n")

        print("Users:")
        admin = seed_user()

        print("\nClub codes:")
        seed_club_code()

        print("\nPosts:")
        seed_posts(admin)

        print("\nSite content:")
        seed_site_content()

        print("\n=== Done! Database is ready. ===")
        print("Run the backend with:  python app.py")
        print("Then visit:            http://localhost:5001/health\n")
