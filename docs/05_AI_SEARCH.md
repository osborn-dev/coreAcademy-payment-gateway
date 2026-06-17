# 05 — AI Search & Roadmaps (Phase 1E)

> Combined brief. See `COREACADEMY_MASTER_PLAN.md` and section 02 (`searchPosts`, `getPostBySlug`). Local-only doc.
> **Every task here is `[OPUS]`** — prompt design, Claude SDK, and JSON parsing are exactly where Sonnet would bloop.

## 1. What we're building

The differentiator: a search that takes a user's query (and optional context about their level/goals) and returns (a) re-ranked relevant content, (b) a personalized **learning roadmap** in Markdown, and (c) any **topic gaps** the platform doesn't cover yet. Two-phase: Postgres full-text search narrows candidates, then Claude re-ranks and writes the roadmap.

## 2. Contracts

### `POST /api/ai/recommend`
Request:
```ts
{ query: string; userContext?: string }
```
Response:
```ts
{
  posts: Post[];        // full rows for the recommended slugs, in priority order
  roadmap: string;      // markdown, 3-5 step personalized path
  gaps: string[];       // topic names not covered by current content
}
```

### Claude call
- Model: `claude-sonnet-4-6`
- Input: query + optional userContext + a compact list of candidate posts (slug, title, excerpt, type, topicSlug only — NOT full bodies, to keep tokens low)
- Output: strict JSON `{ recommended: string[] (slugs, max 6), roadmap: string, gaps: string[] }`
- Server then fetches full `Post` rows for the recommended slugs (preserving order) via `getPostBySlug`.

### Page
- `/search` — Server Component reads `?q=`; renders `SearchBar` + optional context textarea + `SearchResults` (client) which calls the API and shows: skeleton → roadmap card → posts grid → gap pills.

## 3. Tasks (all `[OPUS]`)

| # | Task | Files |
|---|---|---|
| 1 | Install `@anthropic-ai/sdk`; env var | `package.json`, `.env` |
| 2 | Anthropic client singleton | `Lib/anthropic.js` |
| 3 | Recommend API route (FTS → Claude → JSON → hydrate) | `app/api/ai/recommend/route.js` |
| 4 | `SearchBar` component | `Components/platform/SearchBar.js` |
| 5 | `/search` page + `SearchResults` client component | `app/search/page.js`, `Components/platform/SearchResults.js` |

### Task 1
`npm i @anthropic-ai/sdk`. Add `ANTHROPIC_API_KEY` to `.env` (owner provides). Flag: NEW dep + NEW env var.

### Task 2 — `Lib/anthropic.js`
```js
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export default anthropic;
```

### Task 3 — recommend route (the careful part)
```
POST(request):
1. const { query, userContext } = await request.json()
2. if (!query?.trim()) return NextResponse.json({ posts: [], roadmap: "", gaps: [] })
3. const candidates = await searchPosts(query, 15)   // from Lib/content
4. Build a compact array: candidates.map(p => ({ slug, title, excerpt, type, topicSlug }))
5. Call anthropic.messages.create({
     model: "claude-sonnet-4-6",
     max_tokens: 1024,
     system: "<role: CoreAcademy learning guide>",
     messages: [{ role: "user", content: <prompt embedding query, userContext, candidates JSON, and an INSTRUCTION to reply with ONLY valid JSON {recommended, roadmap, gaps}> }],
   })
6. Parse JSON from the text block defensively:
   - extract the first {...} with a regex / find first "{" to last "}"
   - JSON.parse in a try/catch; on failure, fall back to { recommended: candidates.slice(0,6).map(c=>c.slug), roadmap: "", gaps: [] }
7. Hydrate: for each slug in recommended (max 6), getPostBySlug; filter nulls; preserve order
8. return NextResponse.json({ posts, roadmap, gaps })
Wrap everything in try/catch → 500 { error: "Search failed" }.
```
Prompt must explicitly: tell Claude it may only recommend from the provided candidate slugs; ask for a 3–5 step roadmap in Markdown tailored to userContext if present; ask for `gaps` = topics the user seems to want that the candidates don't cover. Emphasize "respond with valid JSON only, no prose, no code fences."

### Task 4 — `SearchBar`
Client component. Controlled input + Lucide `Search` icon. On submit, `router.push('/search?q=' + encodeURIComponent(value))`. Used compact in `PlatformHeader` (optional wire-in) and large on `/search`.

### Task 5 — `/search` + `SearchResults`
`/search` (Server Component): read `searchParams.q` (async), render the big `SearchBar` (prefilled with q), the optional context `<textarea>` (label: "Tell us your experience level & goals — optional"), and `<SearchResults initialQuery={q} />`.
`SearchResults` (client): on mount (and when query present), POST to `/api/ai/recommend` with `{ query, userContext }`. States: skeleton while loading; roadmap rendered with `MarkdownRenderer` inside a highlighted glassmorphism card (`bg-blue-500/10 border-blue-500/20`); `PostCard` grid for `posts`; `gaps` as muted pills labeled "Coming soon". Empty query → render nothing/prompt. Errors → inline error card + retry.

## 4. Sonnet context blocks

None — every task in this section is `[OPUS]`. Do not delegate AI/SDK/JSON-parsing work to Sonnet.

## 5. Verification

- [ ] `npm i @anthropic-ai/sdk` succeeds; `ANTHROPIC_API_KEY` set in `.env`
- [ ] `/search` loads with a large search bar and optional context textarea
- [ ] Submitting a query navigates to `/search?q=...` and triggers one API call
- [ ] Skeleton loader shows while waiting
- [ ] Roadmap card renders Markdown steps via `MarkdownRenderer`
- [ ] Recommended `PostCard`s are relevant and only contain real, published posts
- [ ] Recommended slugs that don't exist are silently dropped (no crash)
- [ ] If Claude returns malformed JSON, the fallback (top FTS results, empty roadmap) renders — no crash
- [ ] Empty/whitespace query fires NO API call and shows the prompt state
- [ ] Adding text in the context textarea visibly changes the roadmap output
- [ ] API errors render an inline error + retry, not a white screen
- [ ] `npm run build` succeeds
