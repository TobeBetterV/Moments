import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: ".env.local" });

export default {
  dialect: "postgresql" as const,
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL || "" } as { url: string },
} satisfies Config;
