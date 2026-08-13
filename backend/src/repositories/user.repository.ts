import { User } from "../models/User";
import { RegisterInput } from "../validators/auth.validator";

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const findByEmail = (email: string) => User.findOne({ email });

export const findById = (id: string) => User.findById(id);

export const findByHashedVerificationToken = (hashedToken: string) =>
  User.findOne({ emailVerificationToken: hashedToken }).select(
    "+emailVerificationToken +emailVerificationExpires",
  );

export const createUser = (input: CreateUserInput) => User.create(input);

export const setVerificationToken = (
  userId: string,
  hashedToken: string,
  expiresAt: Date,
) =>
  User.findByIdAndUpdate(userId, {
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expiresAt,
  });

export const markEmailAsVerified = (userId: string) =>
  User.findByIdAndUpdate(userId, {
    isEmailVerified: true,
    verifiedAt: new Date(),
  });

export const updateExistingUser = (userId: string, data: RegisterInput) =>
  User.findByIdAndUpdate(userId, data);
