import { currentUser } from "@clerk/nextjs";
import { type NextRequest, NextResponse } from "next/server";

import { fetchGuestbookMessageTotalNum } from "@/db/queries/guestbook";
import { getHeatmapData } from "@/db/queries/heatmap";
import { ratelimit } from "@/lib/redis";

function getKey(id?: string) {
  return `info${id ? `:${id}` : ""}`;
}

export type GetInfoResponse = {
  totalNum: number;
  heatmapData: number[][] | null;
};
export async function GET(req: NextRequest) {
  const user = await currentUser();

  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ""));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    const totalNum = await fetchGuestbookMessageTotalNum();
    const heatmapData = await getHeatmapData();
    return NextResponse.json<GetInfoResponse>({ totalNum, heatmapData });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
