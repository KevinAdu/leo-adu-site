import type { APIRoute } from "astro";
import { desc, eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { accessRequest } from "../../../db/schema";

const adminEmails = (import.meta.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const requestToken = import.meta.env.REQUEST_ACCESS_TOKEN ?? "";

const parseBody = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
};

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (
    adminEmails.length > 0 &&
    !adminEmails.includes(session.user.email.toLowerCase())
  ) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";

  const rows = await db
    .select()
    .from(accessRequest)
    .where(eq(accessRequest.status, status))
    .orderBy(desc(accessRequest.createdAt));

  return new Response(JSON.stringify({ requests: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!requestToken) {
    return new Response(
      JSON.stringify({ error: "Request access is not configured." }),
      { status: 500 },
    );
  }

  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");

  const body = (await parseBody(request)) as Record<string, string>;
  const token = String(body.token || "");
  if (token !== requestToken) {
    return new Response(JSON.stringify({ error: "Invalid token." }), {
      status: 403,
    });
  }

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const language = String(body.language || "en").toLowerCase() === "ja" ? "ja" : "en";

  if (!firstName || !lastName || !email) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
    });
  }

  const existing = await db
    .select()
    .from(accessRequest)
    .where(eq(accessRequest.email, email))
    .orderBy(desc(accessRequest.createdAt))
    .limit(1);

  if (existing.length && existing[0].status === "pending") {
    if (wantsHtml) {
      return Response.redirect("/request-access/success", 303);
    }
    return new Response(
      JSON.stringify({ message: "Request already submitted." }),
      { status: 200 },
    );
  }

  await db.insert(accessRequest).values({
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    language,
    status: "pending",
  });

  if (wantsHtml) {
    return Response.redirect("/request-access/success", 303);
  }

  return new Response(
    JSON.stringify({ message: "Request submitted. Awaiting approval." }),
    { status: 200 },
  );
};
