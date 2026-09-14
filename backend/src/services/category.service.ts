import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import {
  findAllCategories,
  insertCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../repositories/category.repository";
import { CreateCategoryInput } from "../validators/category.validator";

const assertValidId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid service id.");
  }
};

export const listCategory = () => findAllCategories();

export const createCategory = async (input: CreateCategoryInput) => {
  return insertCategory(input);
};

export const updateCategory = async (id: string, input: CreateCategoryInput) => {
  assertValidId(id);

  const updated = await updateCategoryById(id, input);

  if (!updated) {
    throw new ApiError(404, "Category not found.");
  }

  return updated;
};

export const deleteCategory = async (id: string) => {
  assertValidId(id);

  const deleted = await deleteCategoryById(id);

  if (!deleted) {
    throw new ApiError(404, "Category not found.");
  }
};
