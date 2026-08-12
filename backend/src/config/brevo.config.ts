export const brevoConfig = {
  apiKey: process.env.BREVO_API_KEY as string,
  apiUrl: "https://api.brevo.com/v3/smtp/email",
  sender: {
    name: process.env.BREVO_SENDER_NAME || "Salon",
    email: process.env.BREVO_SENDER_EMAIL as string,
  },
};

export const appConfig = {
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  emailVerificationExpiryHours: Number(
    process.env.EMAIL_VERIFICATION_EXPIRY_HOURS || 24
  ),
};
