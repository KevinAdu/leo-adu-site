import { Resend } from "resend";

let resend: Resend | null = null;

const getResend = () => {
  if (resend) {
    return resend;
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  resend = new Resend(apiKey);
  return resend;
};

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const from = import.meta.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM is not set");
  }

  const client = getResend();

  await client.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
}
