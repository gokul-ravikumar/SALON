import { Router } from "express";
import {
  listServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createServiceSchema } from "../validators/service.validator";

const router = Router();

router.get("/", asyncHandler(listServices));

router.post(
  "/",
  protect,
  validateRequest(createServiceSchema),
  asyncHandler(createService),
);

router.put(
  "/:id",
  protect,
  validateRequest(createServiceSchema),
  asyncHandler(updateService),
);

router.delete("/:id", protect, asyncHandler(deleteService));

export default router;
