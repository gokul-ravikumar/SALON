import { Request, Response } from "express";

import {
  listCategory as listCategorySvc,
  createCategory as createCategorySvc,
  updateCategory as updateCategorySvc,
  deleteCategory as deleteCategorySvc,
} from "../services/category.service";

export const listCategory = async (_req: Request, res: Response) => {
  const category = await listCategorySvc();

  return res.status(200).json({ category });
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await createCategorySvc(req.body);

  return res.status(201).json({ category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await updateCategorySvc(String(req.params.id), req.body);

  return res.status(200).json({ category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  await deleteCategorySvc(String(req.params.id));

  return res.status(200).json({ message: "Category deleted." });
};