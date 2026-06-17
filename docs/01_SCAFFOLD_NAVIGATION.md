# 01 — Scaffold & Navigation (Phase 1A)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` for tiering rules, verified facts, and design system. Local-only doc.

## 1. What we're building

The structural foundation. Move the existing payment gateway out of the homepage and into `/payment` (untouched), then stand up the platform navigation shell so every future content page has a consistent header/footer. After this section the app has two worlds: the live payment gateway at `/payment`, and the new platform shell at `/`.

**No database, no content yet.** Pure structure.

## 2. Contracts

No data contracts this phase. The one cross-cutting surface is the **layout boundary**:

- Root layout (`app/layout.js`) wraps all routes with `PlatformHeader` + `PlatformFooter`.
- `app/payment/layout.js` overrides the root for `/payment/*` and renders **only** `{children}` (no platform chrome).

`PlatformFooter` is created in section 04; until then root layout renders the header only and leaves a comment placeholder where the footer will go.

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | Create payment subtree layout (no platform nav) | `[OPUS]` | `app/payment/layout.js` |
| 2 | Create payment page that re-exports HomeClient | `[SONNET-OK]` | `app/payment/page.js` |
| 3 | Build `PlatformHeader` (first of component family) | `[OPUS]` | `Components/platform/PlatformHeader.js` |
| 4 | Update root layout to render header + footer slot | `[OPUS]` | `app/layout.js` |
| 5 | Replace homepage with platform landing placeholder | `[OPUS]` | `app/page.js` |
| 6 | Repoint "Enroll Now" CTAs → `/payment` | `[SONNET-OK]` | `app/about/page.js`, `app/bookings/page.js` |

### Task 1 `[OPUS]` — `app/payment/layout.js`
The current root layout initializes FontAwesome and renders bare `{children}`. The payment subtree must keep that exact behavior (HomeClient renders its own inline header, so no platform chrome). Because Next.js nested layouts compose, and the root layout will now inject `PlatformHeader`/`PlatformFooter`, this layout must **suppress** them. Next.js does not let a child layout "remove" parent chrome directly — so the cleanest approach: keep the platform header/footer logic out of the root `<body>` and instead use a **route group** OR conditionally render. Decision: root layout renders header/footer unconditionally; the payment pages are visually full-screen and HomeClient already covers the viewport. To truly isolate, wrap platform chrome so it does not appear on `/payment`. Implement by making the root layout check is not possible (layouts don't see pathname server-side easily) — therefore use a **client component wrapper** `PlatformChrome` that reads `usePathname()` and returns null on `/payment*`. Document this decision in the file header comment. (This is why it's `[OPUS]`.)

### Task 3 `[OPUS]` — `PlatformHeader`
Copy the structure of `Components/Header.js` verbatim (scroll listener, fixed shell, glassmorphism states, Discord button) and change only the nav links. New links: Home (`/`), Explore (`/explore`), Bookings (`/bookings`), Search (`/search`). Keep the `faCode` logo linking to `/`. Keep the Discord CTA exactly as-is. This is the pattern file for all future platform components, so it must be clean.

### Task 4 `[OPUS]` — `app/layout.js`
Edit the existing root layout. Keep the FontAwesome `library.add(fas)` setup. Wrap `{children}` with the `PlatformChrome` client wrapper (renders `PlatformHeader` above children and a footer-slot comment below, but returns plain children on `/payment*`). Add top padding to the content area so the fixed header doesn't overlap (`pt-16` or similar) — but NOT on payment routes. This file touches the live app shell → `[OPUS]`.

### Task 5 `[OPUS]` — `app/page.js`
Replace the current `HomeClient` re-export with a new Server Component landing placeholder: a hero (headline, subtext, two CTAs → `/explore` and `/search`) and a "Trending — coming soon" stub grid. Dark theme, matches design system. Real content wired in section 04. Remove the old `generateStaticParams` export (it was for the payment homepage).

## 4. Sonnet context blocks

### SONNET PROMPT — Task 2 (`app/payment/page.js`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/payment/page.js
Goal: a Next.js App Router page that renders the existing enrollment form, unchanged.

Exact contents (this is the WHOLE file — do not add anything else):
  import HomeClient from "@/Components/HomeClient";

  export const metadata = {
    title: "Enroll — CoreAcademy",
    description: "Join CoreAcademy to kickstart your dev journey",
  };

  export default function PaymentPage() {
    return <HomeClient />;
  }

DO NOT:
- Import or modify HomeClient itself
- Add "use client" (this is a Server Component that renders a client child — that's fine)
- Add generateStaticParams, fetch calls, or any DB code
- Touch any other file
```

### SONNET PROMPT — Task 6 (CTA link edits)
```
Files to edit:
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/about/page.js
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/bookings/page.js

Goal: any CTA that currently points users to enroll/pay (an "Enroll Now", "Get Started",
"Begin Your Journey", or "Join" link/button that routes to "/" for enrollment) must point to "/payment".

How:
- Search each file for href="/" and for button text like "Enroll", "Get Started", "Begin".
- For the ones whose INTENT is "go enroll/pay", change the href to "/payment".
- A plain "Home"/logo link that should go to the platform home STAYS as "/".

DO NOT:
- Change any styling, layout, or text copy other than the href value
- Touch /api routes, HomeClient, or payment logic
- Change links that legitimately point to the platform homepage
If unsure whether a given link is an "enroll" link or a "home" link, LEAVE IT and flag it for Opus review.
```

## 5. Verification

- [ ] `npm run dev` starts with no errors
- [ ] `/payment` renders the full multi-step enrollment form, identical to before; step 1 → step 2 works
- [ ] Submitting on `/payment` still hits `/api/submit` (network tab) — gateway not broken
- [ ] `/` shows the new landing placeholder with `PlatformHeader` visible
- [ ] `PlatformHeader` does NOT appear on `/payment`
- [ ] Header scroll effect works (transparent → `bg-gray-900/90` after 20px)
- [ ] Header nav links route to `/`, `/explore` (404 ok for now), `/bookings`, `/search` (404 ok for now)
- [ ] "Enroll Now"-type CTAs in `/about` and `/bookings` land on `/payment`
- [ ] `npm run build` succeeds
