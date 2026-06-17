import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import { getTopics, getPosts } from "@/Lib/content";
import PostCard from "@/Components/platform/PostCard";
import StaggerGrid from "@/Components/platform/StaggerGrid";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === slug);
  return {
    title: topic ? `${topic.name} — CoreAcademy` : "Topic — CoreAcademy",
    description: topic?.description ?? "",
  };
}

export default async function TopicPage({ params }) {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const posts = await getPosts({ topic: slug });
  const icon = solidIcons[topic.icon] ?? solidIcons.faLayerGroup;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        {/* Topic header */}
        <div className="flex items-start gap-4 mb-10">
          <div
            className={`w-14 h-14 ${topic.accentBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <FontAwesomeIcon icon={icon} className={`${topic.color} text-xl`} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{topic.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">{topic.description}</p>
          </div>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">No content here yet — check back soon.</p>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </StaggerGrid>
        )}
      </div>
    </main>
  );
}
