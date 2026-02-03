import appInvitePkg from "@better-auth-kit/app-invite";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./lib/email";
import { db } from "./lib/db";

type CreateAuthOptions = {
  allowSignUp?: boolean;
};

export const createAuth = (options: CreateAuthOptions = {}) => {
  const adminEmails = (import.meta.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const { appInvite } = appInvitePkg;

  const allowSignUp =
    options.allowSignUp ?? import.meta.env.ALLOW_SIGNUP === "true";

  const appUrl =
    import.meta.env.APP_URL ??
    import.meta.env.BETTER_AUTH_BASE_URL ??
    import.meta.env.BETTER_AUTH_URL ??
    "http://localhost:4321";

  return betterAuth({
    appName: "Leo Adu Site",
    baseURL: import.meta.env.BETTER_AUTH_BASE_URL ?? import.meta.env.BETTER_AUTH_URL,
    secret: import.meta.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "pg" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
    },
    plugins: [
      appInvite({
        allowUserToCreateInvitation: async (user) => {
          if (adminEmails.length === 0) {
            return false;
          }

          return adminEmails.includes(user.email.toLowerCase());
        },
        sendInvitationEmail: async (data) => {
          const inviteUrl = new URL(`/invite/${data.id}`, appUrl).toString();
          const inviterName = data.inviter.name ?? data.inviter.email;
          const invitationTarget = data.name ?? "the app";
          const subject = `${inviterName} invited you to ${invitationTarget}`;
          const html = `<p>${inviterName} invited you to ${invitationTarget}.</p>
<p><a href="${inviteUrl}">Accept the invite</a></p>`;
          const text = `${inviterName} invited you to ${invitationTarget}. Accept: ${inviteUrl}`;

          await sendEmail({
            to: data.email,
            subject,
            html,
            text,
          });
        },
        autoSignIn: true,
      }),
    ],
  });
};

export const auth = createAuth();
