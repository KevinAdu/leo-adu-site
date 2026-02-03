import { defineMiddleware } from "astro:middleware";
import { auth } from "./src/auth";

const adminEmails = (import.meta.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const protectedPaths = ["/admin/invite", "/admin/requests"];
const publicPrefixes = [
  "/login",
  "/invite",
  "/invite-only",
  "/request-access",
  "/api/access-requests",
  "/api/auth",
  "/bootstrap-admin",
];

const isPublicAsset = (pathname: string) => {
  if (pathname.startsWith("/_astro")) {
    return true;
  }

  return /\\.(css|js|mjs|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)$/.test(
    pathname,
  );
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isPublicRoute = publicPrefixes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicRoute || isPublicAsset(pathname)) {
    return next();
  }

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (session) {
    context.locals.user = session.user;
    context.locals.session = session.session;
  }

  if (!session) {
    return context.redirect("/invite-only");
  }

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (
    isProtected &&
    adminEmails.length > 0 &&
    !adminEmails.includes(session.user.email.toLowerCase())
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  return next();
});
