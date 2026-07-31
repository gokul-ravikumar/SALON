import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { registerSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register)
);

export default router;
