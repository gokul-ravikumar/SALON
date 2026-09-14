import { Category } from "../models/Category";
import { CreateCategoryInput } from "../validators/category.validator";

export const findAllCategories = () => Category.find().sort({ createdAt: -1 });

export const insertCategory = (input: CreateCategoryInput) => Category.create(input);

export const updateCategoryById = (id: string, input: CreateCategoryInput) =>
  Category.findByIdAndUpdate(id, input, { new: true, runValidators: true });

export const deleteCategoryById = (id: string) => Category.findByIdAndDelete(id);
