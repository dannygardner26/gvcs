# GVCS Architecture

## Core Principle: Independent Microservices

The GVCS ecosystem is built as a collection of **independently deployed services** that all connect back to the **main site** (`gvcs`) as the single source of truth for authentication and shared state.

```
┌─────────────────────────────────────────────────────────┐
│                    GVCS Main Site                        │
│              (this repo - greatvalleycs/gvcs)            │
│                                                         │
│  - Authentication (login, sessions, user profiles)      │
│  - Public pages (home, events, sponsors)                │
│  - API layer for external services                      │
│  - Member directory                                     │
└────────────┬────────────────────────────────────────────┘
             │ API calls (auth tokens, user data)
             │
     ┌───────┼───────┬───────────────┬──────────────┐
     │       │       │               │              │
     ▼       ▼       ▼               ▼              ▼
┌────────┐┌────────┐┌────────────┐┌──────────┐┌──────────┐
│Comp    ││Event   ││Hackathon   ││Email     ││Future    │
│Prog    ││Reg     ││Submissions ││Service   ││Services  │
│Platform││System  ││            ││          ││          │
└────────┘└────────┘└────────────┘└──────────┘└──────────┘
  Separate repos, separate Vercel deployments
```

## Why This Architecture?

1. **No cross-dependencies between contributor code.** Each service is its own repo. One person's broken code never takes down another person's feature.

2. **Security isolation.** If a service has a bug, it only has access to its own data + the auth tokens from the main site. No lateral movement.

3. **Independent deployments.** Each team deploys on their own schedule. No merge conflicts between teams working on different features.

4. **Simple onboarding.** New contributors only need to understand their own repo + the API docs from the main site.

## The Main Site's Responsibilities

This repo (`greatvalleycs/gvcs`) owns:

| Responsibility | Details |
|---------------|---------|
| **Authentication** | Login/signup, session management, OAuth (Google SSO for school accounts) |
| **User profiles** | Member info, roles (admin, member, guest) |
| **API gateway** | REST endpoints that external services call to verify auth and fetch user data |
| **Public content** | Home page, events listing, sponsors, about page |
| **Navigation** | Links to all external services (embedded or linked) |

## How External Services Connect

Every external service follows this pattern:

```
1. User visits external service (e.g. comp-prog.greatvalleycs.org)
2. Service checks: does user have a valid session?
   - No → redirect to main site login
   - Yes → service loads, makes API calls as needed
3. Service calls main site API for:
   - Auth verification (GET /api/auth/verify)
   - User data (GET /api/users/me)
   - Event data (GET /api/events)
4. Service manages its OWN data independently
```

### API Contract (planned)

```
GET  /api/auth/verify     → { valid: boolean, user: { id, name, email, role } }
GET  /api/users/me        → { id, name, email, role, joinedAt }
GET  /api/events          → [{ id, title, date, type }]
POST /api/events/register → { success: boolean }
```

External services authenticate with the main site using session cookies (same-origin) or API keys (cross-origin).

## Rules for External Services

Each external service (separate repo) MUST:

- [ ] Live in its own repo under the `greatvalleycs` GitHub org
- [ ] Deploy independently (its own Vercel project, subdomain, etc.)
- [ ] Authenticate users via the main site API — never roll its own auth
- [ ] Store only its own domain-specific data
- [ ] Not import code from other external services
- [ ] Have its own README, CONTRIBUTING.md, and clear setup instructions
- [ ] Follow the same PR workflow (feature branch → `dev` → `master`)

Each external service MUST NOT:

- [ ] Access another service's database directly
- [ ] Duplicate auth logic
- [ ] Depend on another external service being online to function (graceful degradation)
- [ ] Store sensitive user data beyond what it needs

## Planned Services

| Service | Repo | Subdomain | Purpose |
|---------|------|-----------|---------|
| Comp Prog Platform | `greatvalleycs/comp-prog` | `compete.greatvalleycs.org` | Run competitive programming contests |
| Event Registration | `greatvalleycs/event-reg` | `register.greatvalleycs.org` | Sign up for events, manage attendance |
| Email Service | `greatvalleycs/email-service` | (internal) | Mailing list, event notifications |
| Hackathon Submissions | External (DevPost) | N/A | Project submissions for our hackathons |

## Subdomain Strategy

```
greatvalleycs.org          → main site (this repo)
compete.greatvalleycs.org  → competitive programming platform
register.greatvalleycs.org → event registration
```

All subdomains are separate Vercel deployments pointed at their own repos.

## For Contributors

**If you're building a new feature:**

Ask yourself: "Does this belong in the main site, or should it be its own service?"

**It belongs in the main site if:**
- It's authentication/user-related
- It's a public-facing page (about, sponsors, etc.)
- It's the API that other services consume

**It should be its own service if:**
- It has complex domain logic (contest judging, email delivery, etc.)
- Multiple people will work on it independently
- It could break without affecting the main site
- It has its own data model beyond user info
