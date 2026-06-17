# Courses, Lessons & Comments — Code Reference (Section 08, as built)

> As-built reference for the code that shipped in Section 08. Complements the
> *plan* in `08_COURSES.md`. Local-only doc.
>
> **Status:** built + verified at schema / type / lint / build / DB-seed level.
> One pending test remains (live browser comment round-trip) — see
> `PENDING_TESTS.md`.

## TL;DR

A course experience layered on the existing Postgres/Drizzle content stack:

```
/courses                                      catalog (topic filter)
/courses/[courseSlug]                         detail: hero + markdown + lesson list
/courses/[courseSlug]/lessons/[lessonSlug]    lesson: video + explanation + external link + comments
```

Data model: **Course → ordered Lessons → per-lesson Comments**. A course belongs
to one topic (denormalized `topicSlug`, exactly like `posts`). Lessons link out to
an external resource (YouTube etc.). Comments require a logged-in user and appear
immediately. The whole `/courses` subtree is behind the Section 07 login wall.

The legacy `type="course"` post ("Fullstack Foundations") was migrated into the new
tables and retired; `course` was removed as a post type from the UI.

## File map

| File | Role | Tier |
|---|---|---|
| `drizzle/schema.ts` | `courses`, `lessons`, `comments` tables + `Course`/`Lesson`/`Comment` types | `[OPUS]` |
| `drizzle/migrations/0002_last_tigra.sql` | Additive migration (3 tables, FKs, indexes) | `[OPUS]` |
| `Lib/courses.ts` | All read queries + `createComment` | `[OPUS]` |
| `app/api/lessons/[lessonId]/comments/route.js` | POST comment (auth + validate) | `[OPUS]` |
| `app/courses/page.js` | Catalog page | `[SONNET-OK]`→built by Opus |
| `app/courses/[courseSlug]/page.js` | Course detail page | `[SONNET-OK]`→built by Opus |
| `app/courses/[courseSlug]/lessons/[lessonSlug]/page.js` | Lesson page | `[OPUS]` |
| `Components/platform/CourseCard.js` | Catalog card | `[SONNET-OK]` |
| `Components/platform/LessonListItem.js` | Lesson row on detail page | `[SONNET-OK]` |
| `Components/platform/CommentList.js` | Server-rendered comment list | `[SONNET-OK]` |
| `Components/platform/CommentForm.js` | Client composer (useSession + mutation) | `[OPUS]` |
| `data/seed/courses.ts` | Course + lesson seed data | owner-editable |
| `scripts/seed.ts` | Extended: seeds courses/lessons, deletes legacy post | `[OPUS]` |
| `data/seed/posts.ts` | Edited: legacy course-post removed | — |
| `Components/platform/ContentTypeBadge.js` | Edited: `course` entry removed | `[SONNET-OK]` |
| `app/explore/page.js` | Edited: `course` filter removed + "Browse courses →" link | `[SONNET-OK]` |
| `Components/platform/PlatformHeader.js` | Edited: "Courses" nav link added | `[SONNET-OK]` |

## Schema (`drizzle/schema.ts`)

Three tables appended after the auth block.

### `courses`
- `id` serial PK, `title`, `slug`, `excerpt`, `description` (text, markdown)
- `topicSlug` (denormalized — no FK join on the read path, mirrors `posts`)
- `coverImage` / `introVideoUrl` (nullable)
- `owner` (default `"CoreAcademy"`), `tags` (text[]), `featured`, `published`, `publishedAt`, `createdAt`, `updatedAt`
- Indexes: **unique** `courses_slug_idx(slug)`; `courses_topic_published_idx(topicSlug, published, publishedAt)`

### `lessons`
- `id` serial PK, `courseId` → `courses.id` **ON DELETE CASCADE**
- `slug`, `title`, `explanation` (text, markdown), `introVideoUrl` (nullable)
- `externalUrl` (notNull — the "Continue" link), `externalLabel` (default `"Continue on YouTube"`)
- `order` (int, set from array index at seed time), `owner`, `published` (default **true**), `releaseDate` (nullable), timestamps
- Indexes: **unique** `lessons_course_slug_idx(courseId, slug)` ← *slug is unique PER COURSE, not globally*; `lessons_course_order_idx(courseId, order)`

### `comments`
- `id` serial PK, `lessonId` → `lessons.id` CASCADE, `userId` → `users.id` CASCADE
- `authorName` (snapshot — the thread reads correctly even if the user later renames)
- `body` (text), `status` (default `"visible"` — pre-baked for admin moderation: `"visible" | "hidden"`), timestamps
- Index: `comments_lesson_created_idx(lessonId, createdAt)`

**Cascade chain:** delete a course → its lessons go → their comments go. Delete a
user → their comments go.

**Migration ordering note:** `comments.userId` FKs `users.id`, so Section 07's
migration (0001) had to land before this one (0002). It did.

## `Lib/courses.ts`

Mirrors `Lib/content.ts` style (conditions array + `and(...)`). Exports the three
types and:

```ts
getCourses({topic?, featured?, limit?})  // published, newest first (desc publishedAt)
getCourseBySlug(slug)                    // published only, or null
getLessonsForCourse(courseId)            // published, order asc
getCourseWithLessons(slug)               // { course, lessons } or null
getLesson(courseSlug, lessonSlug)        // resolves lesson against the course's id; { course, lesson } or null
getLessonComments(lessonId)              // status="visible", newest first
createComment({lessonId, userId, authorName, body})  // insert + .returning()[0]
```

`getLesson` is the important one: because lesson slugs are unique *per course*, it
first resolves the course by slug, then looks the lesson up by `(courseId, slug)`.
Two courses can both have a `getting-started` lesson with no collision.

## Comment API — `app/api/lessons/[lessonId]/comments/route.js`

POST only (the list is server-fetched on the lesson page; there is no GET).

1. `requireUserApi()` → returns the 401 response if logged out (defense-in-depth; the
   middleware login wall also covers `/api/*`).
2. `lessonId` resolved via `await params` (Next 15) and coerced to a positive integer → 400 if not.
3. Body parsed; `body` trimmed, must be non-empty and ≤ **2000** chars → 400 otherwise.
4. `createComment` with `user.id` + `user.name || user.email || "User"` as the snapshot name.
5. Returns `{ comment }` 201, or 500 on insert failure.

## Pages

- **Catalog** (`/courses`) — copies `app/explore/page.js`: topic `FilterBar` + `StaggerGrid` of `CourseCard`. Lesson counts are computed per course via `Promise.all` (small, curated N). Empty state when a topic filter matches nothing.
- **Detail** (`/courses/[courseSlug]`) — `getCourseWithLessons` → `notFound()` on miss. Hero is the intro video if present, else cover image / gradient. Renders `description` markdown, an owner/lesson-count/topic meta row, and the ordered `LessonListItem` list.
- **Lesson** (`/courses/[courseSlug]/lessons/[lessonSlug]`) `[OPUS]` — `getLesson` → `notFound()`. Breadcrumb (Courses / course title) → title → owner + release-date meta → intro video iframe (if any) → explanation markdown → external **"Continue"** button (`target="_blank" rel="noopener noreferrer"`) → Discussion section: `CommentForm` (client) above a server-rendered `CommentList`. Comments are fetched server-side with `getLessonComments`; posting triggers `router.refresh()` to re-render the server list.

## Components

- **CourseCard** (client) — mirrors `PostCard`'s `motion.div` hover + glass classes; links `/courses/[slug]`; own emerald "Course" pill (not `ContentTypeBadge`); shows `owner` + lesson count instead of read time.
- **LessonListItem** (server) — numbered circle (1-based) + title + a `faVideo`/`faPlay` indicator; links into the nested lesson route.
- **CommentList** (server) — initial-avatar + author + formatted date + `whitespace-pre-wrap` body; "Be the first to comment." empty state.
- **CommentForm** (client) — `useSession()`: loading → pulse; logged-out → "Log in" prompt linking `/login?callbackUrl=<lesson path>`; logged-in → textarea (maxLength 2000 + counter) → POST → `router.refresh()` on success, inline error otherwise.

## Seed + legacy migration

`scripts/seed.ts` now, after posts:
1. `db.delete(posts).where(eq(posts.slug, "fullstack-foundations"))` — retires the legacy course-as-post.
2. Upserts each course (`onConflictDoUpdate` by `courses.slug`, `createdAt` excluded so re-seeds keep the original date).
3. Upserts each lesson (`onConflictDoUpdate` by composite `[lessons.courseId, lessons.slug]`, `order` = array index).

`data/seed/courses.ts` holds two seeded courses:
- **`fullstack-foundations`** (topic `career`) — the migrated course, split into 4 lessons (frontend-basics → the-backend → auth → deploy).
- **`practical-sql`** (topic `backend`) — a second course (3 lessons) so the catalog isn't a single card.

Lesson `externalUrl`s are placeholder YouTube search links for now — swap for real
video/resource URLs as content is produced.

Verified DB state after seed: `posts type='course'` = **0**, `courses` = **2**, `lessons` = **7**.

## Edits to existing files

- **ContentTypeBadge** — removed the `course` entry + the now-unused `faGraduationCap` import. `article`/`video` + the `?? typeMap.article` fallback unchanged.
- **explore page** — removed `{value:"course"}` from `TYPE_OPTIONS`; added a "Looking for guided courses? Browse all courses →" link below the filters.
- **PlatformHeader** — added a `/courses` "Courses" nav link right after "Explore", same classes.

## How to extend

- **Add a course/lesson:** edit `data/seed/courses.ts`, re-run `npx tsx --env-file=.env scripts/seed.ts`. Upsert-by-slug means it's safe to re-run.
- **Add lesson progress later:** add a `lesson_progress(userId, lessonId, completedAt)` table; the schema was kept friendly to this (no progress coupling exists today).
- **Moderate comments:** the `comments.status` column already exists (`"visible"|"hidden"`); `getLessonComments` filters to `visible`. The admin dashboard (next section) flips status instead of deleting.

## Gotchas

- **Lesson slug uniqueness is per-course**, not global. Always resolve a lesson through its parent course (`getLesson` does this). Don't add a global unique index on `lessons.slug`.
- **No GET comments route** — the list is server-rendered; the client only POSTs and then `router.refresh()`es. Don't build a client fetch for the list.
- **External links are user-supplied content destinations** — they open in a new tab with `rel="noopener noreferrer"`. Keep that on any new outbound link.
- **The build's `MONGODB_URI` error is pre-existing and unrelated** — it comes from the untouched `/api/payment-success` route with an empty `MONGO_URI`. `✓ Compiled successfully` is the signal that platform code built.
