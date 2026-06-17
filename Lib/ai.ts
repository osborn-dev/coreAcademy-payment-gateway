import OpenAI from "openai";

// Provider-agnostic AI boundary. The recommend route calls getRecommendations()
// and never imports the OpenAI SDK directly — so switching back to Claude (or any
// provider) means editing only this file. Swap the body of callModel() and the
// rest of the app is unaffected.

const MODEL = "gpt-4o-mini";

export type Candidate = {
  slug: string;
  title: string;
  excerpt: string;
  type: string;
  topicSlug: string;
};

export type Recommendation = {
  recommended: string[]; // slugs, priority order, max 6 — all drawn from candidates
  roadmap: string; // markdown, 3-5 step personalized path
  gaps: string[]; // topic names the candidates don't cover
};

const SYSTEM_PROMPT = `You are a learning guide for CoreAcademy, a free tech education platform.
Given a user's query, optional context about them, and a list of available content
(articles, videos, courses), you:
1. Pick and rank the most relevant items for this user — ONLY from the provided list.
2. Write a short, encouraging personalized learning roadmap (3-5 steps) in Markdown.
3. Note any important topics the user seems to want that the available content does NOT cover.

Respond with ONLY a valid JSON object, no prose and no code fences, shaped exactly:
{"recommended": ["slug", ...], "roadmap": "markdown string", "gaps": ["topic name", ...]}
"recommended" must contain only slugs from the provided list, at most 6, best first.`;

function buildUserPrompt(
  query: string,
  candidates: Candidate[],
  userContext?: string
): string {
  return [
    `User query: ${query}`,
    userContext ? `About the user: ${userContext}` : null,
    ``,
    `Available content (choose recommended slugs ONLY from here):`,
    JSON.stringify(candidates, null, 2),
  ]
    .filter(Boolean)
    .join("\n");
}

// Pull the first {...} JSON object out of a model response, tolerant of stray
// prose or code fences, and validate the shape. Returns null if unparseable.
function parseRecommendation(text: string): Recommendation | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(text.slice(start, end + 1));
    return {
      recommended: Array.isArray(obj.recommended)
        ? obj.recommended.filter((s: unknown) => typeof s === "string")
        : [],
      roadmap: typeof obj.roadmap === "string" ? obj.roadmap : "",
      gaps: Array.isArray(obj.gaps)
        ? obj.gaps.filter((g: unknown) => typeof g === "string")
        : [],
    };
  } catch {
    return null;
  }
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Please define the OPENAI_API_KEY environment variable inside .env");
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

// Returns a validated Recommendation, or null if the model output couldn't be
// parsed (the caller should fall back to plain search ranking).
export async function getRecommendations(
  query: string,
  candidates: Candidate[],
  userContext?: string
): Promise<Recommendation | null> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(query, candidates, userContext) },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return parseRecommendation(text);
}
