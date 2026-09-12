import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import {
  findAllStaffs,
  insertStaff,
  updateStaffById,
  deleteStaffById,
} from "../repositories/staff.repository";
import { CreateStaffInput } from "../validators/staff.validator";

const assertValidId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid service id.");
  }
};

export const listStaffs = () => findAllStaffs();

export const createStaff = async (input: CreateStaffInput) => {
  return insertStaff(input);
};

export const updateStaff = async (id: string, input: CreateStaffInput) => {
  assertValidId(id);

  const updated = await updateStaffById(id, input);

  if (!updated) {
    throw new ApiError(404, "Staff not found.");
  }

  return updated;
};

export const deleteStaff = async (id: string) => {
  assertValidId(id);

  const deleted = await deleteStaffById(id);

  if (!deleted) {
    throw new ApiError(404, "Staff not found.");
  }
};
