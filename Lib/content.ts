import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { posts, topics, type Post, type Topic } from "@/drizzle/schema";

export type { Post, Topic };

// All published topics, ordered for display.
export async function getTopics(): Promise<Topic[]> {
  return db
    .select()
    .from(topics)
    .where(eq(topics.published, true))
    .orderBy(topics.order);
}

// Published posts, optionally filtered. Newest first.
export async function getPosts(opts?: {
  topic?: string;
  type?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Post[]> {
  const conditions = [eq(posts.published, true)];
  if (opts?.topic) conditions.push(eq(posts.topicSlug, opts.topic));
  if (opts?.type) conditions.push(eq(posts.type, opts.type));
  if (opts?.featured !== undefined)
    conditions.push(eq(posts.featured, opts.featured));

  const query = db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt));

  if (opts?.limit) return query.limit(opts.limit);
  return query;
}

// A single published post by slug, or null.
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

// Fire-and-forget view counter.
export async function incrementViews(slug: string): Promise<void> {
  await db
    .update(posts)
    .set({ views: sql`${posts.views} + 1` })
    .where(eq(posts.slug, slug));
}

// Full-text search over published posts. Uses the posts_search_doc() IMMUTABLE
// wrapper so the GIN index (posts_fts_idx) is used. Ranked by relevance.
export async function searchPosts(
  query: string,
  limit = 15
): Promise<Post[]> {
  const q = query.trim();
  if (!q) return [];

  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        sql`posts_search_doc(${posts.title}, ${posts.excerpt}, ${posts.tags}) @@ plainto_tsquery('english', ${q})`
      )
    )
    .orderBy(
      desc(
        sql`ts_rank(posts_search_doc(${posts.title}, ${posts.excerpt}, ${posts.tags}), plainto_tsquery('english', ${q}))`
      )
    )
    .limit(limit);
}
