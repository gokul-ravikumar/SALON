import { apiFetch } from "@/lib/api";
import type { CategoryInput } from "@/schemas/category.validator";

export interface Category {
  id: string;
  name: string;
  description: string;
}

type ApiCategory = Omit<Category, "id"> & {
  _id: string;
};

const toCategory = (c: ApiCategory): Category => ({
  id: c._id,
  name: c.name,
  description: c.description,
});

export async function listCategories(): Promise<Category[]> {
  const data = await apiFetch<{ category: ApiCategory[] }>("/category");
  return data.category.map(toCategory);
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const data = await apiFetch<{ category: ApiCategory }>("/category", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return toCategory(data.category);
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  const data = await apiFetch<{ category: ApiCategory }>(`/category/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return toCategory(data.category);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<{ message: string }>(`/category/${id}`, { method: "DELETE" });
}