import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUpRightFromSquare, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { getLesson, getLessonComments } from "@/Lib/courses";
import MarkdownRenderer from "@/Components/platform/MarkdownRenderer";
import CommentList from "@/Components/platform/CommentList";
import CommentForm from "@/Components/platform/CommentForm";

export async function generateMetadata({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const result = await getLesson(courseSlug, lessonSlug);
  return {
    title: result ? `${result.lesson.title} — CoreAcademy` : "Lesson — CoreAcademy",
    description: result?.course.excerpt ?? "",
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

export default async function LessonPage({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const result = await getLesson(courseSlug, lessonSlug);
  if (!result) notFound();

  const { course, lesson } = result;
  const comments = await getLessonComments(lesson.id);
  const released = formatDate(lesson.releaseDate);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/courses" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link
            href={`/courses/${course.slug}`}
            className="hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            {course.title}
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {lesson.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faUser} className="text-xs" />
            {lesson.owner}
          </span>
          {released ? (
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="text-xs" />
              {released}
            </span>
          ) : null}
        </div>

        {/* Intro video embed */}
        {lesson.introVideoUrl ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/10">
            <iframe
              src={lesson.introVideoUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : null}

        {/* Explanation */}
        <MarkdownRenderer content={lesson.explanation} />

        {/* External "Continue" button */}
        <div className="mt-10">
          <a
            href={lesson.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-900/30"
          >
            {lesson.externalLabel}
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
          </a>
        </div>

        {/* Comments */}
        <section className="mt-14 pt-10 border-t border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Discussion
            {comments.length > 0 ? (
              <span className="text-gray-400 dark:text-gray-500 font-normal"> · {comments.length}</span>
            ) : null}
          </h2>

          <div className="mb-8">
            <CommentForm
              lessonId={lesson.id}
              callbackUrl={`/courses/${course.slug}/lessons/${lesson.slug}`}
            />
          </div>

          <CommentList comments={comments} />
        </section>
      </div>
    </main>
  );
}
