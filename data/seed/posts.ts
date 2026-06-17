// Seed posts. Edit freely and re-run `npx tsx scripts/seed.ts` (upsert by slug).
// type: "article" | "video" | "course". topicSlug must match a slug in topics.ts.
// id, views, readTime, createdAt, updatedAt are handled by the seed script — omit them.

export const posts = [
  {
    title: "Understanding React Hooks From the Ground Up",
    slug: "understanding-react-hooks",
    excerpt:
      "useState, useEffect, and the mental model that makes hooks finally click — no class components required.",
    body: `## Why hooks exist

Before hooks, sharing stateful logic between components meant render props or higher-order components — lots of nesting. Hooks let you reuse logic as plain functions.

### useState

\`\`\`js
const [count, setCount] = useState(0);
\`\`\`

It returns the current value and a setter. Calling the setter schedules a re-render.

### useEffect

\`\`\`js
useEffect(() => {
  // runs after render
  return () => { /* cleanup */ };
}, [deps]);
\`\`\`

The dependency array controls *when* the effect re-runs. Get this wrong and you get stale values or infinite loops.

> Rule of thumb: every value from component scope that the effect uses belongs in the dependency array.`,
    type: "article",
    topicSlug: "frontend",
    tags: ["react", "hooks", "javascript", "frontend"],
    thumbnail: null,
    videoUrl: null,
    author: "CoreAcademy",
    featured: true,
    published: true,
    publishedAt: "2026-01-15",
  },
  {
    title: "Designing REST APIs That Don't Hurt to Use",
    slug: "designing-rest-apis",
    excerpt:
      "Resource naming, status codes, pagination, and versioning — the conventions that make an API a joy instead of a guessing game.",
    body: `## Resources, not actions

URLs should name *things*, not verbs. Use the HTTP method for the verb.

- \`GET /posts\` — list
- \`POST /posts\` — create
- \`GET /posts/:id\` — read one
- \`PATCH /posts/:id\` — update
- \`DELETE /posts/:id\` — remove

### Status codes that mean something

- \`200\` OK, \`201\` Created, \`204\` No Content
- \`400\` bad request, \`401\` unauthenticated, \`403\` forbidden, \`404\` not found
- \`500\` you broke something

### Paginate from day one

Returning every row works until it doesn't. Use cursor or offset pagination early so clients never assume an unbounded list.`,
    type: "article",
    topicSlug: "backend",
    tags: ["api", "rest", "http", "backend"],
    thumbnail: null,
    videoUrl: null,
    author: "CoreAcademy",
    featured: true,
    published: true,
    publishedAt: "2026-01-22",
  },
  {
    title: "Docker for Developers — A Practical Walkthrough",
    slug: "docker-for-developers",
    excerpt:
      "Containers, images, and docker-compose explained by actually shipping a small app. A hands-on video walkthrough.",
    body: `## What you'll build

A containerized Node app with a Postgres sidecar, wired together with docker-compose.

### The Dockerfile

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
\`\`\`

### docker-compose

One file describes your app *and* its database, so a teammate can run \`docker compose up\` and get the whole stack.

Watch the full walkthrough above, then try reproducing it with your own project.`,
    type: "video",
    topicSlug: "devops",
    tags: ["docker", "containers", "devops", "compose"],
    thumbnail: null,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    author: "CoreAcademy",
    featured: false,
    published: true,
    publishedAt: "2026-02-03",
  },
];
