import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

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