import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { accessRequest } from "../../../db/schema";

const adminEmails = (import.meta.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const parseBody = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
};

export const POST: APIRoute = async ({ request }) => {
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

  const body = (await parseBody(request)) as Record<string, string>;
  const id = String(body.id || "");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing request id." }), {
      status: 400,
    });
  }

  const rows = await db
    .select()
    .from(accessRequest)
    .where(eq(accessRequest.id, id))
    .limit(1);

  const requestRow = rows[0];
  if (!requestRow) {
    return new Response(JSON.stringify({ error: "Request not found." }), {
      status: 404,
    });
  }

  if (requestRow.status !== "pending") {
    return new Response(
      JSON.stringify({ error: "Request already reviewed." }),
      { status: 409 },
    );
  }

  const name = `${requestRow.firstName} ${requestRow.lastName}`.trim();

  const invitation = await auth.api.createAppInvitation({
    body: {
      name,
      email: requestRow.email,
    },
    headers: request.headers,
    request,
  });

  await db
    .update(accessRequest)
    .set({
      status: "approved",
      invitationId: invitation.id,
      reviewedAt: new Date(),
      reviewerId: session.user.id,
    })
    .where(eq(accessRequest.id, id));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

