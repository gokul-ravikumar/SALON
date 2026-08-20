import { renderEmailLayout } from "./layout.template";

interface VerificationEmailParams {
  name: string;
  verificationUrl: string;
  expiryHours: number;
}
interface PasswordResetEmailParams {
  name: string;
  resetPasswordUrl: string;
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
    `,
  );

  return { subject, html };
};

export const passwordResetEmailTemplate = ({
  name,
  resetPasswordUrl,
  expiryHours,
}: PasswordResetEmailParams) => {
  const subject = "Reset your password";

  const html = renderEmailLayout(
    subject,
    `
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>If you made this request, click the button below to create a new password.</p>

      <p style="text-align:center;margin:28px 0;">
        <a href="${resetPasswordUrl}" style="background-color:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;">
          Reset Password
        </a>
      </p>

      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break:break-all;color:#52525b;">${resetPasswordUrl}</p>

      <p>This link will expire in ${expiryHours} hours.</p>

      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    `,
  );

  return { subject, html };
};
