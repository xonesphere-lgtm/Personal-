import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { feedback } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method === "POST") {
    let body: { stars?: unknown; message?: unknown };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const stars = Number(body.stars);
    const message = String(body.message ?? "").trim();

    if (!stars || stars < 1 || stars > 5 || !Number.isInteger(stars)) {
      return Response.json({ error: "Stars must be 1–5" }, { status: 400 });
    }
    if (!message || message.length > 1000) {
      return Response.json(
        { error: "Message is required and must be under 1000 characters" },
        { status: 400 }
      );
    }

    const [row] = await db
      .insert(feedback)
      .values({ stars, message })
      .returning();

    return Response.json(row, { status: 201 });
  }

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt));

    return Response.json(rows);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/feedback",
};
