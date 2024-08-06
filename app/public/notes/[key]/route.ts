import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { type GuestbookDto, GuestbookHashids } from "@/db/dto/guestbook.dto";
import { apikeys, guestbook } from "@/db/schema";
import { ratelimit } from "@/lib/redis";

type RouteSegment = { params: { id: string } };

function getKeyInPostNoteByAPIKey(id?: string) {
  return `post-note-by-apikey${id ? `:${id}` : ""}`;
}
const SignGuestbookSchema = z.object({
  content: z.string().min(1).max(600),
  tags: z.array(z.string()).nullable().optional(),
  isUseMarkdown: z.boolean().optional(),
});

export async function POST(req: NextRequest, { params }: RouteSegment) {
  const ReceivedDate = new Date();
  const { key } = z.object({ key: z.string() }).parse(params);
  if (!key) {
    return new Response("Invalid key", {
      status: 400,
    });
  }
  try {
    const { success } = await ratelimit.limit(getKeyInPostNoteByAPIKey(key));
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
    let data: any;

    // 根据Content-Type来判断数据格式
    const contentType = req.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await req.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      return new Response("Unsupported Content-Type", {
        status: 415,
      });
    }

    // 验证和解析数据
    const { content, tags, isUseMarkdown } = SignGuestbookSchema.parse(data);
    const [userByAPIKey] = await db
      .select({
        userId: apikeys.userId,
      })
      .from(apikeys)
      .where(eq(apikeys.key, key));
    if (!userByAPIKey || !userByAPIKey.userId) {
      return new Response("Invalid key", {
        status: 400,
      });
    }

    const user = await clerkClient.users.getUser(userByAPIKey.userId);
    const guestbookData = {
      userId: userByAPIKey.userId,
      message: content,
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
      });
    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook?.newId ?? 0),
        createdAt: new Date(),
        receivedDate: ReceivedDate,
        isArchived: false,
        isPinned: false,
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
