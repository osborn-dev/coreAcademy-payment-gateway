"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

// Course catalog card. Mirrors PostCard's glass + hover, but links to
// /courses/[slug], carries its own "Course" pill, and shows a lesson count
// instead of a read time.
export default function CourseCard({ course, lessonCount }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link
        href={`/courses/${course.slug}`}
        className="group block h-full bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl backdrop-blur-md overflow-hidden hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
      >
        {/* Thumbnail or gradient placeholder */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {course.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 via-blue-600/20 to-gray-200 dark:to-gray-900 flex items-center justify-center">
              <span className="text-gray-500/40 dark:text-white/30 text-3xl font-bold tracking-tight">
                {course.title?.charAt(0) ?? "C"}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1 text-xs font-semibold">
              <FontAwesomeIcon icon={faGraduationCap} className="w-3 h-3" />
              Course
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-gray-900 dark:text-white font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
            {course.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-500">
            <span>{course.owner}</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faLayerGroup} className="text-[0.65rem]" />
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
