# CoreAcademy — Master Build Plan

> **Local-only document.** This entire `docs/` set lives only on this machine. Nothing here is pushed to git, uploaded, or shared externally. Git operations happen only when the owner explicitly asks.

---

## 1. Vision (60-second version)

CoreAcademy is a **free tech community platform** — a go-to place to discover trending tech content, read articles, watch tech talks, and explore curated learning resources organized by topic (frontend, backend, devops, etc.). It offers 1-on-1 session bookings and an **AI search** that takes a user's context and generates personalized recommendations plus a learning roadmap.

It started life as a paid enrollment gateway. That gateway is **preserved untouched** and relocated to `/payment`. The new platform is built from the root up. All content is **free**.

This is a **solo, "build as ideas come" project.** These docs plan the known work deeply and leave room for ideas to land later (`ROADMAP_FUTURE.md`).

---

## 2. How to use these docs

One combined brief per section (frontend + backend together, since one person builds both). Build sections in order — each is independently runnable and leaves the app working.

| Doc | Section | Phase |
|---|---|---|
| `01_SCAFFOLD_NAVIGATION.md` | Move payment to `/payment`, build platform nav shell | 1A |
| `02_DATABASE_DATA_LAYER.md` | Postgres + Drizzle, schema, seed, content APIs | 1B |
| `03_CONTENT_PAGES.md` | PostCard, topic pages, post detail, markdown | 1C |
| `04_LANDING_EXPLORE.md` | Landing page, explore feed, footer | 1D |
| `05_AI_SEARCH.md` | AI-powered search + roadmaps (now OpenAI; provider-swappable) | 1E |
| `06_POLISH.md` | Animations, SEO, view counts, link audit | 1F |
| `07_AUTH_ACCOUNTS.md` | next-auth (Google/GitHub + email-password), login wall — *plan* | 2 |
| `AUTH_CODE.md` | Auth system **as built** — code reference | 2 |
| `08_COURSES.md` | Courses → lessons → comments; retire course-as-post — *plan* | 2 |
| `COURSES_CODE.md` | Course/lesson/comment system **as built** — code reference | 2 |
| `PENDING_TESTS.md` | Manual browser passes still owed (auth + courses) | — |
| `09_ADMIN_DASHBOARD.md` | Admin: posts/courses/lessons CRUD + comment moderation; email-allowlist authz — *plan* | 3 |
| `ROADMAP_FUTURE.md` | Sketched later ideas | — |

> Phase 1 (01–06) is built and verified. Phase 2 (07 auth + 08 courses) is **built** and verified at the code/build/seed level; two manual browser passes remain (see `PENDING_TESTS.md`). Light/dark mode also shipped (see `ROADMAP_FUTURE.md` / git).
>
> **Phase 3 — admin dashboard:** brief written (`09_ADMIN_DASHBOARD.md`), not yet built. Authz decided: **email allowlist** via `ADMIN_EMAILS` (no schema change; swappable for a `users.role` column later). Covers posts + courses/lessons CRUD and comment moderation (the `comments.status` column is pre-baked). Build it after the two pending browser passes (`PENDING_TESTS.md`).

Each brief has the same skeleton:
1. **What we're building** — plain language
2. **Contracts** — the data/API boundary (function signatures, shapes). Stable surface; changing one means updating consumers.
3. **Tasks** — every task tagged `[OPUS]` or `[SONNET-OK]`
4. **Sonnet context blocks** — one per `[SONNET-OK]` task, fully spoon-fed
5. **Verification checklist**

---

## 3. Architecture

**Framework:** Next.js 15 App Router, React 19. Server Components fetch data directly; Client Components (`"use client"`) handle interactivity (scroll, forms, search).

**Styling:** Tailwind CSS v4 — **no config file**, pure utility classes. Dark theme throughout.

**Routing (file-based, Next.js):**

```
/                    → platform landing (PUBLIC)
/login /signup       → auth pages (PUBLIC) [Section 07]
/explore             → content feed (filterable) [gated]
/topics/[slug]       → topic page [gated]
/posts/[slug]        → single article/video [gated]
/search              → AI search + roadmaps [gated]
/courses             → course catalog [gated] [Section 08]
/courses/[slug]      → course detail + lesson list [gated]
/courses/[slug]/lessons/[lessonSlug] → lesson page + comments [gated]
/bookings            → 1-on-1 booking [gated]
/about /terms /privacy → static pages [gated]
/payment             → relocated enrollment gateway (PUBLIC, untouched logic)
/payment-success     → existing (untouched)
```

**Layouts:**
- `app/layout.js` (root) → `AuthProvider > ThemeProvider > PlatformChrome` (header + children + footer)
- `app/payment/layout.js` → overrides root for the `/payment` subtree; forced dark, no platform chrome
- `middleware.ts` (Section 07) → login wall: redirects logged-out users to `/login?callbackUrl=...` for everything except the public allowlist (`/`, `/login`, `/signup`, `/payment*`, `/api/auth/*`, static)

**Gating model (Phase 2):** the platform requires login except the landing page. Public front door = `/` + auth pages + the payment gateway; everything else is behind the wall.

---

## 4. Database Strategy

Dual-DB, intentional and temporary:

| Layer | Database | ORM | Status |
|---|---|---|---|
| Platform content (`posts`, `topics`, `courses`, `lessons`, `comments`) | PostgreSQL | Drizzle ORM | NEW |
| Platform accounts (`users`, `accounts`, `sessions`, `verification_tokens`) | PostgreSQL | Drizzle ORM + next-auth | NEW [Section 07] |
| Existing payment/enrollment (`User`, `Payment`) | MongoDB | Mongoose | UNTOUCHED |

The two sides never query each other. **Two distinct user concepts:** the Postgres `users` table is the platform account (login, comments, future progress); the Mongo `User` is the payment enrollee record. They are separate and stay separate until the eventual payment migration, when everything moves to Postgres and Mongo is dropped (see `ROADMAP_FUTURE.md`).

**New Postgres client** (`drizzle/db.ts`) mirrors the global-cache pattern of the existing `Config/DataBase.js` so it survives Next.js hot reload.

---

## 5. Tiering Rules — `[OPUS]` vs `[SONNET-OK]`

Heavy/architectural/risky work runs in Claude Code with the full brief in context (`[OPUS]`). Well-scoped grunt work is delegated to Sonnet/Copilot (`[SONNET-OK]`) — but only with a fully spoon-fed context block, because Sonnet hallucinates identifiers when prompts are vague.

**Always `[OPUS]` — never delegate:**
- Drizzle schema design + migrations
- The Drizzle client singleton (`drizzle/db.ts`) — pooling + hot-reload caching is subtle
- Any code touching existing payment/Mongoose code or `app/layout.js` (could break the live gateway)
- The first component/route of any new family (it sets the pattern Sonnet then copies)
- The AI recommend route — prompt design, JSON parsing, Claude SDK
- Any full-text-search SQL (`tsvector` / GIN index)

**`[SONNET-OK]` (with full context block):**
- Additional content components once `PostCard` sets the pattern (`TopicCard`, `ContentTypeBadge`)
- Simple SELECT-only API routes against tables Opus already designed
- Static/presentational pieces (footer, badge variants)
- Seed-data array scaffolds (shape defined; owner fills content)

**Every `[SONNET-OK]` task carries a context block** with: file to create, exact pattern file to copy, verbatim imports, exact table/column names, return shape, and a DO-NOT list. If any field can't be filled concretely → demote to `[OPUS]`.

**Never `[SONNET-OK]`:** anything touching money, auth, schema, migrations, or the existing payment code.

---

## 6. Verified Project Facts (use these REAL identifiers — never invent)

**Existing nav pattern** — [`Components/Header.js`](../Components/Header.js):
- `"use client"` at top
- Scroll state: `const [scrolled, setScrolled] = useState(false)` + `useEffect` listening to `window.scrollY > 20`
- Shell: `fixed top-0 left-0 right-0 z-50 transition-all duration-300`
- Scrolled: `bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/20`; else `bg-transparent`
- Imports (verbatim):
  ```js
  "use client";
  import Link from "next/link";
  import { useState, useEffect } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCode } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons";
  ```
- Discord URL: `https://discord.gg/BAbVZBAn`
- Discord button classes: `text-sm text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30`

**DB connection pattern** — [`Config/DataBase.js`](../Config/DataBase.js): default export `connectDB`, global-cached connection (`global.mongoose = global.mongoose || {...}`). Mirror this caching idea for `drizzle/db.ts`.

**Path alias:** `@/*` = project root (`jsconfig.json`). Import existing components as `@/Components/HomeClient`.

**Installed deps (no need to add):** `framer-motion@^12.6.2`, `lucide-react@^0.487.0`, `@fortawesome/fontawesome-svg-core@^6.7.2`, `@fortawesome/free-brands-svg-icons@^6.7.2`, `@fortawesome/free-solid-svg-icons@^6.7.2`, `@fortawesome/react-fontawesome@^0.2.2`, `mongoose@^8.13.0`, `next@15.2.4`, `react@^19.0.0`, `react-dom@^19.0.0`, `tailwindcss@^4`, `react-toastify@^11.0.5`, `next-auth@^4.24.11`, `stripe`, `paystack-api`, `nodemailer`, AWS S3 SDK.

**NEW deps to install (flagged per section):** `drizzle-orm`, `drizzle-kit`, `postgres`, `react-markdown`, `@anthropic-ai/sdk`.

**NEW env vars:** `DATABASE_URL` (Postgres connection string), `ANTHROPIC_API_KEY`.

**npm scripts:** `dev`, `build`, `start`, `lint`. **No test script** — verification is manual + `npm run build`/`lint`.

---

## 7. Design System

- Backgrounds: `bg-gray-950`, `bg-gray-900`, `bg-blue-950`; gradients `from-gray-950 via-gray-900 to-blue-950`
- Primary: blue (`blue-400`/`blue-600`); community: indigo; accents: emerald, amber, red
- Glassmorphism: `backdrop-blur-md`, `bg-white/5`, `bg-white/10`, `border-white/10`
- Radius: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Text: white on dark; `text-gray-300`/`text-gray-400` for secondary
- Motion: Framer Motion for entrances; `staggerChildren` for grids
- Icons: FontAwesome (solid + brands) and Lucide React

---

## 8. Files Left Untouched (across all sections)

`Components/HomeClient.js`, `Components/Header.js`, `Models/User.js`, `Models/Payment.js`, `Config/DataBase.js`, `Lib/nodemailer.js`, all `app/api/{submit,stripe,paystack,paystack-webhook,payment-success}/route.js`, `app/payment-success/`, `app/terms/`, `app/privacy/`.

The only existing files edited in Phase 1: `app/layout.js`, `app/page.js`, `app/about/page.js`, `app/bookings/page.js` (and only the changes described in their briefs).
