import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Please enter your name.")
    .min(3, "Name must be at least 3 characters long.")
    .max(20, "Name cannot be longer than 20 characters."),

  email: z.email("Please enter a valid email address.").trim().toLowerCase(),

  phone: z
    .string()
    .trim()
    .nonempty("Please enter your phone number.")
    .regex(
      /^(?:\+91\s?)?(?:[6-9]\d(?:\s?\d){8})$/,
      "Please enter a valid phone number.",
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password cannot be longer than 128 characters.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number.",
    ),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1, "Verification token is missing or invalid."),
});

export const resendVerificationSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password cannot be longer than 128 characters.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number.",
    ),
  token: z.string().min(1, "Verification token is missing or invalid."),
});

const updateUserSchema = registerSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
