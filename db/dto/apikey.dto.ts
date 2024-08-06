import Hashids from "hashids";
import { z } from "zod";

export const apikeyDtoSchema = z.object({
  id: z.string(),
  key: z.string(),
  userId: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});
export type apikeyDto = z.infer<typeof apikeyDtoSchema>;
export const apikeyHashids = new Hashids("apikey");