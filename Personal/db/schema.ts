import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const feedback = pgTable("feedback", {
  id: serial().primaryKey(),
  stars: integer("stars").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const visits = pgTable("visits", {
  id: serial().primaryKey(),
  deviceType: text("device_type").notNull(),
  userAgent: text("user_agent"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const emotionSmiles = pgTable("emotion_smiles", {
  id: serial().primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
});
