# 03 — Content Pages (Phase 1C)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` and `02_DATABASE_DATA_LAYER.md` (Contracts). Local-only doc.

## 1. What we're building

The reusable content UI and the two reading surfaces: a **topic page** (`/topics/[slug]`) listing posts in a topic, and a **post detail page** (`/posts/[slug]`) that renders Markdown. The centerpiece is `PostCard` — the most-reused component on the platform — built first as the family pattern, then the smaller `TopicCard` and `ContentTypeBadge` follow it.

Depends on section 02 contracts (`getPosts`, `getPostBySlug`, `getTopics`, `incrementViews`, `Post`/`Topic` shapes).

## 2. Contracts

Component props (the stable surface other sections import):

```ts
<PostCard post={Post} size?={"default" | "compact"} />
<TopicCard topic={Topic} postCount?={number} />
<ContentTypeBadge type={"article" | "video" | "course"} />
<MarkdownRenderer content={string} />   // client component, renders markdown string
```

Pages:
- `/topics/[slug]` — Server Component; `getTopics()` to resolve the topic, `getPosts({ topic: slug })` for its posts; `notFound()` if topic missing.
- `/posts/[slug]` — Server Component; `getPostBySlug(slug)`; `notFound()` if null; renders body via `MarkdownRenderer`; fires `incrementViews` (section 06 makes it fire-and-forget client-side).

API:
- `POST /api/posts/[slug]/view` → `{ ok: true }`; calls `incrementViews(slug)`.

## 3. Tasks

| # | Task | Tier | Files |
|---|---|---|---|
| 1 | `PostCard` (first of family) | `[OPUS]` | `Components/platform/PostCard.js` |
| 2 | `ContentTypeBadge` | `[SONNET-OK]` | `Components/platform/ContentTypeBadge.js` |
| 3 | `TopicCard` | `[SONNET-OK]` | `Components/platform/TopicCard.js` |
| 4 | Install `react-markdown`; build `MarkdownRenderer` | `[OPUS]` | `package.json`, `Components/platform/MarkdownRenderer.js` |
| 5 | Topic page | `[OPUS]` | `app/topics/[slug]/page.js` |
| 6 | Post detail page | `[OPUS]` | `app/posts/[slug]/page.js` |
| 7 | View-count API route | `[SONNET-OK]` | `app/api/posts/[slug]/view/route.js` |

### Task 1 `[OPUS]` — `PostCard`
Client component (`"use client"`, uses Framer Motion `whileHover`). Renders thumbnail (or a gradient placeholder when `thumbnail` is null), `ContentTypeBadge`, title, excerpt, author, readTime. Wraps in a `next/link` to `/posts/${post.slug}`. Glassmorphism card: `bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md`, hover lift `whileHover={{ y: -4 }}` + `hover:bg-white/[0.08]`. `size="compact"` = smaller padding, hidden excerpt (for sidebars). This sets the visual + motion pattern for all cards → `[OPUS]`.

### Task 4 `[OPUS]` — `MarkdownRenderer`
`npm i react-markdown`. Client component wrapping `<ReactMarkdown>`. Tailwind v4 has no typography plugin, so style elements via the `components` prop (h1/h2/h3, p, ul/ol, code, pre, blockquote, a) with dark-theme classes (`text-gray-200`, `text-blue-400` links, `bg-gray-800` code). `[OPUS]` because the component map is fiddly and reused on every article.

### Task 5 `[OPUS]` — topic page
```
export async function generateMetadata({ params }) → title/description from topic
export default async function TopicPage({ params }) {
  const { slug } = await params;            // Next 15: params is a Promise
  const topics = await getTopics();
  const topic = topics.find(t => t.slug === slug);
  if (!topic) notFound();
  const posts = await getPosts({ topic: slug });
  // header (icon in topic.color, name, description) + grid of <PostCard>
}
```
Note Next.js 15 `params`/`searchParams` are async — must `await`.

### Task 6 `[OPUS]` — post detail page
`getPostBySlug`, `notFound()` if null. Layout: hero (thumbnail/gradient), meta row (`ContentTypeBadge`, readTime, publishedAt, topic link), title, `MarkdownRenderer` for body, and if `type==="video"` embed `videoUrl`. Sidebar "More from this topic" = `getPosts({ topic: post.topicSlug, limit: 3 })` minus current. Serialize Drizzle rows are plain objects already (no Mongoose `.lean()` needed) but `Date` fields must be stringified before passing to client components.

## 4. Sonnet context blocks

### SONNET PROMPT — Task 2 (`ContentTypeBadge`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/Components/platform/ContentTypeBadge.js
Pattern: a small presentational badge. NO "use client" needed (no hooks/state).

Imports (verbatim, add nothing else):
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faNewspaper, faVideo, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

Props: { type } where type is exactly one of "article" | "video" | "course".
Render a small pill: <span> with icon + capitalized label.
Color map (use EXACTLY these Tailwind classes):
  article: "text-blue-400 bg-blue-500/10"   icon: faNewspaper
  video:   "text-amber-400 bg-amber-500/10" icon: faVideo
  course:  "text-emerald-400 bg-emerald-500/10" icon: faGraduationCap
Base classes for the pill: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"

DO NOT:
- Add "use client", state, or effects
- Invent other type values or colors
- Fetch data or import anything beyond the two lines above
```

### SONNET PROMPT — Task 3 (`TopicCard`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/Components/platform/TopicCard.js
Pattern to copy structure from: /Users/osborn/coreacademy/coreAcademy-payment-gateway/Components/platform/PostCard.js
  (mirror its glassmorphism card classes and the next/link wrapper; this card is simpler — no thumbnail)

Imports (verbatim):
  import Link from "next/link";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import * as solidIcons from "@fortawesome/free-solid-svg-icons";

Props: { topic, postCount } where topic is the Topic shape:
  { id, name, slug, description, icon, color, accentBg, order, published }
  topic.icon is a FontAwesome solid icon NAME string like "faServer" — resolve it with solidIcons[topic.icon].
Render: a Link to `/topics/${topic.slug}` containing a card with:
  - icon circle using topic.accentBg as background and FontAwesomeIcon colored with topic.color
  - topic.name (bold, white), topic.description (text-gray-400, small)
  - if postCount is provided, show "{postCount} resources" in text-gray-500 text-xs
Card classes: "block bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 hover:bg-white/[0.08] transition-colors"

DO NOT:
- Add Framer Motion (keep it simple/static)
- Invent topic fields not listed
- Hardcode icon/color — always read from the topic object
- Fetch data
```

### SONNET PROMPT — Task 7 (`/api/posts/[slug]/view`)
```
File to create: /Users/osborn/coreacademy/coreAcademy-payment-gateway/app/api/posts/[slug]/view/route.js

Imports (verbatim, add nothing else):
  import { NextResponse } from "next/server";
  import { incrementViews } from "@/Lib/content";

Behavior: export an async POST(request, { params }) — note params is a Promise in Next 15:
  const { slug } = await params;
  await incrementViews(slug);
  return NextResponse.json({ ok: true });
Wrap in try/catch → on error NextResponse.json({ ok: false }, { status: 500 }).

incrementViews signature is EXACTLY: incrementViews(slug: string): Promise<void>

DO NOT:
- Query the database directly — only call incrementViews(slug)
- Add GET or other handlers
- Read a request body (the slug comes from the route param)
```

## 5. Verification

- [ ] `/topics/frontend` renders topic header + `PostCard` grid of that topic's posts
- [ ] `/topics/does-not-exist` returns the Next.js 404 page
- [ ] `PostCard` renders correctly for article, video, and course — each shows the right badge color
- [ ] `PostCard` with null thumbnail shows the gradient placeholder (no broken image)
- [ ] Hover on a `PostCard` lifts it (Framer Motion) without layout shift
- [ ] `/posts/[real-slug]` renders title, meta row, and Markdown body (headings, code, links styled for dark theme)
- [ ] A `type: "video"` post embeds its `videoUrl`
- [ ] "More from this topic" sidebar shows up to 3 other posts, excluding the current
- [ ] `POST /api/posts/[slug]/view` increments `views` in Postgres
- [ ] `npm run build` succeeds
