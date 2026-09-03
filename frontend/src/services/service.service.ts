import { apiFetch } from "@/lib/api";
import type { ServiceInput } from "@/schemas/service.validator";

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Human-readable, e.g. "45 min" or "1h 30m". */
  duration: string;
  price: number;
  category: string;
  /** Real image URL — omitted until photography lands; falls back to a placeholder. */
  image?: string;
}

/** Shape returned by the API (Mongo `_id`, plus `timestamps`). */
type ApiService = Omit<Service, "id"> & { _id: string };

const toService = (s: ApiService): Service => ({
  id: s._id,
  title: s.title,
  description: s.description,
  category: s.category,
  duration: s.duration,
  price: s.price,
  image: s.image,
});

export async function listServices(): Promise<Service[]> {
  const data = await apiFetch<{ services: ApiService[] }>("/services");
  return data.services.map(toService);
}

export async function createService(input: ServiceInput): Promise<Service> {
  const data = await apiFetch<{ service: ApiService }>("/services", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return toService(data.service);
}

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<Service> {
  const data = await apiFetch<{ service: ApiService }>(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return toService(data.service);
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch<{ message: string }>(`/services/${id}`, { method: "DELETE" });
}
