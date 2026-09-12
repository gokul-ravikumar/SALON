import { Staff } from "../models/Staff";
import { CreateStaffInput } from "../validators/staff.validator";

export const findAllStaffs = () => Staff.find().sort({ createdAt: -1 });

export const insertStaff = (input: CreateStaffInput) => Staff.create(input);

export const updateStaffById = (id: string, input: CreateStaffInput) =>
  Staff.findByIdAndUpdate(id, input, { new: true, runValidators: true });

export const deleteStaffById = (id: string) => Staff.findByIdAndDelete(id);
