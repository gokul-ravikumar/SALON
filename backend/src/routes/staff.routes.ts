import { Router } from "express";
import {
  listStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createStaffSchema } from "../validators/staff.validator";

const router = Router();

router.get("/", asyncHandler(listStaffs));

router.post(
  "/",
  protect,
  validateRequest(createStaffSchema),
  asyncHandler(createStaff),
);

router.put(
  "/:id",
  protect,
  validateRequest(createStaffSchema),
  asyncHandler(updateStaff),
);

router.delete("/:id", protect, asyncHandler(deleteStaff));

export default router;