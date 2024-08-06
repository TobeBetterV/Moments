import { desc, eq } from "drizzle-orm";
import { uniq } from "lodash-es";

import { db } from "@/db";
import { guestbook } from "@/db/schema";
interface DataItem {
  tags: unknown;
}
export async function fetchAllTags(): Promise<string[]> {
  const data: DataItem[] = await db
    .select({
      tags: guestbook.tags,
    })
    .from(guestbook)
    .orderBy(desc(guestbook.isPinned), desc(guestbook.createdAt))
    .where(eq(guestbook.isDeleted, false));

  // 提取所有 tags 数组并扁平化
  const allTags = data.map(({ tags }) => tags as string[]).flat();
  return uniq(allTags);
}
