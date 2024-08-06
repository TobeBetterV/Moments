import { type NextRequest, NextResponse } from "next/server";

import { fetchGuestbookMessages } from "@/db/queries/guestbook";
import { ratelimitInPublic } from "@/lib/redis";

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ""}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "") || 0;
  const limit = parseInt(searchParams.get("limit") ?? "") || 10;

  try {
    const { success } = await ratelimitInPublic.limit(getKey(req.ip ?? ""));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    return NextResponse.json(
      await fetchGuestbookMessages({
        limit: limit,
        page: page,
        userId: "",
      })
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
