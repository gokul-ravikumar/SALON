import { appConfig, brevoConfig } from "../../config/brevo.config";
import { verificationEmailTemplate } from "../../templates/email/verificationEmail.template";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private async send({ to, subject, html }: SendEmailOptions): Promise<void> {
    const response = await fetch(brevoConfig.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": brevoConfig.apiKey,
      },
      body: JSON.stringify({
        sender: brevoConfig.sender,
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Brevo email send failed:", response.status, errorBody);
      throw new Error("Failed to send email");
    }
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    rawToken: string,
  ): Promise<void> {
    const verificationUrl = `${appConfig.frontendUrl}/verify-email?token=${rawToken}`;

    const { subject, html } = verificationEmailTemplate({
      name,
      verificationUrl,
      expiryHours: appConfig.emailVerificationExpiryHours,
    });

    await this.send({ to, subject, html });
  }
}

export const emailService = new EmailService();
