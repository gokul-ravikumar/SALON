import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import {
  findAllServices,
  findServiceByTitle,
  findServiceByTitleExcludingId,
  insertService,
  updateServiceById,
  deleteServiceById,
} from "../repositories/service.repository";
import { CreateServiceInput } from "../validators/service.validator";

const assertValidId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid service id.");
  }
};

export const listServices = () => findAllServices();

export const createService = async (input: CreateServiceInput) => {
  const existing = await findServiceByTitle(input.title);

  if (existing) {
    throw new ApiError(409, "A service with that title already exists.");
  }

  return insertService(input);
};

export const updateService = async (id: string, input: CreateServiceInput) => {
  assertValidId(id);

  const duplicate = await findServiceByTitleExcludingId(input.title, id);

  if (duplicate) {
    throw new ApiError(409, "A service with that title already exists.");
  }

  const updated = await updateServiceById(id, input);

  if (!updated) {
    throw new ApiError(404, "Service not found.");
  }

  return updated;
};

export const deleteService = async (id: string) => {
  assertValidId(id);

  const deleted = await deleteServiceById(id);

  if (!deleted) {
    throw new ApiError(404, "Service not found.");
  }
};
