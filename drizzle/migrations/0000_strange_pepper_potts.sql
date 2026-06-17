CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"excerpt" varchar(300) NOT NULL,
	"body" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"topic_slug" varchar(80) NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"thumbnail" text,
	"video_url" text,
	"author" varchar(120) DEFAULT 'CoreAcademy' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"read_time" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"description" varchar(200) NOT NULL,
	"icon" varchar(80) NOT NULL,
	"color" varchar(60) NOT NULL,
	"accent_bg" varchar(60) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_topic_published_idx" ON "posts" USING btree ("topic_slug","published","published_at");--> statement-breakpoint
CREATE INDEX "posts_featured_published_idx" ON "posts" USING btree ("featured","published");--> statement-breakpoint
CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");