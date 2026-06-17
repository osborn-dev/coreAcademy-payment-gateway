import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLayerGroup, faUser } from "@fortawesome/free-solid-svg-icons";
import { getCourseWithLessons } from "@/Lib/courses";
import { getTopics } from "@/Lib/content";
import MarkdownRenderer from "@/Components/platform/MarkdownRenderer";
import LessonListItem from "@/Components/platform/LessonListItem";

export async function generateMetadata({ params }) {
  const { courseSlug } = await params;
  const result = await getCourseWithLessons(courseSlug);
  return {
    title: result ? `${result.course.title} — CoreAcademy` : "Course — CoreAcademy",
    description: result?.course.excerpt ?? "",
  };
}

export default async function CoursePage({ params }) {
  const { courseSlug } = await params;
  const result = await getCourseWithLessons(courseSlug);
  if (!result) notFound();

  const { course, lessons } = result;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === course.topicSlug);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back to Courses
        </Link>

        {/* Hero: cover or intro video */}
        {course.introVideoUrl ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/10">
            <iframe
              src={course.introVideoUrl}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8">
            {course.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 via-blue-600/20 to-gray-200 dark:to-gray-900" />
            )}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1 text-xs font-semibold">
            Course
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faUser} className="text-xs" />
            {course.owner}
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </span>
          {topic ? (
            <Link href={`/topics/${topic.slug}`} className={`${topic.color} hover:underline`}>
              {topic.name}
            </Link>
          ) : null}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          {course.title}
        </h1>

        <MarkdownRenderer content={course.description} />

        {/* Lessons */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-500 text-sm">Lessons are coming soon.</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <LessonListItem key={lesson.slug} courseSlug={course.slug} lesson={lesson} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
