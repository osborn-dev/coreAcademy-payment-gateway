import { NextResponse } from "next/server";
import { incrementViews } from "@/Lib/content";

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    await incrementViews(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
