import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("boom") !== "1") {
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Add ?boom=1 to intentionally throw a test error for Sentry.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  throw new Error("Temporary Sentry test error from /api/sentry-test");
};
