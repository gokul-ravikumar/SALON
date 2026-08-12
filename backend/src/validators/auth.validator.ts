import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().trim().min(1, "Phone is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.email("Invalid email address"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>;
