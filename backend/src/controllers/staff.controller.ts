import { Request, Response } from "express";

import {
  listStaffs as listStaffsSvc,
  createStaff as createStaffSvc,
  updateStaff as updateStaffSvc,
  deleteStaff as deleteStaffSvc,
} from "../services/staff.service";

export const listStaffs = async (_req: Request, res: Response) => {
  const staffs = await listStaffsSvc();

  return res.status(200).json({ staffs });
};

export const createStaff = async (req: Request, res: Response) => {
  const staff = await createStaffSvc(req.body);

  return res.status(201).json({ staff });
};

export const updateStaff = async (req: Request, res: Response) => {
  const staff = await updateStaffSvc(String(req.params.id), req.body);

  return res.status(200).json({ staff });
};

export const deleteStaff = async (req: Request, res: Response) => {
  await deleteStaffSvc(String(req.params.id));

  return res.status(200).json({ message: "Staff deleted." });
};