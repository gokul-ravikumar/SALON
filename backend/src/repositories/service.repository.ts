import { Service } from "../models/Service";
import { CreateServiceInput } from "../validators/service.validator";

export const findAllServices = () => Service.find().sort({ createdAt: -1 });

export const findServiceByTitle = (title: string) => Service.findOne({ title });

export const findServiceByTitleExcludingId = (title: string, id: string) =>
  Service.findOne({ title, _id: { $ne: id } });

export const insertService = (input: CreateServiceInput) => Service.create(input);

export const updateServiceById = (id: string, input: CreateServiceInput) =>
  Service.findByIdAndUpdate(id, input, { new: true, runValidators: true });

export const deleteServiceById = (id: string) => Service.findByIdAndDelete(id);
