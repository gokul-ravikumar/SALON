import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(login)
);

router.get("/me", protect, asyncHandler(me));

export default router;
