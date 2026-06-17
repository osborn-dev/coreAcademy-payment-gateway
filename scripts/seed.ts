// Seed runner: `npx tsx scripts/seed.ts`
// Upserts topics and posts by slug. Safe to re-run — it updates existing rows
// and inserts new ones, and never resets `views` (views is excluded from the
// update set). readTime is computed from the body word count.
//
// Run with the env file loaded:  npx tsx --env-file=.env scripts/seed.ts

import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { posts, topics, courses, lessons } from "../drizzle/schema";
import { topics as topicSeed } from "../data/seed/topics";
import { posts as postSeed } from "../data/seed/posts";
import { courses as courseSeed } from "../data/seed/courses";

const WORDS_PER_MINUTE = 200;

function readTimeFor(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function seed() {
  console.log("Seeding topics...");
  for (const t of topicSeed) {
    await db
      .insert(topics)
      .values(t)
      .onConflictDoUpdate({
        target: topics.slug,
        set: {
          name: t.name,
          description: t.description,
          icon: t.icon,
          color: t.color,
          accentBg: t.accentBg,
          order: t.order,
          published: t.published,
        },
      });
  }
  console.log(`  ${topicSeed.length} topics upserted.`);

  console.log("Seeding posts...");
  for (const p of postSeed) {
    const row = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      type: p.type,
      topicSlug: p.topicSlug,
      tags: p.tags,
      thumbnail: p.thumbnail,
      videoUrl: p.videoUrl,
      author: p.author,
      featured: p.featured,
      published: p.published,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      readTime: readTimeFor(p.body),
      updatedAt: new Date(),
    };
    await db
      .insert(posts)
      .values(row)
      .onConflictDoUpdate({
        target: posts.slug,
        // NOTE: `views` and `createdAt` are intentionally NOT in this set,
        // so re-seeding never resets a post's view count or original date.
        set: {
          title: row.title,
          excerpt: row.excerpt,
          body: row.body,
          type: row.type,
          topicSlug: row.topicSlug,
          tags: row.tags,
          thumbnail: row.thumbnail,
          videoUrl: row.videoUrl,
          author: row.author,
          featured: row.featured,
          published: row.published,
          publishedAt: row.publishedAt,
          readTime: row.readTime,
          updatedAt: row.updatedAt,
        },
      });
  }
  console.log(`  ${postSeed.length} posts upserted.`);

  // Retire the legacy course-as-post (migrated into the courses table below).
  await db.delete(posts).where(eq(posts.slug, "fullstack-foundations"));
  console.log("  Removed legacy 'fullstack-foundations' post (now a course).");

  console.log("Seeding courses + lessons...");
  let lessonCount = 0;
  for (const c of courseSeed) {
    const courseRow = {
      title: c.title,
      slug: c.slug,
      excerpt: c.excerpt,
      description: c.description,
      topicSlug: c.topicSlug,
      coverImage: c.coverImage,
      introVideoUrl: c.introVideoUrl,
      owner: c.owner,
      tags: c.tags,
      featured: c.featured,
      published: c.published,
      publishedAt: c.publishedAt ? new Date(c.publishedAt) : null,
      updatedAt: new Date(),
    };
    const [course] = await db
      .insert(courses)
      .values(courseRow)
      .onConflictDoUpdate({
        target: courses.slug,
        // createdAt intentionally excluded so re-seeding keeps the original date.
        set: {
          title: courseRow.title,
          excerpt: courseRow.excerpt,
          description: courseRow.description,
          topicSlug: courseRow.topicSlug,
          coverImage: courseRow.coverImage,
          introVideoUrl: courseRow.introVideoUrl,
          owner: courseRow.owner,
          tags: courseRow.tags,
          featured: courseRow.featured,
          published: courseRow.published,
          publishedAt: courseRow.publishedAt,
          updatedAt: courseRow.updatedAt,
        },
      })
      .returning();

    for (let i = 0; i < c.lessons.length; i++) {
      const l = c.lessons[i];
      const lessonRow = {
        courseId: course.id,
        slug: l.slug,
        title: l.title,
        explanation: l.explanation,
        introVideoUrl: l.introVideoUrl,
        externalUrl: l.externalUrl,
        externalLabel: l.externalLabel,
        order: i,
        owner: l.owner,
        published: true,
        releaseDate: l.releaseDate ? new Date(l.releaseDate) : null,
        updatedAt: new Date(),
      };
      await db
        .insert(lessons)
        .values(lessonRow)
        .onConflictDoUpdate({
          target: [lessons.courseId, lessons.slug],
          set: {
            title: lessonRow.title,
            explanation: lessonRow.explanation,
            introVideoUrl: lessonRow.introVideoUrl,
            externalUrl: lessonRow.externalUrl,
            externalLabel: lessonRow.externalLabel,
            order: lessonRow.order,
            owner: lessonRow.owner,
            published: lessonRow.published,
            releaseDate: lessonRow.releaseDate,
            updatedAt: lessonRow.updatedAt,
          },
        });
      lessonCount++;
    }
  }
  console.log(`  ${courseSeed.length} courses + ${lessonCount} lessons upserted.`);

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
