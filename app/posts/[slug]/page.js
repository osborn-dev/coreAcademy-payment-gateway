import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPostBySlug, getPosts, getTopics } from "@/Lib/content";
import ContentTypeBadge from "@/Components/platform/ContentTypeBadge";
import MarkdownRenderer from "@/Components/platform/MarkdownRenderer";
import PostCard from "@/Components/platform/PostCard";
import ViewTracker from "@/Components/platform/ViewTracker";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? `${post.title} — CoreAcademy` : "Post — CoreAcademy",
    description: post?.excerpt ?? "",
  };
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === post.topicSlug);

  const related = (await getPosts({ topic: post.topicSlug, limit: 4 })).filter(
    (p) => p.slug !== post.slug
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <ViewTracker slug={post.slug} />
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* Main column */}
        <article className="min-w-0">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Back to Explore
          </Link>

          {/* Hero */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6">
            {post.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-gray-900" />
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <ContentTypeBadge type={post.type} />
            {post.readTime ? (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-xs" />
                {post.readTime} min read
              </span>
            ) : null}
            {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
            {topic ? (
              <Link href={`/topics/${topic.slug}`} className={`${topic.color} hover:underline`}>
                {topic.name}
              </Link>
            ) : null}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Video embed for video posts */}
          {post.type === "video" && post.videoUrl ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/10">
              <iframe
                src={post.videoUrl}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : null}

          <MarkdownRenderer content={post.body} />
        </article>

        {/* Sidebar */}
        {related.length > 0 ? (
          <aside className="min-w-0">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              More from this topic
            </h2>
            <div className="space-y-4">
              {related.slice(0, 3).map((p) => (
                <PostCard key={p.slug} post={p} size="compact" />
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
