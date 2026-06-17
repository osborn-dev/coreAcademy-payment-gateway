"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import ContentTypeBadge from "./ContentTypeBadge";

// The most-reused card on the platform. Renders an article/video/course as a
// glassmorphism card linking to /posts/[slug]. This is the family pattern that
// TopicCard and other cards copy. size="compact" hides the excerpt for sidebars.
export default function PostCard({ post, size = "default" }) {
  const compact = size === "compact";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link
        href={`/posts/${post.slug}`}
        className="group block h-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-md overflow-hidden hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
      >
        {/* Thumbnail or gradient placeholder */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {post.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-gray-200 dark:to-gray-900 flex items-center justify-center">
              <span className="text-gray-500/40 dark:text-white/30 text-3xl font-bold tracking-tight">
                {post.title?.charAt(0) ?? "C"}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <ContentTypeBadge type={post.type} />
          </div>
        </div>

        {/* Body */}
        <div className={compact ? "p-4" : "p-5"}>
          <h3 className="text-gray-900 dark:text-white font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {!compact && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-500">
            <span>{post.author}</span>
            {post.readTime ? (
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-[0.65rem]" />
                {post.readTime} min
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
