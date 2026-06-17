// Seed courses + their lessons. Re-run with `npx tsx --env-file=.env scripts/seed.ts`.
// Upsert by slug (course) and by (courseId, slug) (lesson). id, timestamps, and
// `order` (from array index) are handled by the seed script — omit them here.
// topicSlug must match a slug in topics.ts.
//
// The first course migrates the retired type="course" post "Fullstack
// Foundations" into the proper Course → Lessons structure.

export const courses = [
  {
    title: "Fullstack Foundations: From Zero to Deployed",
    slug: "fullstack-foundations",
    excerpt:
      "A guided course that takes you through building and shipping a complete web app — frontend, backend, database, and deploy.",
    description: `## What this course is

A multi-week path for people who can write some code but haven't shipped a real app end to end. You'll build one project across four lessons and finish with something deployed that you actually made.

### Who it's for

Self-taught devs who keep starting tutorials and never finish a real project. By the end you'll have a deployed app and the mental model to build the next one on your own.

### How it works

Each lesson has a short intro, a written explanation, and a link out to the full hands-on walkthrough. Work through them in order — every lesson builds on the last.`,
    topicSlug: "career",
    coverImage: null,
    introVideoUrl: null,
    owner: "CoreAcademy",
    tags: ["fullstack", "course", "career", "projects"],
    featured: true,
    published: true,
    publishedAt: "2026-02-10",
    lessons: [
      {
        slug: "frontend-basics",
        title: "Frontend Basics: Components, State, and Routing",
        explanation: `## Building the interface

We start where the user does — the frontend. You'll set up a component-based UI, learn how state drives what renders, and wire up client-side routing so the app has more than one page.

By the end of this lesson you'll have a working shell of the app with navigation between a few screens.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=react+frontend+basics",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-02-10",
      },
      {
        slug: "the-backend",
        title: "The Backend: A REST API and a Database",
        explanation: `## Giving the app a brain

Now the data. You'll stand up a REST API, connect a database, and define the handful of endpoints the frontend needs to read and write real records.

You'll finish with an API your frontend can actually call.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=build+rest+api+database",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-02-17",
      },
      {
        slug: "auth",
        title: "Auth: Sessions, Tokens, and Protecting Routes",
        explanation: `## Who's allowed in

Real apps have users. This lesson covers signing users up and in, keeping them logged in with sessions or tokens, and protecting the routes that shouldn't be public.

You'll add a login wall to the project so only signed-in users reach the good parts.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=web+auth+sessions+tokens",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-02-24",
      },
      {
        slug: "deploy",
        title: "Deploy: Getting It Live and Keeping It Up",
        explanation: `## Shipping it

The last step is the one most tutorials skip: getting your app onto the internet. You'll deploy the frontend, the backend, and the database, set your environment variables, and verify the whole thing works in production.

When you finish, you'll have a public URL you can send to anyone.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=deploy+fullstack+app",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-03-03",
      },
    ],
  },
  {
    title: "Practical SQL for Backend Developers",
    slug: "practical-sql",
    excerpt:
      "Stop fearing the database. Learn the SQL you actually use day to day — querying, joining, indexing, and not shooting yourself in the foot.",
    description: `## Get comfortable with the database

Most backend bugs and slowdowns live in the data layer. This short course gives you the working SQL knowledge to query confidently, join correctly, and keep things fast as your tables grow.

### What you'll cover

Reading and filtering data, joining across tables, aggregations, and the indexing basics that turn a slow query into a fast one.`,
    topicSlug: "backend",
    coverImage: null,
    introVideoUrl: null,
    owner: "CoreAcademy",
    tags: ["sql", "database", "backend", "postgres"],
    featured: false,
    published: true,
    publishedAt: "2026-03-12",
    lessons: [
      {
        slug: "querying-basics",
        title: "Querying Basics: SELECT, WHERE, ORDER BY",
        explanation: `## Reading your data

The foundation: pulling rows out of a table, filtering them down, and sorting the result. Ninety percent of the SQL you write is a variation on this.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=sql+select+where+tutorial",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-03-12",
      },
      {
        slug: "joins",
        title: "Joins: Combining Tables Without the Headache",
        explanation: `## Connecting the dots

Data lives across tables. Inner, left, and the difference between them — get joins right and the rest of SQL opens up.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=sql+joins+explained",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-03-19",
      },
      {
        slug: "indexing",
        title: "Indexing: Making Slow Queries Fast",
        explanation: `## Speed where it counts

A missing index is the most common reason a query crawls. Learn what an index is, when to add one, and how to tell if it's actually being used.`,
        introVideoUrl: null,
        externalUrl: "https://www.youtube.com/results?search_query=sql+indexing+performance",
        externalLabel: "Continue on YouTube",
        owner: "CoreAcademy",
        releaseDate: "2026-03-26",
      },
    ],
  },
];
