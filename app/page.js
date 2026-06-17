import Link from "next/link";
import { getPosts, getTopics } from "@/Lib/content";
import PostCard from "@/Components/platform/PostCard";
import TopicCard from "@/Components/platform/TopicCard";
import StaggerGrid from "@/Components/platform/StaggerGrid";

export default async function Home() {
  // Trending = featured posts; fall back to latest if fewer than 6 featured.
  let trending = await getPosts({ featured: true, limit: 6 });
  if (trending.length < 6) {
    const latest = await getPosts({ limit: 6 });
    const seen = new Set(trending.map((p) => p.slug));
    for (const p of latest) {
      if (trending.length >= 6) break;
      if (!seen.has(p.slug)) trending.push(p);
    }
  }

  const topics = await getTopics();
  const allPosts = await getPosts();
  const countByTopic = allPosts.reduce((acc, p) => {
    acc[p.topicSlug] = (acc[p.topicSlug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6 tracking-wider uppercase">
          Free for everyone
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Your launchpad
          <br />
          <span className="text-blue-600 dark:text-blue-400">into tech.</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Discover trending articles, tech talks, and courses across every corner of
          development — then get a personalized roadmap built just for you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/explore"
            className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/30"
          >
            Explore Content
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-7 py-3 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-semibold text-sm transition-all"
          >
            Get My Roadmap
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-6xl mx-auto px-6 pb-16 relative z-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending</h2>
          <Link href="/explore" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View all →
          </Link>
        </div>
        {trending.length === 0 ? (
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">Content is on its way — check back soon.</p>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </StaggerGrid>
        )}
      </section>

      {/* Browse topics */}
      <section className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by topic</h2>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              postCount={countByTopic[topic.slug] ?? 0}
            />
          ))}
        </StaggerGrid>
      </section>
    </main>
  );
}
