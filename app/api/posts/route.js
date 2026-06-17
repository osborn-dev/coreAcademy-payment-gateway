import { NextResponse } from "next/server";
import { getPosts } from "@/Lib/content";

export async function GET(request) {
  try {
    const sp = request.nextUrl.searchParams;
    const opts = {};

    const topic = sp.get("topic");
    if (topic) opts.topic = topic;

    const type = sp.get("type");
    if (type) opts.type = type;

    if (sp.get("featured") === "true") opts.featured = true;

    const limit = sp.get("limit");
    if (limit) {
      const n = parseInt(limit, 10);
      if (!Number.isNaN(n)) opts.limit = n;
    }

    const posts = await getPosts(opts);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}
