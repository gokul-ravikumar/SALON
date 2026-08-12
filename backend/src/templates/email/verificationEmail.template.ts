import { renderEmailLayout } from "./layout.template";

interface VerificationEmailParams {
  name: string;
  verificationUrl: string;
  expiryHours: number;
}

export const verificationEmailTemplate = ({
  name,
  verificationUrl,
  expiryHours,
}: VerificationEmailParams) => {
  const subject = "Verify your email address";

  const html = renderEmailLayout(
    subject,
    `
      <p>Hi ${name},</p>
      <p>Thanks for creating an account with us. Please verify your email address to activate your account.</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${verificationUrl}" style="background-color:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;">Verify Email</a>
      </p>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break:break-all;color:#52525b;">${verificationUrl}</p>
      <p>This link will expire in ${expiryHours} hours.</p>
    `
  );

  return { subject, html };
};
