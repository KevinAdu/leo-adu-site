import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { auth } from "../../auth";
import { db } from "../../lib/db";
import { user } from "../../db/schema";

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    string
  >;

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const language = String(body.language || "en").toLowerCase() === "ja" ? "ja" : "en";

  await db
    .update(user)
    .set({
      firstName: firstName || null,
      lastName: lastName || null,
      language,
    })
    .where(eq(user.id, session.user.id));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

