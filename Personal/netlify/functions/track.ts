import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { visits } from "../../db/schema.js";
import { desc } from "drizzle-orm";

function detectDeviceType(userAgent: string): string {
  if (!userAgent) return "Unknown";
  
  const ua = userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod|windows phone/.test(ua)) {
    if (/iphone|ipod|ipad/.test(ua)) return "iPhone/iPad";
    if (/android/.test(ua)) return "Android";
    return "Mobile";
  }
  
  if (/tablet|ipad/.test(ua)) return "Tablet";
  if (/windows|win32/.test(ua)) return "Windows";
  if (/macintosh|mac os x/.test(ua)) return "Mac";
  if (/linux/.test(ua)) return "Linux";
  
  return "Desktop";
}

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
      const userAgent = req.headers.get("user-agent") || "Unknown";
      const deviceType = detectDeviceType(userAgent);

      const [row] = await db
        .insert(visits)
        .values({ deviceType, userAgent })
        .returning();

      return Response.json({ success: true, id: row.id }, { status: 201 });
    } catch (error) {
      console.error("Track error:", error);
      return Response.json({ error: "Failed to track visit" }, { status: 500 });
    }
  }

  if (req.method === "GET") {
    try {
      const rows = await db
        .select()
        .from(visits)
        .orderBy(desc(visits.visitedAt));
      
      return Response.json(rows);
    } catch (error) {
      console.error("Get visits error:", error);
      return Response.json({ error: "Failed to fetch visits" }, { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/track",
};
