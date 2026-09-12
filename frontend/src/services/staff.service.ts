import { apiFetch } from "@/lib/api";
import type { StaffInput } from "@/schemas/staff.validator";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  services: string[];
  workingDays: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  workingHours: {
    start: string;
    end: string;
  };
  status: "active" | "inactive";
}

type ApiStaff = Omit<Staff, "id"> & {
  _id: string;
};

const toStaff = (s: ApiStaff): Staff => ({
  id: s._id,
  name: s.name,
  email: s.email,
  phone: s.phone,
  experience: s.experience,
  services: s.services,
  workingDays: s.workingDays,
  workingHours: s.workingHours,
  status: s.status,
});

export async function listStaffs(): Promise<Staff[]> {
  const data = await apiFetch<{ staffs: ApiStaff[] }>("/staff");
  return data.staffs.map(toStaff);
}

export async function createStaff(input: StaffInput): Promise<Staff> {
  const data = await apiFetch<{ staff: ApiStaff }>("/staff", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return toStaff(data.staff);
}

export async function updateStaff(
  id: string,
  input: StaffInput,
): Promise<Staff> {
  const data = await apiFetch<{ staff: ApiStaff }>(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return toStaff(data.staff);
}

export async function deleteStaff(id: string): Promise<void> {
  await apiFetch<{ message: string }>(`/staff/${id}`, { method: "DELETE" });
}