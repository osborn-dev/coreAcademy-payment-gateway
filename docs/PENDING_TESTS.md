# Pending Manual Tests

> Things built and verified at the **code level** (schema, types, lint, build,
> DB seed) but **not yet exercised in a running browser with a logged-in
> session**. There is no automated test suite — these are manual browser passes.
> Local-only doc.

Run the dev server first:
```bash
npm run dev   # localhost:3000
```
(The empty `MONGO_URI` only breaks `/payment` API routes — the platform runs fine.)

---

## A. Auth (Section 07) — pending browser pass

Code-verified: signup endpoint, bcrypt hash storage, login wall 401/redirect,
provider config. **Not yet done in a browser:**

- [ ] `/` loads while logged out (public landing).
- [ ] Visiting a gated page logged out (e.g. `/explore`) redirects to `/login?callbackUrl=/explore`.
- [ ] **Sign up** via the form (email + password ≥ 8 chars) → 201, then the client `signIn` logs you in.
- [ ] Header swaps from "Sign in" to the avatar/`UserMenu` **without a hard refresh**.
- [ ] DB check: the new `users` row stores a bcrypt `$2a$...` hash, never plaintext.
      `psql "$DATABASE_URL" -c "select email, left(password_hash,7) from users;"`
- [ ] **Log out** from the UserMenu → header returns to "Sign in".
- [ ] **Log in** again: correct password works; wrong password / unknown email → the *same* generic error (no user enumeration).
- [ ] After login from a redirect, you land back on the `callbackUrl` page.
- [ ] OAuth (only once keys are in `.env`): Google + GitHub each create a `users` + `accounts` row; signing in twice with the same email does **not** duplicate the user.

> OAuth keys (`GOOGLE_CLIENT_ID/SECRET`, `GITHUB_ID/SECRET`) are still empty stubs
> in `.env` — the email/password path can be fully tested without them.

---

## B. Courses & Comments (Section 08) — pending browser pass

Code-verified: 3 routes + comment API compiled, lint clean, seed ran
(2 courses / 7 lessons, 0 course-posts). **Not yet done in a browser:**

- [ ] `/courses` shows polished `CourseCard`s (Fullstack Foundations + Practical SQL); topic filter via URL works; clearing shows all.
- [ ] `/courses/fullstack-foundations`: hero, description markdown, owner, lesson count, ordered lesson list. Bad slug → 404.
- [ ] Lesson page (`.../lessons/frontend-basics`): explanation renders, owner + release date show, external **"Continue"** button opens in a new tab. (Intro video embed is null in seed — add a real URL to test the iframe.)
- [ ] Two courses sharing a lesson slug don't collide (per-course uniqueness) — not currently in seed data; only matters if you add one.
- [ ] **Comment logged out:** the form shows the "Log in" prompt; a raw `curl -X POST /api/lessons/1/comments` → 401; any existing comments still render.
- [ ] **Comment logged in:** posting appends the comment immediately (via `router.refresh()`) with the correct name + timestamp; empty or >2000 chars → inline 400 error.
- [ ] Migration sanity: `/explore` Format filter no longer lists "Courses"; `/posts/fullstack-foundations` → 404.
- [ ] Cascade (optional, destructive — use a throwaway row): delete a lesson → its comments disappear; delete a course → its lessons + comments disappear.

---

## Notes
- Both passes are independent; either can be done first.
- Report results back and we'll fix anything that surfaces before moving on to the admin dashboard.
