import { Request, Response } from "express";
import {
  listServices as listServicesSvc,
  createService as createServiceSvc,
  updateService as updateServiceSvc,
  deleteService as deleteServiceSvc,
} from "../services/service.service";

export const listServices = async (_req: Request, res: Response) => {
  const services = await listServicesSvc();

  return res.status(200).json({ services });
};

export const createService = async (req: Request, res: Response) => {
  const service = await createServiceSvc(req.body);

  return res.status(201).json({ service });
};

export const updateService = async (req: Request, res: Response) => {
  const service = await updateServiceSvc(String(req.params.id), req.body);

  return res.status(200).json({ service });
};

export const deleteService = async (req: Request, res: Response) => {
  await deleteServiceSvc(String(req.params.id));

  return res.status(200).json({ message: "Service deleted." });
};
