import "next-auth";
import { DefaultSession } from "next-auth";

// Expose the Postgres users.id on the session/token so gated server code can
// resolve the current user without an extra query.
declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
