import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as process from "process";
// create the connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
