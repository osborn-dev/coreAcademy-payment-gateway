# 08 — Courses, Lessons & Comments (Phase 2, Section 08)

> Combined brief. Built AFTER Section 07 (depends on the `users` table + `requireUserApi`/`useSession`). See `COREACADEMY_MASTER_PLAN.md` and section 02 for the Drizzle/seed patterns. Local-only doc.

## 1. What we're building

A proper course experience: **Course → ordered Lessons**, each lesson with an intro video (YouTube embed), a markdown explanation, owner + release date, a prominent external "Continue on YouTube" button, and a **comments** section (logged-in users, shown immediately). Courses belong to a topic. The old flat `type="course"` post is migrated into the new structure and retired.

User flow: `/courses` (catalog) → click a course → `/courses/[courseSlug]` (detail + lesson list) → click a lesson → `/courses/[courseSlug]/lessons/[lessonSlug]` (video + explanation + external link + comments).

## 2. Contracts

### `courses` row
```ts
{ id, title, slug, excerpt, description (md), topicSlug, coverImage|null,
  introVideoUrl|null, owner, tags[], featured, published, publishedAt|null, createdAt, updatedAt }
```
### `lessons` row
```ts
{ id, courseId, slug (unique per course), title, explanation (md), introVideoUrl|null,
  externalUrl, externalLabel, order, owner, published, releaseDate|null, createdAt, updatedAt }
```
### `comments` row
```ts
{ id, lessonId, userId, authorName, body, status ("visible"|"hidden"), createdAt, updatedAt }
```
### `Lib/courses.ts`
```ts
getCourses({topic?,featured?,limit?}): Promise<Course[]>      // published, newest first
getCourseBySlug(slug): Promise<Course|null>
getLessonsForCourse(courseId): Promise<Lesson[]>             // published, order asc
getCourseWithLessons(slug): Promise<{course,lessons}|null>
getLesson(courseSlug,lessonSlug): Promise<{course,lesson}|null>
getLessonComments(lessonId): Promise<Comment[]>             // status visible, newest first
createComment({lessonId,userId,authorName,body}): Promise<Comment>
```
### API
- `POST /api/lessons/[lessonId]/comments` — `{ body }` → 201 | 400 | 401 (list is server-fetched)

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | Schema: courses, lessons, comments + types | `[OPUS]` | `drizzle/schema.ts` |
| 2 | Generate + apply migration | `[OPUS]` | `drizzle/migrations/*` |
| 3 | `Lib/courses.ts` query lib | `[OPUS]` | `Lib/courses.ts` |
| 4 | Comment POST API (auth + validate) | `[OPUS]` | `app/api/lessons/[lessonId]/comments/route.js` |
| 5 | Lesson page (video + external link + comments) | `[OPUS]` | `app/courses/[courseSlug]/lessons/[lessonSlug]/page.js` |
| 6 | CommentForm (client, useSession, mutation) | `[OPUS]` | `Components/platform/CommentForm.js` |
| 7 | Seed courses+lessons; migrate+delete legacy course post | `[OPUS]` | `data/seed/courses.ts`, `scripts/seed.ts`, `data/seed/posts.ts` |
| 8 | Catalog page | `[SONNET-OK]` | `app/courses/page.js` |
| 9 | Course detail page | `[SONNET-OK]` | `app/courses/[courseSlug]/page.js` |
| 10 | CourseCard | `[SONNET-OK]` | `Components/platform/CourseCard.js` |
| 11 | LessonListItem | `[SONNET-OK]` | `Components/platform/LessonListItem.js` |
| 12 | CommentList | `[SONNET-OK]` | `Components/platform/CommentList.js` |
| 13 | Remove `course` from ContentTypeBadge | `[SONNET-OK]` | `Components/platform/ContentTypeBadge.js` |
| 14 | Remove `course` from explore filter | `[SONNET-OK]` | `app/explore/page.js` |
| 15 | Add `Courses` nav link | `[SONNET-OK]` | `Components/platform/PlatformHeader.js` |

### Critical [OPUS] notes
- **Lesson slug uniqueness is per-course** — composite unique index `(courseId, slug)`, so two courses can both have a `getting-started` lesson. Route is nested under the course.
- **FK ordering:** `comments.userId → users.id` requires Section 07's `users` table to exist before this migration runs.
- **Comment API:** `requireUserApi()` 401 gate; validate body trimmed non-empty and ≤2000 chars → 400; `createComment` with `session.user.id` + `session.user.name`; return 201. Resolve `lessonId` via `await params` (Next 15).
- **Migration of "Fullstack Foundations":** recreate as a course under topic `career`, split its outline into ~4 lessons (each with placeholder `externalUrl`/`introVideoUrl`); delete the legacy post (`db.delete(posts).where(eq(posts.slug,"fullstack-foundations"))`) and remove it from `data/seed/posts.ts`. Seed ≥1 more course so the catalog isn't a single card.
- **Lesson page external link** is gated by the platform login wall (middleware) — the whole `/courses` subtree is already behind login, so no per-page gate needed; comments still require the session check in the API.

## 4. Sonnet context blocks

### SONNET PROMPT — Task 10 (CourseCard)
```
File to create: Components/platform/CourseCard.js  ("use client")
Pattern to copy: Components/platform/PostCard.js (mirror its motion.div hover, glass classes, gradient placeholder)
Imports:
  "use client";
  import Link from "next/link";
  import { motion } from "framer-motion";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faGraduationCap, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

Props: { course, lessonCount }  where course = { slug, title, excerpt, coverImage, owner }.
Render a Link to `/courses/${course.slug}` with the SAME card structure as PostCard:
  - thumbnail area: course.coverImage as <img> if present, else the gradient placeholder with course.title.charAt(0)
  - a small "Course" pill (own pill, NOT ContentTypeBadge): inline-flex, faGraduationCap icon + "Course",
    classes "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 ... rounded-full px-2.5 py-1 text-xs font-semibold", positioned top-3 left-3
  - title (line-clamp-2), excerpt (line-clamp-2)
  - footer row: course.owner + a lesson count "<faLayerGroup/> {lessonCount} lessons" (instead of read time)
Use the exact glass + hover classes from PostCard.

DO NOT: use ContentTypeBadge; fetch data; invent course fields beyond those listed.
```

### SONNET PROMPT — Task 11 (LessonListItem)
```
File to create: Components/platform/LessonListItem.js  (NO "use client" needed)
Imports:
  import Link from "next/link";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";

Props: { courseSlug, lesson, index }  where lesson = { slug, title, introVideoUrl }.
Render a Link to `/courses/${courseSlug}/lessons/${lesson.slug}` as a glass row:
  "flex items-center gap-4 bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
  - left: a number circle showing (index + 1) — "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
  - middle: lesson.title (text-gray-900 dark:text-white font-medium)
  - right: if lesson.introVideoUrl, a small faVideo icon (text-gray-400); else faPlay
DO NOT: add "use client", state, or data fetching; invent fields.
```

### SONNET PROMPT — Task 12 (CommentList)
```
File to create: Components/platform/CommentList.js  (NO "use client" — server-renderable)
Imports:
  // none required beyond React; format date inline with toLocaleDateString
Props: { comments }  array of { id, authorName, body, createdAt }.
Render:
  - if empty: a muted "Be the first to comment." line
  - else a list; each item: an initial-avatar circle (first letter of authorName) like
    "w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold",
    then authorName (font-medium text-gray-900 dark:text-white) + a formatted date (text-gray-500 text-xs),
    then the body (text-gray-700 dark:text-gray-300, whitespace-pre-wrap).
DO NOT: add "use client"; fetch data; add edit/delete controls (moderation comes later in admin).
```

### SONNET PROMPT — Task 13 (ContentTypeBadge edit)
```
File to edit: Components/platform/ContentTypeBadge.js
Remove the `course` entry from typeMap and remove faGraduationCap from the import (no post will be type "course" after migration).
Keep article + video entries and the `?? typeMap.article` fallback unchanged.
```

### SONNET PROMPT — Task 14 (explore filter edit)
```
File to edit: app/explore/page.js
Remove the { value: "course", label: "Courses" } entry from the TYPE_OPTIONS array.
Optionally add, near the FilterBars, a small line: <Link href="/courses" ...>Looking for courses? →</Link>
DO NOT change anything else (the data fetching, grid, empty state stay as-is).
```

### SONNET PROMPT — Task 15 (header nav link)
```
File to edit: Components/platform/PlatformHeader.js
Add a <Link href="/courses"> nav item labeled "Courses" right after the existing "Explore" link,
using the EXACT same className as the Explore link. Nothing else changes.
```

## 5. Verification

**Built + verified (code level):**
- [x] `npm run db:migrate` added courses/lessons/comments (migration `0002_last_tigra.sql`); seed ran
- [x] DB: `posts type='course'` = 0; `courses` = 2 (incl. `fullstack-foundations` w/ ordered lessons); `lessons` = 7
- [x] `npm run lint` clean; `npm run build` → `✓ Compiled successfully` (the only build error is the pre-existing `MONGODB_URI` one from the untouched payment route); all 3 course routes + comment API present in `.next/`

**Pending — manual browser pass (see `PENDING_TESTS.md` §B):**
- [ ] `/explore` Format filter no longer shows "Courses"; `/posts/fullstack-foundations` → 404
- [ ] `/courses` shows polished CourseCards; topic filter via URL works; empty state ok
- [ ] `/courses/fullstack-foundations`: hero, description md, owner, lesson count, ordered list; bad slug → 404
- [ ] Lesson page: intro embed plays, explanation md, owner + release date, external button opens new tab
- [ ] Two courses can share a lesson slug (per-course uniqueness) without collision
- [ ] Comment logged out: form shows "Log in"; `curl POST` → 401; existing comments still render
- [ ] Comment logged in: posts, appears immediately (router.refresh), correct name + timestamp; empty/oversized → 400
- [ ] Cascade: delete lesson → its comments gone; delete course → its lessons + comments gone

> The full as-built code walkthrough lives in `COURSES_CODE.md`.
