import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Login wall: the platform requires sign-in except for a small public allowlist.
// Public = landing, auth pages, the payment gateway (its own world), and
// next-auth's own API. Everything else redirects to /login?callbackUrl=...

// Exact-match public paths.
const PUBLIC_EXACT = new Set(["/", "/login", "/signup"]);

// Public path prefixes (the payment gateway + its APIs stay open).
const PUBLIC_PREFIXES = ["/payment", "/api/payment", "/api/submit", "/api/stripe", "/api/paystack"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/api/auth/")) return true; // next-auth handler
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  // For API routes, return a JSON 401 rather than redirecting to an HTML page —
  // a redirected fetch would resolve to login HTML and break the caller. Each
  // gated route also self-checks (requireUserApi) as defense-in-depth.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname + search);
  return NextResponse.redirect(loginUrl);
}

// Run on everything except Next internals and static files (let those through
// without a session check). API routes ARE matched so they can be gated too.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
