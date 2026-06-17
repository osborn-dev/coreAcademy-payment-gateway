import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  courses,
  lessons,
  comments,
  type Course,
  type Lesson,
  type Comment,
} from "@/drizzle/schema";

export type { Course, Lesson, Comment };

// Published courses, optionally filtered by topic / featured. Newest first.
export async function getCourses(opts?: {
  topic?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Course[]> {
  const conditions = [eq(courses.published, true)];
  if (opts?.topic) conditions.push(eq(courses.topicSlug, opts.topic));
  if (opts?.featured !== undefined)
    conditions.push(eq(courses.featured, opts.featured));

  const query = db
    .select()
    .from(courses)
    .where(and(...conditions))
    .orderBy(desc(courses.publishedAt));

  if (opts?.limit) return query.limit(opts.limit);
  return query;
}

// A single published course by slug, or null.
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const rows = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

// Published lessons for a course, in display order.
export async function getLessonsForCourse(
  courseId: number
): Promise<Lesson[]> {
  return db
    .select()
    .from(lessons)
    .where(and(eq(lessons.courseId, courseId), eq(lessons.published, true)))
    .orderBy(asc(lessons.order));
}

// A course + its ordered lessons, or null if the course doesn't exist.
export async function getCourseWithLessons(
  slug: string
): Promise<{ course: Course; lessons: Lesson[] } | null> {
  const course = await getCourseBySlug(slug);
  if (!course) return null;
  const lessonRows = await getLessonsForCourse(course.id);
  return { course, lessons: lessonRows };
}

// A single lesson within a course (both by slug), or null. Lesson slug is unique
// per course, so it's resolved against the parent course's id.
export async function getLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<{ course: Course; lesson: Lesson } | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;

  const rows = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.courseId, course.id),
        eq(lessons.slug, lessonSlug),
        eq(lessons.published, true)
      )
    )
    .limit(1);

  const lesson = rows[0];
  if (!lesson) return null;
  return { course, lesson };
}

// Visible comments for a lesson, newest first.
export async function getLessonComments(
  lessonId: number
): Promise<Comment[]> {
  return db
    .select()
    .from(comments)
    .where(
      and(eq(comments.lessonId, lessonId), eq(comments.status, "visible"))
    )
    .orderBy(desc(comments.createdAt));
}

// Insert a comment and return the created row.
export async function createComment(input: {
  lessonId: number;
  userId: string;
  authorName: string;
  body: string;
}): Promise<Comment> {
  const rows = await db
    .insert(comments)
    .values({
      lessonId: input.lessonId,
      userId: input.userId,
      authorName: input.authorName,
      body: input.body,
    })
    .returning();
  return rows[0];
}
