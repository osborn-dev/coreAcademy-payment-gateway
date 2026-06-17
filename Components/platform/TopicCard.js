import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";

export default function TopicCard({ topic, postCount }) {
  const icon = solidIcons[topic.icon] ?? solidIcons.faLayerGroup;

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="block bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-md p-5 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
    >
      {/* Icon circle — accentBg/color are Tailwind class strings, so they go in className, not style */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${topic.accentBg}`}>
        <FontAwesomeIcon icon={icon} className={`w-5 h-5 ${topic.color}`} />
      </div>

      {/* Name + description */}
      <p className="text-gray-900 dark:text-white font-bold leading-snug">{topic.name}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">{topic.description}</p>

      {/* Resource count */}
      {postCount !== undefined && (
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">{postCount} resources</p>
      )}
    </Link>
  );
}
