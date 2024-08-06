import { type NextRequest, NextResponse } from "next/server";

import { fetchAllTags } from "@/db/queries/tag";
import { ratelimit } from "@/lib/redis";

function getKey(id?: string) {
  return `tag${id ? `:${id}` : ""}`;
}

export type GetTagListResponse = {
  tags: string[];
};
export async function GET(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ""));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    const tags = await fetchAllTags();
    return NextResponse.json<GetTagListResponse>({ tags });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
