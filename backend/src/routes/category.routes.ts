import { Router } from "express";
import {
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createCategorySchema } from "../validators/category.validator";

const router = Router();

router.get("/", asyncHandler(listCategory));

router.post(
  "/",
  protect,
  validateRequest(createCategorySchema),
  asyncHandler(createCategory),
);

router.put(
  "/:id",
  protect,
  validateRequest(createCategorySchema),
  asyncHandler(updateCategory),
);

router.delete("/:id", protect, asyncHandler(deleteCategory));

export default router;