# 09 — Admin Dashboard (Phase 3, Section 09)

> Combined brief. Built AFTER 07 (auth) + 08 (courses). Replaces the "Content Admin
> UI" stub in `ROADMAP_FUTURE.md`. Local-only doc. Follow the established brief
> shape: contracts → tasks (`[OPUS]`/`[SONNET-OK]`) → Sonnet blocks → verification.

## 1. What we're building

A private `/admin` area where the owner manages the platform from the browser
instead of editing `data/seed/*.ts` and re-running the seed script. Three things to
manage:

1. **Posts** — create / edit / publish / unpublish / delete articles & videos.
2. **Courses & lessons** — create / edit a course and its ordered lessons.
3. **Comment moderation** — list lesson comments, hide/unhide (flip `comments.status`), delete.

The seed scripts stay as the bootstrap/dev path; the admin UI becomes the everyday
editing path. Nothing about the public read pages changes — they already read from
the same tables.

**Authz decision (made):** gate by **email allowlist** via an `ADMIN_EMAILS` env var
(comma-separated). No schema change, instant, fine for a solo owner, and trivial to
swap for a `users.role` column later. A user is an admin iff their (lowercased) email
is in the list. This is checked in **three** places (defense-in-depth):
- `middleware.ts` — block `/admin` + `/api/admin/*` for non-admins (redirect / 403).
- a `requireAdmin()` / `requireAdminApi()` helper in `Lib/session.ts` — used by every admin page + route.
- the JWT/session already carries `email`; no token change needed.

> Migration path to a role column later: add `users.role`, set the allowlisted
> emails to `'admin'` once, then change `isAdmin()` to read `user.role`. The brief
> for that is a one-task follow-up; not now.

## 2. Contracts

### `Lib/session.ts` additions
```ts
isAdminEmail(email?: string | null): boolean        // email ∈ ADMIN_EMAILS (lowercased, trimmed)
requireAdmin(callbackUrl?): Promise<User>           // Server Component: redirect non-admins to "/" (or /login if logged out)
requireAdminApi(): Promise<{ user, response }>      // Route Handler: 401 if logged out, 403 if not admin
```

### Admin write APIs (all gated by `requireAdminApi()`)
```
POST   /api/admin/posts            { ...postFields }          → 201 { post }
PATCH  /api/admin/posts/[id]       { ...partialFields }       → 200 { post }
DELETE /api/admin/posts/[id]                                  → 200 { ok }

POST   /api/admin/courses          { ...courseFields }        → 201 { course }
PATCH  /api/admin/courses/[id]     { ...partialFields }       → 200 { course }
DELETE /api/admin/courses/[id]                                → 200 { ok }   (cascades lessons+comments)

POST   /api/admin/courses/[id]/lessons        { ...lessonFields }   → 201 { lesson }
PATCH  /api/admin/lessons/[id]                { ...partialFields }  → 200 { lesson }
DELETE /api/admin/lessons/[id]                                      → 200 { ok }

PATCH  /api/admin/comments/[id]    { status: "visible"|"hidden" }   → 200 { comment }
DELETE /api/admin/comments/[id]                                     → 200 { ok }
```
Validation mirrors the seed shapes (required fields, slug uniqueness → 409, lengths).
`publishedAt` set on first publish. All bodies validated server-side; 400 on bad input.

### `Lib/admin.ts` (write/query lib, server-only)
```ts
// reads (admin sees unpublished too — distinct from the public Lib/* getters)
listAllPosts(): Promise<Post[]>
listAllCourses(): Promise<Course[]>
listLessonsForCourse(courseId): Promise<Lesson[]>
listAllComments({lessonId?, status?}): Promise<(Comment & {lessonTitle})[]>
// writes
createPost / updatePost / deletePost
createCourse / updateCourse / deleteCourse
createLesson / updateLesson / deleteLesson
setCommentStatus(id, status) / deleteComment(id)
```
Why a separate lib (not `Lib/content.ts`/`Lib/courses.ts`): those filter to
`published=true` for the public pages. Admin must see drafts, so the admin reads are
distinct and live in `Lib/admin.ts`.

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | `ADMIN_EMAILS` env + `isAdminEmail`/`requireAdmin`/`requireAdminApi` | `[OPUS]` | `.env`, `Lib/session.ts` |
| 2 | Extend `middleware.ts` to gate `/admin` + `/api/admin/*` | `[OPUS]` | `middleware.ts` |
| 3 | `Lib/admin.ts` — admin reads + all writes | `[OPUS]` | `Lib/admin.ts` |
| 4 | Posts write API (POST/PATCH/DELETE) | `[OPUS]` | `app/api/admin/posts/...` |
| 5 | Courses + lessons write API | `[OPUS]` | `app/api/admin/courses/...`, `app/api/admin/lessons/...` |
| 6 | Comment moderation API | `[OPUS]` | `app/api/admin/comments/[id]/route.js` |
| 7 | Admin shell layout + nav + 403/empty states | `[OPUS]` | `app/admin/layout.js`, `app/admin/page.js` |
| 8 | Posts admin: list + create/edit form | `[OPUS]` form pattern, then `[SONNET-OK]` | `app/admin/posts/...`, `Components/admin/PostForm.js` |
| 9 | Courses/lessons admin: list + forms | `[SONNET-OK]` (after #8 pattern) | `app/admin/courses/...`, `Components/admin/*` |
| 10 | Comment moderation UI | `[SONNET-OK]` | `app/admin/comments/page.js`, `Components/admin/CommentRow.js` |
| 11 | Add "Admin" link in `UserMenu` (only when `isAdminEmail`) | `[SONNET-OK]` | `Components/platform/UserMenu.js` |

### Critical `[OPUS]` notes
- **Three-layer gate.** Middleware is the wall; the page/route helpers are
  defense-in-depth (a route must never trust that middleware ran). `requireAdminApi`
  returns **401** when logged out, **403** when logged-in-but-not-admin — distinct.
- **`isAdminEmail` parses `ADMIN_EMAILS`** = comma-separated, lowercased, trimmed,
  empty-safe (no env → nobody is admin → `/admin` is effectively closed). Never throw
  on a missing env; just deny.
- **Admin reads see drafts.** Do NOT reuse the public getters (they filter
  `published=true`). `Lib/admin.ts` reads are unfiltered.
- **Slug uniqueness** on create/update posts & courses → catch the unique-violation
  and return **409**, don't 500. Lesson slug is unique *per course* (see
  `COURSES_CODE.md`).
- **First publish stamps `publishedAt`** if it's null and `published` is being set true.
- **Delete cascades** are already enforced by FKs (course→lessons→comments). The API
  just issues the delete; the DB does the rest.
- **The write APIs mutate the same tables the seed upserts** — re-running the seed
  will still upsert by slug, so admin edits to a seeded row get overwritten on a
  re-seed. Acceptable (seed is the dev bootstrap), but note it.

## 4. Sonnet context blocks

> Filled once the `[OPUS]` form pattern (PostForm) exists, so they can point at a
> real template. Deferred until #7–#8 land. (Same discipline as prior sections:
> no Sonnet block ships without a concrete pattern file + verbatim imports + exact
> field names + a DO-NOT list.)

## 5. Verification
- [ ] Logged out → `/admin` redirects to `/login`; `curl /api/admin/posts` → 401.
- [ ] Logged in as a **non-allowlisted** email → `/admin` redirects to `/` (or shows 403); `curl` admin API → 403.
- [ ] Logged in as an **allowlisted** email → `/admin` loads; `UserMenu` shows the "Admin" link.
- [ ] Create a post via the form → appears on `/explore` after publish; draft (unpublished) does NOT appear publicly but DOES in the admin list.
- [ ] Edit → changes reflected; slug collision → 409 surfaced in the form, not a crash.
- [ ] Create a course + add ordered lessons → shows on `/courses` and the detail page.
- [ ] Delete a course → its lessons + comments gone (cascade).
- [ ] Comment moderation: hide a comment → it disappears from the public lesson page (status filter) but remains in the admin list; unhide restores it; delete removes it.
- [ ] `ADMIN_EMAILS` empty → nobody can reach `/admin` (fail closed).
- [ ] `npm run build` + `npm run lint` pass.

## 6. Out of scope (later)
- Rich-text/WYSIWYG editor (plain markdown textarea for now — reuse `MarkdownRenderer` for preview).
- Image uploads (paste a URL for now; S3 is wired for payment but not generalized).
- Audit log / multi-admin roles / per-resource permissions.
- Analytics dashboard (separate parking-lot idea).
