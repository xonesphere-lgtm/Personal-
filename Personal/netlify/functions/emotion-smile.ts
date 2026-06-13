import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { emotionSmiles } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method === "POST") {
    try {
      const [row] = await db
        .insert(emotionSmiles)
        .values({})
        .returning();

      return Response.json({ success: true, id: row.id }, { status: 201 });
    } catch (error) {
      console.error("Emotion smile error:", error);
      return Response.json({ error: "Failed to track smile" }, { status: 500 });
    }
  }

  if (req.method === "GET") {
    try {
      const rows = await db
        .select()
        .from(emotionSmiles)
        .orderBy(desc(emotionSmiles.createdAt));

      return Response.json(rows);
    } catch (error) {
      console.error("Get emotion smiles error:", error);
      return Response.json({ error: "Failed to fetch smiles" }, { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/emotion-smile",
};
