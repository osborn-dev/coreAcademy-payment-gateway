// Seed topics. Edit freely and re-run `npx tsx scripts/seed.ts` (upsert by slug).
// icon = a real @fortawesome/free-solid-svg-icons name; color/accentBg = Tailwind classes.

export const topics = [
  {
    name: "Frontend Development",
    slug: "frontend",
    description: "UIs, frameworks, and everything the user sees and touches.",
    icon: "faPaintbrush",
    color: "text-blue-400",
    accentBg: "bg-blue-500/10",
    order: 1,
    published: true,
  },
  {
    name: "Backend Development",
    slug: "backend",
    description: "APIs, databases, and the systems that power your apps.",
    icon: "faServer",
    color: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    order: 2,
    published: true,
  },
  {
    name: "DevOps & Infrastructure",
    slug: "devops",
    description: "Shipping, scaling, and keeping things running in production.",
    icon: "faGears",
    color: "text-amber-400",
    accentBg: "bg-amber-500/10",
    order: 3,
    published: true,
  },
  {
    name: "Career & Growth",
    slug: "career",
    description: "Breaking in, leveling up, and building a lasting tech career.",
    icon: "faBriefcase",
    color: "text-indigo-400",
    accentBg: "bg-indigo-500/10",
    order: 4,
    published: true,
  },
];
