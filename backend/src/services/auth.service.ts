import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { appConfig } from "../config/brevo.config";
import * as userRepository from "../repositories/user.repository";
import { emailService } from "./email/email.service";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";
import { generateSecureToken, hashToken } from "../utils/token.util";
import { loginInput, RegisterInput } from "../validators/auth.validator";

const VERIFICATION_TOKEN_TTL_MS =
  appConfig.emailVerificationExpiryHours * 60 * 60 * 1000;

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

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new ApiError(400, "Email already registered");
    }

    await issueVerificationToken(existingUser);
    return { message: "Registration successful. Please verify your email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  await issueVerificationToken(user);

  return { message: "Registration successful. Please verify your email." };
};

export const loginUser = async (input: loginInput) => {
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
