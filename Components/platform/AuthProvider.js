"use client";
import { SessionProvider } from "next-auth/react";

// Client wrapper so Client Components (header, comment form, search) can call
// useSession(). Wraps the whole app from the root layout.
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
