import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
};
