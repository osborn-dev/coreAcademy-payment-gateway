import { NextResponse } from "next/server";
import { getTopics } from "@/Lib/content";

export async function GET() {
  try {
    const topics = await getTopics();
    return NextResponse.json(topics);
  } catch {
    return NextResponse.json({ error: "Failed to load topics" }, { status: 500 });
  }
}
