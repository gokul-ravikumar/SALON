import crypto from "crypto";

interface GeneratedToken {
  rawToken: string;
  hashedToken: string;
  expiresAt: Date;
}

const RAW_TOKEN_BYTES = 32;

export const hashToken = (rawToken: string): string =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

export const generateSecureToken = (expiresInMs: number): GeneratedToken => {
  const rawToken = crypto.randomBytes(RAW_TOKEN_BYTES).toString("hex");

  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(Date.now() + expiresInMs),
  };
};
