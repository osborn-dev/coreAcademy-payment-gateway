import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// ── topics ──
// A tech section (frontend, backend, devops, ...). Posts reference a topic by
// its slug (denormalized string), so no FK join is needed on the read path.
export const topics = pgTable(
  "topics",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    icon: varchar("icon", { length: 80 }).notNull(), // FontAwesome solid icon name, e.g. "faServer"
    color: varchar("color", { length: 60 }).notNull(), // Tailwind text class, e.g. "text-blue-400"
    accentBg: varchar("accent_bg", { length: 60 }).notNull(), // Tailwind bg class, e.g. "bg-blue-500/10"
    order: integer("order").notNull().default(0),
    published: boolean("published").notNull().default(true),
  },
  (t) => ({
    slugIdx: uniqueIndex("topics_slug_idx").on(t.slug),
  })
);

// ── posts ──
// A single piece of content: article | video | course. body is Markdown.
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    excerpt: varchar("excerpt", { length: 300 }).notNull(),
    body: text("body").notNull(),
    type: varchar("type", { length: 20 }).notNull(), // "article" | "video" | "course"
    topicSlug: varchar("topic_slug", { length: 80 }).notNull(), // references topics.slug
    tags: text("tags").array().notNull().default([]),
    thumbnail: text("thumbnail"),
    videoUrl: text("video_url"),
    author: varchar("author", { length: 120 }).notNull().default("CoreAcademy"),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    readTime: integer("read_time"), // minutes
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("posts_slug_idx").on(t.slug),
    topicPublishedIdx: index("posts_topic_published_idx").on(
      t.topicSlug,
      t.published,
      t.publishedAt
    ),
    featuredPublishedIdx: index("posts_featured_published_idx").on(
      t.featured,
      t.published
    ),
  })
);

export type Topic = typeof topics.$inferSelect;
export type Post = typeof posts.$inferSelect;

// ── Auth (Section 07) ──
// Platform accounts. Shape follows what @auth/drizzle-adapter expects (it maps
// by TS property key — providerAccountId/sessionToken/refresh_token etc. must be
// spelled exactly). Distinct from the MongoDB payment `User`. passwordHash is for
// the Credentials provider (null for OAuth-only accounts); the adapter itself
// does not manage passwords.
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  })
);

export type User = typeof users.$inferSelect;

// ── Courses (Section 08) ──
// A course belongs to one topic (denormalized topicSlug, like posts). It holds
// an ordered flat list of lessons. The legacy type="course" post is migrated
// into this table and retired.
export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    excerpt: varchar("excerpt", { length: 300 }).notNull(),
    description: text("description").notNull(), // markdown
    topicSlug: varchar("topic_slug", { length: 80 }).notNull(), // references topics.slug
    coverImage: text("cover_image"),
    introVideoUrl: text("intro_video_url"),
    owner: varchar("owner", { length: 120 }).notNull().default("CoreAcademy"),
    tags: text("tags").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("courses_slug_idx").on(t.slug),
    topicPublishedIdx: index("courses_topic_published_idx").on(
      t.topicSlug,
      t.published,
      t.publishedAt
    ),
  })
);

// ── Lessons ──
// An ordered lesson within a course. slug is unique PER COURSE (composite index),
// so two courses can each have a "getting-started" lesson. Each lesson links out
// to an external resource (YouTube etc.) via externalUrl.
export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    explanation: text("explanation").notNull(), // markdown
    introVideoUrl: text("intro_video_url"),
    externalUrl: text("external_url").notNull(),
    externalLabel: varchar("external_label", { length: 120 })
      .notNull()
      .default("Continue on YouTube"),
    order: integer("order").notNull().default(0),
    owner: varchar("owner", { length: 120 }).notNull().default("CoreAcademy"),
    published: boolean("published").notNull().default(true),
    releaseDate: timestamp("release_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    courseSlugIdx: uniqueIndex("lessons_course_slug_idx").on(t.courseId, t.slug),
    courseOrderIdx: index("lessons_course_order_idx").on(t.courseId, t.order),
  })
);

// ── Comments ──
// A comment on a lesson by a logged-in user. authorName is a snapshot so the
// thread reads correctly even if a user later changes their name. status is
// pre-baked for admin moderation ("visible" | "hidden").
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    body: text("body").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("visible"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    lessonCreatedIdx: index("comments_lesson_created_idx").on(
      t.lessonId,
      t.createdAt
    ),
  })
);

export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Comment = typeof comments.$inferSelect;
