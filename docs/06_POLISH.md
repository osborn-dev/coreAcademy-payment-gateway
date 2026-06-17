# 06 — Polish (Phase 1F)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md`. Local-only doc. Final pass before the platform is launch-ready.

## 1. What we're building

No new features — quality, motion, SEO, and a full regression check. After this section the free platform is shippable and the payment gateway is verified intact.

## 2. Contracts

No new contracts. Touches existing pages/components from sections 03–05.

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | Stagger entrance animations on grids | `[SONNET-OK]` | landing, explore, topic grids |
| 2 | `generateMetadata` on all content pages | `[SONNET-OK]` | `app/posts/[slug]/page.js`, `app/topics/[slug]/page.js`, `app/explore/page.js`, `app/search/page.js` |
| 3 | Fire-and-forget view increment on post view | `[OPUS]` | post detail page client wrapper |
| 4 | Full link + route audit | `[OPUS]` | all platform pages |
| 5 | `/payment` end-to-end smoke test | `[OPUS]` | manual |

### Task 3 `[OPUS]`
Add a tiny client component (`Components/platform/ViewTracker.js`, `"use client"`) that on mount does `fetch('/api/posts/' + slug + '/view', { method: 'POST' })` and ignores the result (`.catch(() => {})`). Render it inside the post detail page. `[OPUS]` because it must not block render, not double-count on Strict Mode double-mount (guard with a ref), and not break SSR.

### Task 4 `[OPUS]`
Walk every nav link, footer link, card link, and CTA. Confirm: header links (`/`, `/explore`, `/bookings`, `/search`), footer links, `PostCard`→`/posts/[slug]`, `TopicCard`→`/topics/[slug]`, landing CTAs, about/bookings "Enroll"→`/payment`. Fix any 404s. Judgement call work → `[OPUS]`.

### Task 5 `[OPUS]`
Manually run the full payment flow at `/payment`: fill the form, step 1→2, submit, confirm redirect to the payment provider (Paystack/Stripe). Confirm `/api/submit` still creates records. This proves the dual-DB pivot didn't regress the live gateway.

## 4. Sonnet context blocks

### SONNET PROMPT — Task 1 (stagger animations)
```
Files to edit (only the post-grid containers):
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/page.js (trending grid)
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/explore/page.js (post grid)
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/topics/[slug]/page.js (post grid)

Goal: add a staggered fade-in to each PostCard grid using Framer Motion.
These are Server Components, so the MOTION wrapper must be a small client component.
Create ONE shared client wrapper first:
  File: /Users/osborn/coreacademy/coreAcademy-payment-gateway/Components/platform/StaggerGrid.js
  "use client";
  import { motion } from "framer-motion";
  Export a component that renders <motion.div> with a container variant (staggerChildren: 0.08)
  and maps children into <motion.div variants={{hidden:{opacity:0,y:12}, show:{opacity:1,y:0}}}>.
  Accept className for the grid layout classes.
Then in each page, wrap the existing PostCard list with <StaggerGrid className="...existing grid classes...">.

Imports for StaggerGrid (verbatim, add nothing else):
  "use client";
  import { motion } from "framer-motion";

DO NOT:
- Convert the pages themselves to client components (only the wrapper is client)
- Change the grid's Tailwind column classes — keep whatever the page already uses
- Add animation libraries other than framer-motion (already installed)
- Alter PostCard itself
```

### SONNET PROMPT — Task 2 (generateMetadata)
```
Files to edit:
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/posts/[slug]/page.js
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/topics/[slug]/page.js
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/explore/page.js
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/search/page.js

Goal: export an async generateMetadata from each (Next.js App Router convention).
- posts/[slug]: const { slug } = await params; const post = await getPostBySlug(slug);
    return { title: `${post?.title ?? "Post"} — CoreAcademy`, description: post?.excerpt ?? "" }
    (getPostBySlug is imported from "@/Lib/content")
- topics/[slug]: resolve topic via getTopics() find by slug;
    return { title: `${topic?.name ?? "Topic"} — CoreAcademy`, description: topic?.description ?? "" }
- explore: return { title: "Explore — CoreAcademy", description: "Browse articles, videos, and courses." }
- search: return { title: "Search — CoreAcademy", description: "Find content and get a personalized roadmap." }

params and searchParams are PROMISES in Next 15 — always await them.

DO NOT:
- Duplicate data fetching in a way that breaks the page (it's fine for generateMetadata to call getPostBySlug again; Next dedupes)
- Add "use client" (metadata only works in Server Components)
- Change the page's existing default export logic
```

## 5. Verification

- [ ] Landing/explore/topic post grids animate in with a stagger (not all at once, no layout shift)
- [ ] View source on `/posts/[slug]` shows the correct `<title>` and meta description
- [ ] Same for `/topics/[slug]`, `/explore`, `/search`
- [ ] Visiting a post increments `views` exactly once (not twice from Strict Mode)
- [ ] Every header, footer, card, and CTA link resolves — zero unexpected 404s
- [ ] `/payment` full flow works end-to-end (form → submit → provider redirect)
- [ ] `npm run lint` passes; `npm run build` succeeds
- [ ] Mobile viewport: header, grids, and post pages are usable (no overflow)
