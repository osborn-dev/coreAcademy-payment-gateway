import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Global-cached Postgres client so Next.js hot reloads don't open a new
// connection pool on every change (mirrors the global cache in Config/DataBase.js).
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

if (!process.env.DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env");
}

const client =
  globalForDb.client ?? postgres(process.env.DATABASE_URL, { max: 1 });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
