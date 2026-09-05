import { Resend } from "resend";

let resend;

const getResendClient = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not found in environment variables");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export const sendEmail = async ({ to, subject, html }) => {
  const client = getResendClient();

  return await client.emails.send({
    from: "PGRS <onboarding@resend.dev>",
    to,
    subject,
    html
  });
};
