import { currentUser } from "@clerk/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { type GuestbookDto, GuestbookHashids } from "@/db/dto/guestbook.dto";
import { fetchGuestbookMessages } from "@/db/queries/guestbook";
import { guestbook } from "@/db/schema";
import { ratelimit } from "@/lib/redis";
import { is } from "drizzle-orm";

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ""}`;
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "") || 0;
  const limit = parseInt(searchParams.get("limit") ?? "") || 10;

  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ""));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    return NextResponse.json(
      await fetchGuestbookMessages({
        limit: limit,
        page: page,
        userId: user?.id,
      })
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

const SignGuestbookSchema = z.object({
  message: z.string().min(1).max(600),
  tags: z.array(z.string()).nullable().optional(),
  isUseMarkdown: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const ReceivedDate = new Date();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const { success } = await ratelimit.limit(getKey(user.id));
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
  } catch (error) {
    return new Response("Upstash Error", {
      status: 400,
    });
  }

  try {
    const data = await req.json();
    const { message, tags, isUseMarkdown } = SignGuestbookSchema.parse(data);

    const guestbookData = {
      userId: user.id,
      message,
      tags: tags ?? [],
      isUseMarkdown: isUseMarkdown ?? false,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.username,
        emailAddresses:
          user.emailAddresses && user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
      },
    };

    const [newGuestbook] = await db
      .insert(guestbook)
      .values(guestbookData)
      .returning({
        newId: guestbook.id,
        isArchived: guestbook.isArchived,
        isPinned: guestbook.isPinned,
      });
    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook?.newId ?? 0),
        createdAt: new Date(),
        receivedDate: ReceivedDate,
        isArchived: newGuestbook?.isArchived ?? false,
        isPinned: newGuestbook?.isPinned ?? false,
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
