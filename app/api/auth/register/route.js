import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

// Credentials signup. next-auth has no built-in registration, so we own it:
// validate, check uniqueness, hash, insert. Does NOT sign the user in — the
// client calls signIn("credentials") after a 201.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normEmail = email.toLowerCase().trim();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normEmail))
      .limit(1);
    if (existing.length) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(users).values({
      name: name?.trim() || null,
      email: normEmail,
      passwordHash,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
