import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";

// A single row in a course's lesson list. Server-renderable. Links into the
// nested lesson route. Shows a 1-based ordinal and a video/play indicator.
export default function LessonListItem({ courseSlug, lesson, index }) {
  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
      className="flex items-center gap-4 bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
    >
      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {index + 1}
      </span>
      <span className="flex-1 min-w-0 text-gray-900 dark:text-white font-medium truncate">
        {lesson.title}
      </span>
      <FontAwesomeIcon
        icon={lesson.introVideoUrl ? faVideo : faPlay}
        className="text-gray-400 dark:text-gray-500 shrink-0"
      />
    </Link>
  );
}
