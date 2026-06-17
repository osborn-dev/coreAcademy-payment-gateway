import { NextResponse } from "next/server";
import { requireUserApi } from "@/Lib/session";
import { createComment } from "@/Lib/courses";

// POST a comment to a lesson. Login-walled (middleware) + self-checked here as
// defense-in-depth. The list is server-fetched on the lesson page (no GET).
const MAX_BODY = 2000;

export async function POST(request, { params }) {
  const { user, response } = await requireUserApi();
  if (response) return response;

  const { lessonId } = await params;
  const id = Number(lessonId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid lesson." }, { status: 400 });
  }

  let body;
  try {
    ({ body } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const trimmed = typeof body === "string" ? body.trim() : "";
  if (!trimmed) {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }
  if (trimmed.length > MAX_BODY) {
    return NextResponse.json(
      { error: `Comment must be ${MAX_BODY} characters or fewer.` },
      { status: 400 }
    );
  }

  try {
    const comment = await createComment({
      lessonId: id,
      userId: user.id,
      authorName: user.name || user.email || "User",
      body: trimmed,
    });
    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not post comment." }, { status: 500 });
  }
}
