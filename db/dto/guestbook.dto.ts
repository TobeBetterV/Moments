import Hashids from "hashids";
import { z } from "zod";

export const GuestbookDtoSchema = z.object({
  id: z.string(),
  message: z.string().min(1).max(600),
  tags: z.array(z.string()).nullable().optional(),
  userId: z.string(),
  userInfo: z.object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
  }),
  createdAt: z.date().or(z.string()),
  receivedDate: z.date().or(z.string()).nullable().optional(),
  isArchived: z.boolean(),
  isUseMarkdown: z.boolean(),
  isPinned: z.boolean(),
});
export type GuestbookDto = z.infer<typeof GuestbookDtoSchema>;
export const GuestbookHashids = new Hashids("guestbook");
