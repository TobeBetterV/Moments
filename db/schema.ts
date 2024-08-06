import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const apikeys = pgTable("apikeys", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }),
  userId: varchar("user_id", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 120 }),
  token: varchar("token", { length: 50 }),
  subscribedAt: timestamp("subscribed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 200 }),
  body: text("body"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    userInfo: json("user_info"),
    postId: varchar("post_id", { length: 100 }).notNull(),
    parentId: integer("parent_id"),
    body: json("body"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    postIdx: index("post_idx").on(table.postId),
  })
);

export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  userInfo: json("user_info"),
  tags: json("tags"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isArchived: boolean("is_archived").default(true), // 表示是否被archive
  isDeleted: boolean("is_deleted").default(false), // 表示是否被delete
  isUseMarkdown: boolean("is_use_markdown").default(false),
  isPinned: boolean("is_pinned").default(false),
});
