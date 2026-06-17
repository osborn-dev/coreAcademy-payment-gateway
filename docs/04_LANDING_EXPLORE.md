# 04 — Landing & Explore (Phase 1D)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` and section 02/03. Local-only doc.

## 1. What we're building

The two discovery surfaces and the footer. The new **landing page** (`/`) replaces the placeholder from section 01 with a real hero, a trending posts grid, and topic pills. The **explore feed** (`/explore`) lists all content with URL-param-driven filters (type + topic). The **footer** completes the platform chrome (its slot was reserved in section 01).

Depends on sections 02 (`getPosts`, `getTopics`) and 03 (`PostCard`, `TopicCard`).

## 2. Contracts

No new data contracts — reuses section 02 functions. New surface:
- `<PlatformFooter />` — static; rendered by the root layout's `PlatformChrome` wrapper (hidden on `/payment`, same as the header).
- `<FilterBar filters={...} active={...} basePath="/explore" />` — renders filter tabs as `next/link`s that set URL search params (no client state).

Filter semantics for `/explore`:
- `?type=article|video|course` and `?topic=<slug>` — both optional, stackable.
- The page reads `searchParams` (async in Next 15) and calls `getPosts({ type, topic })`.

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | New landing page (hero + trending + topic pills) | `[OPUS]` | `app/page.js` |
| 2 | `FilterBar` (URL-param tabs, first of family) | `[OPUS]` | `Components/platform/FilterBar.js` |
| 3 | Explore page (filtered grid) | `[OPUS]` | `app/explore/page.js` |
| 4 | `PlatformFooter` | `[SONNET-OK]` | `Components/platform/PlatformFooter.js` |
| 5 | Wire footer into `PlatformChrome` | `[OPUS]` | `Components/platform/PlatformChrome.js` (from §01) |

### Task 1 `[OPUS]` — landing page
Server Component. Sections top→bottom:
1. **Hero** — headline ("Your launchpad into tech"), subtext, two CTAs (`/explore`, `/search`). Gradient bg `from-gray-950 via-gray-900 to-blue-950`, optional blurred orbs (match `about/page.js` style).
2. **Trending** — `getPosts({ featured: true, limit: 6 })`; if fewer than 6, fall back to `getPosts({ limit: 6 })`. Grid of `PostCard`.
3. **Browse topics** — `getTopics()` → row/grid of `TopicCard`.
Replaces the section-01 placeholder. Touches the homepage + composes multiple data calls → `[OPUS]`.

### Task 2 `[OPUS]` — `FilterBar`
Sets the pattern for URL-driven filtering. Renders tab links; the active one (matching current `searchParams`) gets an active style (`bg-blue-600 text-white`), others `bg-white/5 text-gray-300`. Each link is a `next/link` to `basePath?` with merged params so type and topic stack. Because it must merge/preserve existing params correctly, it's `[OPUS]`.

### Task 3 `[OPUS]` — explore page
```
export default async function ExplorePage({ searchParams }) {
  const sp = await searchParams;          // Next 15: async
  const type = sp.type; const topic = sp.topic;
  const posts = await getPosts({ type, topic });
  const topics = await getTopics();
  // <FilterBar> for type, <FilterBar> for topics, then PostCard grid (empty state if none)
}
```
Empty state: friendly "No content here yet" card + CTA to clear filters.

## 4. Sonnet context blocks

### SONNET PROMPT — Task 4 (`PlatformFooter`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/Components/platform/PlatformFooter.js
Pattern: static footer. NO "use client" needed.

Imports (verbatim, add nothing else):
  import Link from "next/link";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCode } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord, faInstagram } from "@fortawesome/free-brands-svg-icons";

Render a <footer> with dark bg "bg-gray-950 border-t border-white/10":
  - Left: faCode icon (text-blue-400) + "CoreAcademy" wordmark + a one-line tagline (text-gray-400)
  - Link columns (use Link for internal, <a> for external):
      Explore: /explore, /topics/frontend, /bookings, /search
      Company: /about, /terms, /privacy
      Community: Discord -> https://discord.gg/BAbVZBAn, Instagram -> https://instagram.com (placeholder)
  - Bottom row: "© 2026 CoreAcademy" (text-gray-500 text-sm)
Internal links text style: "text-gray-400 hover:text-white text-sm transition-colors"

DO NOT:
- Add "use client", state, scroll listeners, or Framer Motion
- Invent routes other than the ones listed
- Fetch data
- Reference /payment anywhere (the footer is platform-only and is hidden on /payment by PlatformChrome)
```

## 5. Verification

- [ ] `/` shows hero, trending grid (real `PostCard`s), and topic pills (real `TopicCard`s)
- [ ] Featured posts appear in trending; fallback to latest works when <6 featured
- [ ] Topic pills link to the correct `/topics/[slug]`
- [ ] `/explore` lists all published posts by default
- [ ] `/explore?type=video` shows only videos; `/explore?topic=backend` only backend
- [ ] `/explore?type=article&topic=frontend` applies BOTH (params stack, FilterBar preserves the other param)
- [ ] Browser Back button restores the previous filter view
- [ ] Empty filter combination shows the empty state, not a crash
- [ ] `PlatformFooter` renders on `/`, `/explore`, `/topics/*`, `/posts/*` — and NOT on `/payment`
- [ ] All footer links resolve (no 404 except intentional external placeholders)
- [ ] `npm run build` succeeds
