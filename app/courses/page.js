import Link from "next/link";
import { getCourses, getLessonsForCourse } from "@/Lib/courses";
import { getTopics } from "@/Lib/content";
import CourseCard from "@/Components/platform/CourseCard";
import FilterBar from "@/Components/platform/FilterBar";
import StaggerGrid from "@/Components/platform/StaggerGrid";

export const metadata = {
  title: "Courses — CoreAcademy",
  description: "Guided, multi-lesson courses across every corner of tech — free and self-paced.",
};

export default async function CoursesPage({ searchParams }) {
  const sp = await searchParams;
  const topic = sp?.topic ?? "";

  const topics = await getTopics();
  const courses = await getCourses({ topic: topic || undefined });

  // Lesson counts for each card (small N — courses are a curated set).
  const withCounts = await Promise.all(
    courses.map(async (course) => ({
      course,
      lessonCount: (await getLessonsForCourse(course.id)).length,
    }))
  );

  const topicOptions = [
    { value: "", label: "All" },
    ...topics.map((t) => ({ value: t.slug, label: t.name })),
  ];

  const current = {};
  if (topic) current.topic = topic;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Guided, multi-lesson paths — pick a topic and start building.
        </p>

        <FilterBar
          label="Topic"
          paramKey="topic"
          options={topicOptions}
          current={current}
          basePath="/courses"
        />

        {withCounts.length === 0 ? (
          <div className="bg-black/[0.03] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center mt-4">
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">No courses in this topic yet.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-5">Try another topic, or browse everything.</p>
            <Link
              href="/courses"
              className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Clear filter
            </Link>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {withCounts.map(({ course, lessonCount }) => (
              <CourseCard key={course.slug} course={course} lessonCount={lessonCount} />
            ))}
          </StaggerGrid>
        )}
      </div>
    </main>
  );
}
