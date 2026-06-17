-- Full-text search index for posts (title + excerpt + tags).
-- drizzle-kit does not generate tsvector/GIN indexes, so this is hand-written.
--
-- to_tsvector() normalizes text into stemmed, lowercased, stop-word-free tokens;
-- GIN (inverted index) maps each token -> rows for fast `@@` matching in searchPosts.
--
-- An index expression must be IMMUTABLE. The 2-arg to_tsvector('english', ...)
-- is only STABLE (the text-search config could change per session), so Postgres
-- rejects it directly. We wrap it in an IMMUTABLE function that pins the config,
-- then index on that. searchPosts() must call the SAME function so its query
-- can use this index.
CREATE OR REPLACE FUNCTION posts_search_doc(
  p_title text,
  p_excerpt text,
  p_tags text[]
) RETURNS tsvector
LANGUAGE sql IMMUTABLE AS $$
  SELECT to_tsvector(
    'english'::regconfig,
    coalesce(p_title, '') || ' ' ||
    coalesce(p_excerpt, '') || ' ' ||
    coalesce(array_to_string(p_tags, ' '), '')
  );
$$;

CREATE INDEX IF NOT EXISTS posts_fts_idx
  ON posts
  USING GIN (posts_search_doc(title, excerpt, tags));
