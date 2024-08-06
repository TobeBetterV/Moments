import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { uuidv4 } from "uuidv7";

import { db } from "@/db";
import { apikeyHashids } from "@/db/dto/apikey.dto";
import { apikeys } from "@/db/schema";
import { ratelimit } from "@/lib/redis";
const getKeyInAPIKey = (id?: string) => `apikey${id ? `:${id}` : ""}`;

export type getAPIKeysResponseType = {
  key: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const userId = user?.id;

  try {
    const { success } = await ratelimit.limit(getKeyInAPIKey(req.ip ?? ""));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const result = await db
      .select({
        key: apikeys.key,
        id: apikeys.id,
        createdAt: apikeys.createdAt,
        updatedAt: apikeys.updatedAt,
      })
      .from(apikeys)
      .where(eq(apikeys.userId, userId));
    if (result && result.length > 0) {
      return new Response(JSON.stringify(result[0]), {
        status: 200,
      });
    } else {
      const newAPIKey = {
        key: uuidv4(),
        userId: userId,
      };
      const [createnewAPIKeyResult] = await db
        .insert(apikeys)
        .values(newAPIKey)
        .returning({ newId: apikeys.id });
      return new Response(
        JSON.stringify({
          key: newAPIKey.key,
          id: apikeyHashids.encode(createnewAPIKeyResult?.newId ?? 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as getAPIKeysResponseType),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
