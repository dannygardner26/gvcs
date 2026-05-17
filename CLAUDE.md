@AGENTS.md

# GVCS Club Website — Project Context

## What This Is
A CS Club website with a Next.js frontend and backend API routes. The goal is a dynamic content system so website text (hero title, meeting times, stats, etc.) can be updated without hardcoding or redeploying.

## Stack
- **Framework:** Next.js 16.2.4 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Prisma ORM + SQLite (dev) → PostgreSQL (production)
- **Auth:** Google OAuth — Phase 2 (not yet implemented)

## Project Structure
```
gvcs-website/
├── src/
│   └── app/              # Next.js App Router pages (frontend already exists)
├── prisma/
│   ├── schema.prisma     # Database schema (created)
│   └── dev.db            # SQLite file (created after db push, gitignored)
├── .env                  # DATABASE_URL=file:./dev.db (gitignored)
├── package.json
└── CLAUDE.md
```

There is also a `backend/` folder with a Flask implementation — this is being **replaced** by Next.js API routes (see Phase roadmap below). The Flask backend is no longer the active backend.

## Database Models (Prisma)
Defined in `prisma/schema.prisma`:

| Model | Purpose |
|---|---|
| `User` | Club members/admins. `googleId` null until Phase 2. Role: ADMIN, MEMBER, GUEST |
| `ClubCode` | Yearly membership codes (e.g. "FALL2026"). Students redeem to become MEMBER |
| `UserClubAccess` | Join table — which users redeemed which codes |
| `Post` | Club posts. Types: MEETING, EVENT, VOLUNTEER. Has optional `eventDate` |
| `SiteContent` | Key-value store for all editable website copy (hero text, meeting times, stats) |

## SiteContent Keys (default values)
These are the content keys the frontend expects:
- `hero_title`, `hero_subtitle`, `hero_badge_text`, `hero_cta_primary`, `hero_cta_secondary`
- `about_title`, `about_text`
- `meeting_time`, `meeting_location`, `contact_email`
- `stat_members`, `stat_projects`, `stat_events`

## Phase Roadmap
- **Phase 1 (current):** Database schema + Next.js API routes for Posts and SiteContent — no auth
- **Phase 2:** Google OAuth via NextAuth.js, club code redemption, protected routes

## API Routes to Build (Phase 1 — next step)
All routes go in `src/app/api/`:

**Site Content** (`/api/site-content`):
- `GET /api/site-content` — return all content as key-value pairs (public)
- `GET /api/site-content/[key]` — return single key (public)
- `PUT /api/site-content` — update multiple keys (admin only in Phase 2)
- `POST /api/site-content/seed` — populate default values (run once)

**Posts** (`/api/posts`):
- `GET /api/posts` — list all posts, newest first. Optional `?type=meeting|event|volunteer`
- `GET /api/posts/[id]` — single post with author info
- `POST /api/posts` — create post (use default admin author for Phase 1)
- `PUT /api/posts/[id]` — update post
- `DELETE /api/posts/[id]` — delete post

## Prisma Setup Commands (already run)
```bash
npm install
npx prisma generate
npx prisma db push
```

## Prisma Client Usage Pattern
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
Put this in `src/lib/prisma.ts` — the singleton pattern prevents connection exhaustion in Next.js dev mode (hot reload creates new instances otherwise).

## Key Decisions Made
- `prisma` CLI is in `devDependencies`, `@prisma/client` in `dependencies`
- IDs use `cuid()` (not auto-increment integers like Flask)
- `UserClubAccess` has `@@unique([userId, clubCodeId])` — a user can't redeem the same code twice
- `.env*` is already gitignored; Prisma DB files (`prisma/*.db`) also gitignored
- Flask `backend/` folder still exists but is superseded by this implementation
