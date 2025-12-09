import nodemailer from "nodemailer";

const emailFrom = process.env.EMAIL_FROM;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const isConfigured = emailFrom && smtpHost && smtpUser && smtpPass;

export const mailer =
  isConfigured &&
  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

export async function sendGuardianShareEmail(params: {
  to: string;
  walletId: string;
  encryptedShare: string;
  hmac?: string;
}) {
  if (!mailer || !emailFrom) {
    console.warn("[mailer] Transport not configured; skipping email.");
    return;
  }
  const { to, walletId, encryptedShare, hmac } = params;
  await mailer.sendMail({
    from: emailFrom,
    to,
    subject: `Wallet share for wallet ${walletId}`,
    text: [
      `You have been assigned a guardian share for wallet ${walletId}.`,
      "",
      `Encrypted share: ${encryptedShare}`,
      hmac ? `HMAC: ${hmac}` : "",
      "",
      "Keep this secure. Do not forward.",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}


