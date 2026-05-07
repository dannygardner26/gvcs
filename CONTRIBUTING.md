# Contributing to GVCS

Welcome! This guide is for everyone — whether you're coding by hand or using an AI assistant (Claude, Copilot, Cursor, etc.).

## The Golden Rule

**All PRs target `dev`, never `master`.**

`master` is the live production site. We test on `dev` first, then merge `dev` into `master` when everything works.

## Setup

```bash
# 1. Fork this repo on GitHub (click the Fork button)
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/gvcs.git
cd gvcs

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000 to see the site running locally.

## Making Changes

### 1. Create a branch

Always branch off `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name
```

Branch naming:
- `feat/` — new features (e.g. `feat/add-about-page`)
- `fix/` — bug fixes (e.g. `fix/broken-nav-link`)
- `chore/` — maintenance (e.g. `chore/update-deps`)
- `ui/` — visual changes (e.g. `ui/dark-mode`)
- `docs/` — documentation (e.g. `docs/update-readme`)

### 2. Make your changes

Edit the files you need. The site auto-refreshes when you save.

Key files:
- `src/app/page.tsx` — Home page
- `src/app/events/page.tsx` — Events page
- `src/components/` — Reusable components
- `src/app/globals.css` — Colors and fonts (design tokens)

### 3. Test locally

```bash
npm run dev
```

Check that:
- Your changes look correct
- Nothing else is broken
- The page loads without errors in the browser console

### 4. Commit and push

```bash
git add .
git commit -m "feat: short description of what you did"
git push -u origin feat/your-feature-name
```

### 5. Open a Pull Request

Go to https://github.com/greatvalleycs/gvcs and click "New Pull Request".

- **Base branch:** `dev` (NOT `master`!)
- **Compare branch:** your feature branch
- Add a short description of what you changed and why

## For AI Assistants / Vibe Coders

If you're using Claude, Copilot, Cursor, or similar:

- **Target branch for PRs:** `dev`
- **Never push to `master` or `dev` directly** — always use a feature branch + PR
- **Never force push**
- **Run `npm run dev` and verify changes work** before submitting
- **Don't install new dependencies** without checking if it's necessary
- **Don't modify `vercel.json`** or deployment config unless asked

### Common AI mistakes to avoid

- Opening a PR against `master` instead of `dev`
- Adding `console.log` or debug code
- Creating unnecessary files
- Installing packages that duplicate existing functionality
- Making changes outside the scope of what was asked

## Project Conventions

### Styling

We use Tailwind CSS. Design tokens are in `src/app/globals.css`:

```css
--color-primary: #1E4D8C;      /* Main blue */
--color-primary-hover: #2A6BC4; /* Hover state */
--color-foreground: #1A1A2E;    /* Text color */
--color-muted: #64748B;         /* Secondary text */
--color-border: #E2E8F0;        /* Border color */
```

### Fonts

- **Headings:** Space Grotesk (`font-heading`)
- **Body:** DM Sans (`font-sans`)
- **Code/mono:** JetBrains Mono (`font-mono`)

### Components

Components live in `src/components/`. They use `"use client"` directive since we use Framer Motion.

## Deployment Flow

```
Your branch → PR into dev → Merge → Test on Vercel preview
                                          ↓
                              Looks good? PR dev into master
                                          ↓
                              Auto-deploys to production
```

## Questions?

Ask in the club Discord or open a GitHub Issue.
