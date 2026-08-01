import { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
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