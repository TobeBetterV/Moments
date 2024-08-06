import { and, count, desc, eq, ne, or } from "drizzle-orm";
import { uuidv4 } from "uuidv7";

import { db } from "@/db";
import { type GuestbookDto, GuestbookHashids } from "@/db/dto/guestbook.dto";
import { guestbook } from "@/db/schema";

export async function fetchGuestbookMessages({
  limit = 200,
  page = 1,
  userId,
}: { limit?: number; page?: number; userId?: string } = {}) {
  const data = await db
    .select({
      id: guestbook.id,
      userId: guestbook.userId,
      tags: guestbook.tags,
      userInfo: guestbook.userInfo,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      isArchived: guestbook.isArchived,
      isUseMarkdown: guestbook.isUseMarkdown,
      isPinned: guestbook.isPinned,
    })
    .from(guestbook)
    .orderBy(desc(guestbook.isPinned), desc(guestbook.createdAt))
    .limit(limit)
    .offset(page * limit)
    .where(
      and(
        eq(guestbook.isDeleted, false),
        or(
          eq(guestbook.userId, userId ?? String(uuidv4())),
          eq(guestbook.isArchived, false)
        )
      )
    );

  return data.map(
    ({ id, ...rest }) =>
      ({
        ...rest,
        id: GuestbookHashids.encode(id),
      } as GuestbookDto)
  );
}

export async function fetchGuestbookMessageTotalNum() {
  const data = await db
    .select({ count: count() })
    .from(guestbook)
    .where(ne(guestbook.isDeleted, true));

  return data[0]?.count ?? 0;
}
