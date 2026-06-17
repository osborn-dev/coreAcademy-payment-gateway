# 07 — Auth & Accounts (Phase 2, Section 07)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` for tiering rules, verified facts, design system. Local-only doc. Built BEFORE the course section so comments have real identities.

## 1. What we're building

Real authentication for the platform: sign in with **Google, GitHub, OR email+password**. After this, the **whole platform requires login except the landing page** (`/`) — a `middleware.ts` login wall enforces it. The new `users` table is **Postgres/Drizzle**, separate from the untouched MongoDB payment `User`.

**Gating model:** Public = `/`, `/login`, `/signup`, `/payment*` (its own world), `/api/auth/*`, static assets. Everything else (`/explore`, `/courses`, `/topics`, `/posts`, `/search`, `/bookings`) → redirect to `/login?callbackUrl=...` when logged out.

## 2. Contracts

The stable surfaces other code depends on:

```ts
// Lib/auth.ts
export const authOptions: NextAuthOptions   // shared by route handler + getServerSession

// Lib/session.ts
getCurrentUser(): Promise<{ id: string; name?: string; email?: string; image?: string } | null>
requireUser(callbackUrl?: string): Promise<User>          // Server Components — redirects if absent
requireUserApi(): Promise<{ user, response }>             // Route handlers — response is a 401 NextResponse or null

// session shape (augmented)
session.user.id: string   // the Postgres users.id
```

API:
- `GET|POST /api/auth/[...nextauth]` — next-auth handler
- `POST /api/auth/register` — `{ name?, email, password }` → 201 | 400 | 409

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | Install `@auth/drizzle-adapter`, `bcryptjs`, `@types/bcryptjs` | `[OPUS]` | package.json |
| 2 | Schema: users, accounts, sessions, verificationTokens | `[OPUS]` | `drizzle/schema.ts` |
| 3 | Type augmentation | `[OPUS]` | `types/next-auth.d.ts` |
| 4 | Generate + apply migration | `[OPUS]` | `drizzle/migrations/*` |
| 5 | `authOptions` (adapter + 3 providers + JWT + callbacks) | `[OPUS]` | `Lib/auth.ts` |
| 6 | next-auth route handler | `[OPUS]` | `app/api/auth/[...nextauth]/route.js` |
| 7 | Credentials register endpoint | `[OPUS]` | `app/api/auth/register/route.js` |
| 8 | Session helpers | `[OPUS]` | `Lib/session.ts` |
| 9 | Login-wall middleware | `[OPUS]` | `middleware.ts` |
| 10 | SessionProvider wrapper | `[OPUS]` | `Components/platform/AuthProvider.js` |
| 11 | Wrap root layout | `[OPUS]` | `app/layout.js` |
| 12 | Gate AI route (defense-in-depth) | `[OPUS]` | `app/api/ai/recommend/route.js` |
| 13 | AuthForm (login+signup, OAuth buttons) | `[SONNET-OK]` | `Components/platform/AuthForm.js` |
| 14 | /login + /signup pages | `[SONNET-OK]` | `app/login/page.js`, `app/signup/page.js` |
| 15 | UserMenu (avatar + dropdown) | `[SONNET-OK]` | `Components/platform/UserMenu.js` |
| 16 | Header auth state | `[OPUS]` logic | `Components/platform/PlatformHeader.js` |
| 17 | Search 401 prompt | `[SONNET-OK]` | `Components/platform/SearchResults.js` |

### Critical [OPUS] notes
- **JWT session strategy is required** — next-auth v4 Credentials provider can't use DB sessions. The adapter still persists users/accounts (OAuth identity + linking); only the session lives in the signed JWT. `jwt`/`session` callbacks thread `users.id` onto `session.user.id`.
- **Adapter maps tables by TS property key** — `providerAccountId`, `sessionToken`, `refresh_token`, `id_token`, `session_state` must be spelled exactly. A typo here is the most likely failure mode (surfaces during OAuth test).
- **Credentials `authorize()`** — lowercase email, reject if no `passwordHash` (OAuth-only account), `bcrypt.compare`, return `null` on ANY failure (no user enumeration).
- **Register** — min 8 chars, email format check, normalized lowercase email, 409 if exists, `bcrypt.hash(pw, 12)`, never echo the hash, does NOT auto-sign-in.
- **Middleware** uses `withAuth` (next-auth/middleware) with a matcher that EXCLUDES the public allowlist; or `getToken` + manual redirect. Must not gate `/`, `/login`, `/signup`, `/payment*`, `/api/auth/*`, `/api/payment*`, `_next`, static files.
- **Layout wrap order:** `AuthProvider > ThemeProvider > PlatformChrome` (AuthProvider outermost so `useSession` works everywhere; additive — flash script + chrome pathname gating unaffected).

## 4. Sonnet context blocks

### SONNET PROMPT — Task 13 (AuthForm)
```
File to create: Components/platform/AuthForm.js  ("use client")
Imports (verbatim):
  "use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { signIn } from "next-auth/react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

Props: { mode, callbackUrl }  where mode is "login" | "signup", callbackUrl defaults to "/".
Render a centered glass card form:
  - email input, password input (signup also: name input, confirm-password input)
  - signup requires password length >= 8 and password === confirm (inline error otherwise)
  - LOGIN submit: await signIn("credentials", { redirect: false, email, password, callbackUrl });
      if res?.error -> show inline "Invalid email or password"; else router.push(callbackUrl)
  - SIGNUP submit: POST to /api/auth/register with { name, email, password } (JSON).
      on 201 -> await signIn("credentials", { redirect:false, email, password, callbackUrl }) then router.push(callbackUrl)
      on 409 -> inline "Email already in use"; on 400 -> inline "Please check your details"
  - Two OAuth buttons: onClick signIn("google", { callbackUrl }) and signIn("github", { callbackUrl }),
      each with the matching brand icon + "Continue with Google/GitHub"
  - A toggle link at the bottom switching login<->signup that PRESERVES callbackUrl
    (login -> href `/signup?callbackUrl=...`, signup -> `/login?callbackUrl=...`)

Design tokens (match the app): card "bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8";
  inputs "w-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white";
  primary button "bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 font-semibold";
  oauth buttons "border border-gray-200 dark:border-white/10 rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-black/[0.03] dark:hover:bg-white/5".

DO NOT:
- Import the DB, authOptions, or bcrypt (this is a client component)
- Add providers logic here — only call signIn()
- Hardcode a callbackUrl other than the prop (default "/")
```

### SONNET PROMPT — Task 14 (login + signup pages)
```
Files to create: app/login/page.js and app/signup/page.js  (Server Components, NO "use client")
Each:
  import AuthForm from "@/Components/platform/AuthForm";
  export const metadata = { title: "Sign in — CoreAcademy" } (signup: "Create account — CoreAcademy")
  export default async function Page({ searchParams }) {
    const sp = await searchParams;                  // Next 15: async
    const callbackUrl = sp?.callbackUrl ?? "/";
    return (<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 px-6 transition-colors">
      <div className="w-full max-w-md"><AuthForm mode="login" callbackUrl={callbackUrl} /></div>
    </main>);
  }
(signup page uses mode="signup")

DO NOT: add "use client"; fetch data; gate these pages (they MUST stay public).
```

### SONNET PROMPT — Task 15 (UserMenu)
```
File to create: Components/platform/UserMenu.js  ("use client")
Imports:
  "use client";
  import { useState } from "react";
  import { signOut } from "next-auth/react";

Props: { user }  where user = { name, email, image }.
Render an avatar button (user.image as <img> if present, else a circle with the first letter of name/email).
On click toggle a dropdown panel showing: user.name, user.email (text-gray-500 text-xs), and a "Sign out" button
  that calls signOut({ callbackUrl: "/" }).
Dropdown panel classes: "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg p-3 z-50".
Avatar circle: "w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold overflow-hidden".

DO NOT: import useSession (the user is passed as a prop); fetch data; add routing other than signOut.
```

### SONNET PROMPT — Task 17 (Search 401 prompt)
```
File to edit: Components/platform/SearchResults.js
Goal: when the recommend API returns 401, show a "sign in to use AI search" prompt instead of the generic error.
In the fetch .then, the code currently throws on !res.ok. Change so that:
  - if res.status === 401, set a new state value "needs-auth" (add it alongside idle|loading|done|error)
  - render, for "needs-auth", a card (reuse the error-card styling) with text "Sign in to get personalized recommendations"
    and a link to `/login?callbackUrl=/search?q=<encodeURIComponent(query)>` styled like a blue button.
DO NOT: change the success/loading/idle rendering; remove the generic error branch (keep it as a backstop).
```

## 5. Env vars (owner fills `.env`)
```
NEXTAUTH_SECRET=        # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```
OAuth redirect URIs to register: `${NEXTAUTH_URL}/api/auth/callback/google` and `/api/auth/callback/github`.

## 6. Verification
- [ ] `npm run db:studio` shows users/accounts/sessions/verification_tokens + unique email index
- [ ] Signup → 201, signed in; studio shows bcrypt `$2a$...` hash, never plaintext
- [ ] Login: correct pw → in; wrong pw OR unknown email → same generic error (no enumeration)
- [ ] Google + GitHub OAuth → users + accounts rows; same email twice → no duplicate user
- [ ] Login wall: logged out → `/explore` redirects to `/login?callbackUrl=/explore`; after login bounces back
- [ ] `/`, `/login`, `/signup`, `/payment` load while logged out
- [ ] Header shows UserMenu when authed, "Sign in" when not; updates without hard refresh
- [ ] `POST /api/ai/recommend` logged out → 401
- [ ] Regression: theme/no-flash intact; `/payment` chrome intact; build + lint pass
