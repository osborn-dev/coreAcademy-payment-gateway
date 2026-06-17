# Auth System — Code Reference (as built)

> This documents the authentication code **as it actually exists** in the repo (Section 07). For the build *plan* see `07_AUTH_ACCOUNTS.md`. This file is the "how it works / where to look" reference for future changes. Local-only.

---

## TL;DR

- Library: **next-auth v4** + **@auth/drizzle-adapter** + **bcryptjs**.
- Three ways to sign in: **Google**, **GitHub**, **email + password**.
- Session = **JWT** (signed cookie), not DB-backed. (Required because the Credentials provider can't use DB sessions.)
- The whole platform is behind a **login wall** (`middleware.ts`) except a small public allowlist.
- Platform accounts live in **Postgres** (`users` table), totally separate from the MongoDB payment `User`.

---

## File map

| File | Role |
|---|---|
| `drizzle/schema.ts` | `users`, `accounts`, `sessions`, `verification_tokens` tables |
| `types/next-auth.d.ts` | Adds `session.user.id` / `token.id` to next-auth's types |
| `Lib/auth.ts` | `authOptions` — providers, adapter, JWT strategy, callbacks |
| `app/api/auth/[...nextauth]/route.js` | The next-auth request handler (sign-in, callback, session, signout) |
| `app/api/auth/register/route.js` | Email/password **signup** (next-auth has no built-in registration) |
| `Lib/session.ts` | Server-side gating helpers: `getCurrentUser`, `requireUser`, `requireUserApi` |
| `middleware.ts` | The login wall — redirects/401s unauthenticated requests |
| `Components/platform/AuthProvider.js` | Client `SessionProvider` wrapper (enables `useSession`) |
| `app/layout.js` | Wraps the app: `AuthProvider > ThemeProvider > PlatformChrome` |
| `Components/platform/AuthForm.js` | The login/signup form (client) |
| `app/login/page.js`, `app/signup/page.js` | Public auth pages rendering `AuthForm` |
| `Components/platform/UserMenu.js` | Avatar + dropdown + sign-out (shown in header when logged in) |
| `Components/platform/PlatformHeader.js` | Switches between UserMenu / "Sign in" via `useSession` |
| `app/api/ai/recommend/route.js` | Example gated API route (`requireUserApi`) |

---

## 1. Database schema (`drizzle/schema.ts`)

Four tables, shaped to what `@auth/drizzle-adapter` expects. **The adapter matches columns by TS property name** — `providerAccountId`, `sessionToken`, `refresh_token`, etc. must be spelled exactly, or OAuth silently breaks.

```ts
users               // the account
  id            text PK  ($defaultFn crypto.randomUUID())
  name          text
  email         text NOT NULL   (unique index "users_email_idx")
  emailVerified timestamp
  image         text
  passwordHash  text            // null for OAuth-only accounts
  createdAt     timestamp default now()

accounts            // one row per linked OAuth provider (google, github)
  (provider, providerAccountId) composite PK
  userId → users.id  ON DELETE CASCADE
  type, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state

sessions            // present for adapter completeness; UNUSED at runtime (JWT strategy)
  sessionToken PK, userId → users.id CASCADE, expires

verification_tokens // for email-verification / magic-links (future); (identifier, token) PK
```

Key decisions:
- **`passwordHash` is ours, not the adapter's.** The adapter never touches it; only the Credentials provider + register route read/write it. OAuth-only users have `passwordHash = null`.
- **`email` is unique** so the same person can't make two accounts, and credentials login can look up by email.
- **`sessions` table is unused** at runtime because we use JWT — kept only because the adapter's TypeScript types require it (and it leaves room for magic links later).

Migration: `drizzle/migrations/0001_wide_wolfpack.sql` (generated, additive — does not touch `posts`/`topics`). Applied with `npm run db:migrate`.

---

## 2. Type augmentation (`types/next-auth.d.ts`)

next-auth's default `session.user` has no `id`. We add it so gated code can read the Postgres user id directly off the session:

```ts
declare module "next-auth"      { interface Session { user: { id: string } & DefaultSession["user"] } }
declare module "next-auth/jwt"  { interface JWT { id?: string } }
```

The `id` is put there by the callbacks in `Lib/auth.ts` (below).

---

## 3. Auth config (`Lib/auth.ts`) — the heart

Exported as `authOptions`; imported by **both** the route handler and `getServerSession` (in `Lib/session.ts`). Pieces:

- **`adapter: DrizzleAdapter(db, {...})`** — persists users + OAuth accounts in Postgres. Maps the four tables.
- **`session: { strategy: "jwt" }`** — *required*. The Credentials provider can't create a DB session row (no OAuth account exists for it), so JWT is the only strategy that supports credentials + OAuth together. The session lives in a signed cookie; OAuth identities/links still persist in `accounts`.
- **`pages: { signIn: "/login" }`** — next-auth redirects here instead of its default page.
- **Providers:**
  - `GoogleProvider` / `GitHubProvider` — read `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_ID/SECRET`. GitHub uses `scope: "read:user user:email"` so we get the email. (Empty `?? ""` fallbacks mean the app boots without keys; the buttons just won't work until keys are set.)
  - `CredentialsProvider.authorize(creds)` — the email/password check:
    1. bail if no email/password
    2. lowercase+trim email, look up the user
    3. **reject if no `passwordHash`** (unknown user OR OAuth-only account)
    4. `bcrypt.compare` the password
    5. return `null` on *any* failure → next-auth shows a generic error (**no user enumeration** — wrong-email and wrong-password are indistinguishable to an attacker)
    6. on success return `{ id, name, email, image }`
- **Callbacks** — thread the Postgres user id through the JWT:
  - `jwt({ token, user })`: on sign-in, copy `user.id` → `token.id`
  - `session({ session, token })`: copy `token.id` → `session.user.id`
  - Result: any server code calling `getServerSession` gets `session.user.id` with no extra DB query.
- **`secret: process.env.NEXTAUTH_SECRET`** — signs the JWT cookie. Set in `.env` (generated with `openssl rand -base64 32`).

---

## 4. Route handler (`app/api/auth/[...nextauth]/route.js`)

```js
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

This single catch-all powers every next-auth endpoint: `/api/auth/signin`, `/api/auth/callback/{google,github,credentials}`, `/api/auth/session`, `/api/auth/signout`, `/api/auth/providers`, etc. We never call these directly — the client `signIn()`/`signOut()` and `useSession()` do.

---

## 5. Signup endpoint (`app/api/auth/register/route.js`)

next-auth has **no built-in registration**, so we own it. `POST { name?, email, password }`:

1. validate email format + password ≥ 8 chars → `400` if bad
2. normalize email (lowercase/trim)
3. `409` if email already exists
4. `bcrypt.hash(password, 12)` → insert the user
5. `201` on success — **does NOT log the user in**. The client (`AuthForm`) calls `signIn("credentials", …)` right after a 201.

Never returns the hash; errors are generic.

---

## 6. Gating helpers (`Lib/session.ts`)

Thin wrappers over `getServerSession(authOptions)`:

- **`getCurrentUser()`** → the user object or `null`. For optional/conditional logic.
- **`requireUser(callbackUrl?)`** → for **Server Components**. Returns the user, or `redirect("/login?callbackUrl=…")` if absent. (Used for page-level gates beyond the middleware.)
- **`requireUserApi()`** → for **Route Handlers**. Returns `{ user, response }`; if `response` is non-null it's a ready-made `401` to return immediately, else `user` is present.

Usage in a gated API route:
```js
const { user, response } = await requireUserApi();
if (response) return response;   // 401
// ... use user.id ...
```

---

## 7. The login wall (`middleware.ts`)

Runs on (almost) every request before the page/route. Logic:

1. If the path is in the **public allowlist**, allow through.
2. Else read the JWT via `getToken`. If a valid session exists, allow.
3. Else:
   - **API route** (`/api/*`) → return JSON `401` (so a `fetch()` gets a clean 401, not an HTML redirect that would break the caller).
   - **Page** → `redirect("/login?callbackUrl=<original path>")`.

**Public allowlist** (everything else is gated):
- exact: `/`, `/login`, `/signup`
- prefixes: `/payment`, `/api/payment`, `/api/submit`, `/api/stripe`, `/api/paystack` (the payment gateway is its own world)
- `/api/auth/*` (next-auth's own endpoints must stay open)
- the `matcher` already excludes `_next/*` and static asset files

So: a logged-out visitor can see the landing page, the auth pages, and the payment flow; anything else bounces them to `/login` and returns them after sign-in via `callbackUrl`.

> **Two layers of defense.** The middleware is the primary gate, but sensitive API routes *also* call `requireUserApi()` themselves (see the AI route) so they're safe even if the matcher is ever changed.

---

## 8. Client wiring

- **`AuthProvider.js`** — `"use client"` wrapper around next-auth's `SessionProvider`. Required for `useSession()` to work anywhere in the tree.
- **`app/layout.js`** — wraps the app: `AuthProvider > ThemeProvider > PlatformChrome > children`. AuthProvider is outermost so session is available everywhere (header, forms, etc.). This is additive — the theme flash-script and chrome path-gating are unchanged.
- **`PlatformHeader.js`** — calls `useSession()` and renders:
  - `status === "loading"` → a small pulsing placeholder (no layout shift)
  - signed in → `<UserMenu user={session.user} />`
  - signed out → a "Sign in" link to `/login`
- **`UserMenu.js`** — avatar (image or initial), click opens a dropdown with name/email + **Sign out** (`signOut({ callbackUrl: "/" })`); has an outside-click backdrop to close.
- **`AuthForm.js`** — the form on `/login` and `/signup` (prop `mode`):
  - **login** → `signIn("credentials", { redirect: false, email, password, callbackUrl })`; on `res.error` shows "Invalid email or password", else `router.push(callbackUrl)`
  - **signup** → `POST /api/auth/register`; on `201` immediately `signIn("credentials", …)` then push; `409` → "Email already in use"; other → generic
  - OAuth buttons → `signIn("google"|"github", { callbackUrl })`. **These are `type="button"`** so they don't submit the form.
  - bottom toggle link switches login↔signup **preserving `callbackUrl`**
- **`app/login/page.js` / `app/signup/page.js`** — Server Components that read `searchParams.callbackUrl` (await it — Next 15) and render `AuthForm`. These pages are in the public allowlist.

---

## 9. Sign-in flows (end to end)

**Email/password — new user:**
`/signup` → AuthForm POSTs `/api/auth/register` → 201 → AuthForm calls `signIn("credentials")` → JWT cookie set → redirect to `callbackUrl`.

**Email/password — returning user:**
`/login` → AuthForm `signIn("credentials")` → `authorize()` verifies bcrypt hash → JWT set → redirect.

**OAuth (Google/GitHub):**
button → `signIn("google")` → provider consent → callback `/api/auth/callback/google` → adapter upserts `users` + `accounts` rows → JWT set → redirect. Same email via a second provider links to the same user (email is unique).

**Gated navigation while logged out:**
visit `/explore` → middleware sees no token → `redirect("/login?callbackUrl=/explore")` → after login, AuthForm pushes back to `/explore`.

---

## 10. Environment variables (`.env`, gitignored)

| Var | Purpose | Notes |
|---|---|---|
| `NEXTAUTH_SECRET` | signs the JWT cookie | set (local dev value); rotate for prod |
| `NEXTAUTH_URL` | base URL | `http://localhost:3000` locally |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth | empty until you create the OAuth app |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth | empty until you register the OAuth app |
| `DATABASE_URL` | Postgres (shared with the rest of the platform) | already set |

OAuth callback URLs to register with each provider:
`${NEXTAUTH_URL}/api/auth/callback/google` and `${NEXTAUTH_URL}/api/auth/callback/github`.

---

## 11. How to extend (common future tasks)

- **Gate a new page** → at the top of the Server Component: `const user = await requireUser("/that-path")`. (Or rely on the middleware wall if the path isn't in the allowlist.)
- **Gate a new API route** → `const { user, response } = await requireUserApi(); if (response) return response;`
- **Make a path public** → add it to `PUBLIC_EXACT` or `PUBLIC_PREFIXES` in `middleware.ts`.
- **Read the user in a Client Component** → `const { data: session } = useSession();` then `session?.user?.id`.
- **Add per-user data (progress, bookmarks)** → new Postgres table with `userId` FK → `users.id` (this is what Section 08 comments do).
- **Add email verification / magic links** → the `verification_tokens` table and the email provider are already accommodated by the adapter.

---

## 12. Known characteristics / gotchas

- **JWT sessions aren't server-revocable** (no DB session row to delete). Acceptable now; revisit if you need force-logout.
- **Adapter maps tables by property name** — renaming a column key (e.g. `providerAccountId`) silently breaks OAuth. Don't rename those.
- **Two distinct user tables** — Postgres `users` (platform) vs Mongo `User` (payment). They are not linked; don't confuse them.
- **App boots without OAuth keys** (empty-string fallbacks) — but the Google/GitHub buttons will error until real keys are in `.env`. Email/password works without them.
