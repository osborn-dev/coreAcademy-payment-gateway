import Link from "next/link";
import { getPosts, getTopics } from "@/Lib/content";
import PostCard from "@/Components/platform/PostCard";
import FilterBar from "@/Components/platform/FilterBar";
import StaggerGrid from "@/Components/platform/StaggerGrid";

export const metadata = {
  title: "Explore — CoreAcademy",
  description: "Browse trending articles, videos, and courses across every corner of tech.",
};

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "article", label: "Articles" },
  { value: "video", label: "Videos" },
];

export default async function ExplorePage({ searchParams }) {
  const sp = await searchParams;
  const type = sp?.type ?? "";
  const topic = sp?.topic ?? "";

  const topics = await getTopics();
  const posts = await getPosts({
    type: type || undefined,
    topic: topic || undefined,
  });

  const topicOptions = [
    { value: "", label: "All" },
    ...topics.map((t) => ({ value: t.slug, label: t.name })),
  ];

  const current = {};
  if (type) current.type = type;
  if (topic) current.topic = topic;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Everything on CoreAcademy — filter by format or topic.
        </p>

        <FilterBar
          label="Format"
          paramKey="type"
          options={TYPE_OPTIONS}
          current={current}
          basePath="/explore"
        />
        <FilterBar
          label="Topic"
          paramKey="topic"
          options={topicOptions}
          current={current}
          basePath="/explore"
        />

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Looking for guided courses?{" "}
          <Link href="/courses" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Browse all courses →
          </Link>
        </p>

        {posts.length === 0 ? (
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center mt-4">
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">No content matches these filters.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-5">Try clearing them to see everything.</p>
            <Link
              href="/explore"
              className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </StaggerGrid>
        )}
      </div>
    </main>
  );
}
