CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"author_name" varchar(120) NOT NULL,
	"body" text NOT NULL,
	"status" varchar(20) DEFAULT 'visible' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"excerpt" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"topic_slug" varchar(80) NOT NULL,
	"cover_image" text,
	"intro_video_url" text,
	"owner" varchar(120) DEFAULT 'CoreAcademy' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"explanation" text NOT NULL,
	"intro_video_url" text,
	"external_url" text NOT NULL,
	"external_label" varchar(120) DEFAULT 'Continue on YouTube' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"owner" varchar(120) DEFAULT 'CoreAcademy' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"release_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_lesson_created_idx" ON "comments" USING btree ("lesson_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "courses_topic_published_idx" ON "courses" USING btree ("topic_slug","published","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "lessons_course_slug_idx" ON "lessons" USING btree ("course_id","slug");--> statement-breakpoint
CREATE INDEX "lessons_course_order_idx" ON "lessons" USING btree ("course_id","order");