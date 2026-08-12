import { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { VerifyEmailQuery } from "../validators/auth.validator";

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);

  return res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const user = await loginUser(req.body);

  return res.status(200).json({
    message: "Login successful",
    user,
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }

  const user = await getCurrentUser(req.user._id.toString());

  return res.status(200).json({ user });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.query as unknown as VerifyEmailQuery;

  const result = await verifyEmail(token);

  return res.status(200).json(result);
};

export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await resendVerificationEmail(email);

  return res.status(200).json(result);
};
