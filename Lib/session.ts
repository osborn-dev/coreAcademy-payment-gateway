import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/Lib/auth";

// Reusable gating helpers over the JWT session.

// Current user (or null) — for optional/conditional logic.
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

// Server Components: redirect to login if not signed in, else return the user.
export async function requireUser(callbackUrl = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

// Route Handlers: returns { user, response }. If response is non-null, return it
// (a 401) immediately; otherwise user is present.
export async function requireUserApi() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, response: null };
}
