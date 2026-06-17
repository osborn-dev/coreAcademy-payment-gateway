import { NextResponse } from "next/server";
import { searchPosts, getPostBySlug } from "@/Lib/content";
import { getRecommendations } from "@/Lib/ai";
import { requireUserApi } from "@/Lib/session";

export async function POST(request) {
  try {
    // Defense-in-depth: middleware already gates this route, but the AI search
    // generates a personal roadmap, so require a signed-in user here too.
    const { response } = await requireUserApi();
    if (response) return response; // 401

    const { query, userContext } = await request.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ posts: [], roadmap: "", gaps: [] });
    }

    // Phase 1 — narrow with full-text search (uses the GIN index).
    const candidates = await searchPosts(query, 15);

    // Nothing matched: return empty, no AI call needed.
    if (candidates.length === 0) {
      return NextResponse.json({ posts: [], roadmap: "", gaps: [] });
    }

    // Phase 2 — let the model re-rank + write a roadmap. Compact payload only.
    const compact = candidates.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      type: p.type,
      topicSlug: p.topicSlug,
    }));

    const rec = await getRecommendations(query, compact, userContext);

    // Fallback: if the model output was unparseable, use the FTS ranking as-is.
    const orderedSlugs =
      rec && rec.recommended.length > 0
        ? rec.recommended.slice(0, 6)
        : candidates.slice(0, 6).map((p) => p.slug);

    // Hydrate slugs -> full posts, preserving order, dropping any that vanished.
    const hydrated = await Promise.all(
      orderedSlugs.map((slug) => getPostBySlug(slug))
    );
    const posts = hydrated.filter(Boolean);

    return NextResponse.json({
      posts,
      roadmap: rec?.roadmap ?? "",
      gaps: rec?.gaps ?? [],
    });
  } catch (err) {
    console.error("AI recommend failed:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
