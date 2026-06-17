# 02 — Database & Data Layer (Phase 1B)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` for tiering rules, verified facts, design system. Local-only doc.

## 1. What we're building

The Postgres + Drizzle content layer that everything else reads from: two tables (`topics`, `posts`), a hot-reload-safe Drizzle client, a migration, a re-runnable seed script, and two read API routes. MongoDB/Mongoose payment code is **not touched** — this is a second, separate database.

## 2. Contracts

These are the data shapes every later section depends on. **Stable surface — changing a column means updating consumers in sections 03–05.**

### `topics` row
```ts
{
  id: number;            // serial PK
  name: string;          // "Frontend Development"
  slug: string;          // "frontend" (unique)
  description: string;
  icon: string;          // FontAwesome solid icon name, e.g. "faPaintbrush"
  color: string;         // Tailwind text class, e.g. "text-blue-400"
  accentBg: string;      // Tailwind bg class, e.g. "bg-blue-500/10"
  order: number;         // display order
  published: boolean;
}
```

### `posts` row
```ts
{
  id: number;            // serial PK
  title: string;
  slug: string;          // unique
  excerpt: string;       // <= 300 chars
  body: string;          // Markdown
  type: "article" | "video" | "course";
  topicSlug: string;     // references topics.slug (denormalized string)
  tags: string[];        // text[]
  thumbnail: string | null;
  videoUrl: string | null;
  author: string;        // default "CoreAcademy"
  featured: boolean;     // default false
  published: boolean;    // default false
  publishedAt: Date | null;
  readTime: number | null; // minutes
  views: number;         // default 0
  createdAt: Date;
  updatedAt: Date;
}
```

### Data-fetching functions (used by API routes + Server Components)
```ts
getTopics(): Promise<Topic[]>                          // published, ordered by `order`
getPosts(opts?: { topic?: string; type?: string; featured?: boolean; limit?: number }): Promise<Post[]>
getPostBySlug(slug: string): Promise<Post | null>      // published only
incrementViews(slug: string): Promise<void>
searchPosts(query: string, limit?: number): Promise<Post[]>  // full-text; used in section 05
```

### API routes
- `GET /api/topics` → `Topic[]`
- `GET /api/posts?topic=&type=&featured=&limit=` → `Post[]`

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | Install Drizzle stack + flag env var | `[OPUS]` | `package.json`, `.env` (owner adds value) |
| 2 | Drizzle schema (`topics`, `posts`) + full-text index | `[OPUS]` | `drizzle/schema.ts` |
| 3 | Drizzle client singleton (hot-reload safe) | `[OPUS]` | `drizzle/db.ts` |
| 4 | drizzle-kit config | `[OPUS]` | `drizzle.config.ts` |
| 5 | Generate + apply migration | `[OPUS]` | `drizzle/migrations/*` |
| 6 | Query helpers (`getTopics`, `getPosts`, etc.) | `[OPUS]` | `Lib/content.ts` |
| 7 | Seed-data scaffolds (shape; owner fills content) | `[SONNET-OK]` | `data/seed/topics.ts`, `data/seed/posts.ts` |
| 8 | Seed runner (upsert by slug) | `[OPUS]` | `scripts/seed.ts` |
| 9 | `GET /api/topics` | `[SONNET-OK]` | `app/api/topics/route.js` |
| 10 | `GET /api/posts` with filters | `[SONNET-OK]` | `app/api/posts/route.js` |

### Task 1 `[OPUS]`
```
npm i drizzle-orm postgres
npm i -D drizzle-kit
```
Add to `.env`: `DATABASE_URL=postgres://...` (owner provides a Neon/Supabase/local Postgres URL). Flag clearly: this is a NEW dependency set and a NEW env var.

### Task 2 `[OPUS]` — schema
Use `drizzle-orm/pg-core`. `serial` PKs, `text`/`varchar`, `boolean`, `timestamp`, `integer`, and `text("tags").array()` for tags. Add indexes: unique on both `slug` columns, composite `(topicSlug, published, publishedAt)`, `(featured, published)`, and a **GIN full-text index** on `to_tsvector('english', title || ' ' || excerpt)` — write this as raw SQL in the migration since drizzle-kit won't generate `tsvector` indexes automatically. This SQL-touching work is why it's `[OPUS]`.

### Task 3 `[OPUS]` — client singleton
Mirror the global-cache idea from `Config/DataBase.js`. Example shape:
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { client?: ReturnType<typeof postgres> };
const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!, { max: 1 });
if (process.env.NODE_ENV !== "production") globalForDb.client = client;
export const db = drizzle(client, { schema });
```

### Task 6 `[OPUS]` — `Lib/content.ts`
Implement all contract functions using `db` from `drizzle/db.ts`. `getPosts` builds a `where` from optional filters (default `published = true`, order by `publishedAt desc`). `searchPosts` uses the `tsvector` index via raw SQL `sql\`to_tsvector(...) @@ plainto_tsquery(...)\``. `incrementViews` does `update posts set views = views + 1 where slug = ?`. This is the read surface every page uses → `[OPUS]`.

### Task 8 `[OPUS]` — seed runner
`scripts/seed.ts` run with `npx tsx scripts/seed.ts`. Loads `.env`, imports `db`, and for each topic/post does an **upsert by slug** (`insert ... onConflictDoUpdate({ target: slug, set: {...} })`) so re-running updates rather than duplicates, and **does not reset `views`** (exclude `views` from the update set). Compute `readTime` from body word count on insert.

## 4. Sonnet context blocks

### SONNET PROMPT — Task 7 (seed-data scaffolds)
```
Files to create:
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/data/seed/topics.ts
  /Users/osborn/coreacademy/coreAcademy-payment-gateway/data/seed/posts.ts

Goal: export typed arrays of seed objects matching the EXACT shapes below. Fill 4 topics and 4 sample posts as placeholders (the owner will replace content later). Use REAL FontAwesome solid icon names and REAL Tailwind classes.

topics.ts — export const topics = [...] where each item is EXACTLY:
  { name: string, slug: string, description: string, icon: string, color: string, accentBg: string, order: number, published: boolean }
  Use these 4: frontend, backend, devops, career.
  icon examples (must be real @fortawesome/free-solid-svg-icons names): "faPaintbrush", "faServer", "faGears", "faBriefcase"
  color/accentBg examples: "text-blue-400"/"bg-blue-500/10", "text-emerald-400"/"bg-emerald-500/10", "text-amber-400"/"bg-amber-500/10", "text-indigo-400"/"bg-indigo-500/10"

posts.ts — export const posts = [...] where each item is EXACTLY:
  { title, slug, excerpt, body, type, topicSlug, tags, thumbnail, videoUrl, author, featured, published, publishedAt }
  - type is one of: "article" | "video" | "course"
  - topicSlug must be one of the 4 topic slugs above
  - body is a markdown string (a few short paragraphs of placeholder is fine)
  - tags is a string array
  - thumbnail/videoUrl: null is fine (videoUrl null unless type==="video")
  - author: "CoreAcademy"
  - publishedAt: an ISO string like "2026-01-15"
  Make at least one post featured:true, and include at least one of each type.

DO NOT:
- Invent fields not listed above
- Add id, views, readTime, createdAt, updatedAt (the seed script handles those)
- Import drizzle or hit the database (these are plain data files)
- Use a topicSlug that isn't in the topics list
```

### SONNET PROMPT — Task 9 (`/api/topics`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/api/topics/route.js

Imports (verbatim, add nothing else):
  import { NextResponse } from "next/server";
  import { getTopics } from "@/Lib/content";

Behavior: export an async GET() that calls getTopics() and returns NextResponse.json(topics).
Wrap in try/catch; on error return NextResponse.json({ error: "Failed to load topics" }, { status: 500 }).

DO NOT:
- Query the database directly here — only call getTopics()
- Add POST/PUT/DELETE handlers
- Add auth, caching headers, or any other logic
```

### SONNET PROMPT — Task 10 (`/api/posts`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/api/posts/route.js

Imports (verbatim, add nothing else):
  import { NextResponse } from "next/server";
  import { getPosts } from "@/Lib/content";

Behavior: export an async GET(request) that reads query params from request.nextUrl.searchParams:
  - topic (string | null)
  - type (string | null)
  - featured ("true" => boolean true, else undefined)
  - limit (parseInt, or undefined)
Call getPosts({ topic, type, featured, limit }) — only pass the ones that are present.
Return NextResponse.json(posts). try/catch → 500 with { error: "Failed to load posts" }.

The getPosts signature is EXACTLY:
  getPosts(opts?: { topic?: string; type?: string; featured?: boolean; limit?: number }): Promise<Post[]>

DO NOT:
- Query the database directly — only call getPosts()
- Invent extra query params
- Add mutation handlers or auth
```

## 5. Verification

- [ ] `npm i` of the new deps succeeds; `DATABASE_URL` set in `.env`
- [ ] `npx drizzle-kit generate` produces a migration; `npx drizzle-kit migrate` applies it cleanly
- [ ] `npx tsx scripts/seed.ts` inserts topics + posts with no error
- [ ] Run the seed a SECOND time → no duplicate rows; a `views` value manually bumped beforehand is NOT reset
- [ ] `GET /api/topics` returns the seeded topics ordered by `order`
- [ ] `GET /api/posts` returns only `published` posts
- [ ] `GET /api/posts?topic=frontend` returns only frontend posts
- [ ] `GET /api/posts?type=video&featured=true&limit=2` respects all three
- [ ] MongoDB/payment flow at `/payment` still works (dual-DB isolation holds)
- [ ] `npm run build` succeeds
