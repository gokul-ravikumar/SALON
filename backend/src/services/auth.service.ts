import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { appConfig } from "../config/brevo.config";
import * as userRepository from "../repositories/user.repository";
import { emailService } from "./email/email.service";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";
import { generateSecureToken, hashToken } from "../utils/token.util";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

const VERIFICATION_TOKEN_TTL_MS =
  appConfig.emailVerificationExpiryHours * 60 * 60 * 1000;

const RESET_PASSWORD_TOKEN_TTL_MS =
  appConfig.passwordResetExpiryHours * 60 * 60 * 1000;

const issueVerificationToken = async (user: {
  _id: Types.ObjectId;
  name: string;
  email: string;
}) => {
  const { rawToken, hashedToken, expiresAt } = generateSecureToken(
    VERIFICATION_TOKEN_TTL_MS,
  );

  await userRepository.setVerificationToken(
    user._id.toString(),
    hashedToken,
    expiresAt,
  );

  await emailService.sendVerificationEmail(user.email, user.name, rawToken);
};

export const registerUser = async (input: RegisterInput) => {
  const { name, email, phone, password } = input;

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser?.isEmailVerified) {
    throw new ApiError(400, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    await userRepository.updateExistingUser(existingUser.id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await issueVerificationToken(existingUser);
    return { message: "Registration successful. Please verify your email." };
  }

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  await issueVerificationToken(user);
  return { message: "Registration successful. Please verify your email." };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const existingUser = await userRepository.findByEmail(email);

  if (!existingUser) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  if (!existingUser.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const token = generateToken(existingUser._id.toString());

  return {
    id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

export const verifyEmail = async (rawToken: string) => {
  const hashedTokenValue = hashToken(rawToken);

  const user =
    await userRepository.findByHashedVerificationToken(hashedTokenValue);

  if (user?.isEmailVerified === true) {
    throw new ApiError(400, "Already registered user");
  }

  if (!user) {
    throw new ApiError(400, "Invalid verification link");
  }

  if (
    !user.emailVerificationExpires ||
    user.emailVerificationExpires.getTime() < Date.now()
  ) {
    throw new ApiError(400, "Verification link expired");
  }

  await userRepository.markEmailAsVerified(user._id.toString());

  return { message: "Email verified successfully" };
};

export const resendVerificationEmail = async (email: string) => {
  const GENERIC_MESSAGE =
    "If an account exists for this email, a verification email has been sent.";

  const user = await userRepository.findByEmail(email);

  if (!user) {
    return { message: GENERIC_MESSAGE };
  }

  if (user.isEmailVerified) {
    return { message: "Email already verified." };
  }

  await issueVerificationToken(user);

  return { message: GENERIC_MESSAGE };
};

export const forgotPasswordEmail = async (email: string) => {
  const user = await userRepository.findByEmail(email);

  const GENERIC_MESSAGE =
    "If an account exists for this email, a reset password link has been sent.";

  if (!user?.isEmailVerified) {
    return { message: GENERIC_MESSAGE };
  }

  const passwordVerificationToken = async (user: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  }) => {
    const { rawToken, hashedToken, expiresAt } = generateSecureToken(
      RESET_PASSWORD_TOKEN_TTL_MS,
    );

    await userRepository.setPasswordResetToken(
      user._id.toString(),
      hashedToken,
      expiresAt,
    );

    await emailService.sendPasswordResetEmail(user.email, user.name, rawToken);
  };

  try {
    await passwordVerificationToken(user);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }

  return { message: GENERIC_MESSAGE };
};

export const resetPasswordUser = async (password: string, rawToken: string) => {
  const hashedTokenValue = hashToken(rawToken);

  const user = await userRepository.findByPasswordResetToken(hashedTokenValue);

  const GENERIC_MESSAGE = "Invalid or expired password reset link.";

  if (!user?.isEmailVerified) {
    return { message: GENERIC_MESSAGE };
  }

  if (
    !user.passwordResetExpires ||
    user.passwordResetExpires.getTime() < Date.now()
  ) {
    throw new ApiError(400, GENERIC_MESSAGE);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.updateResetUser(user.id, { password: hashedPassword });
  return { message: "Password updated successfully" };
};
