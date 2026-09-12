import { z } from "zod";

export const createStaffSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Please enter your name.")
    .min(3, "Name must be at least 3 characters long.")
    .max(20, "Name cannot be longer than 20 characters."),

  email: z.email("Please enter a valid email address.").trim().toLowerCase(),

  phone: z
    .string()
    .trim()
    .nonempty("Please enter your phone number.")
    .regex(
      /^(?:\+91\s?)?(?:[6-9]\d(?:\s?\d){8})$/,
      "Please enter a valid phone number.",
    ),

  experience: z.number().min(0, "Experience cannot be negative."),

  services: z.array(z.string()).min(1, "Please select at least one service."),

  workingDays: z
    .array(
      z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]),
    )
    .min(1, "Please select at least one working day."),

  workingHours: z.object({
    start: z.string(),
    end: z.string(),
  }),

  status: z.enum(["active", "inactive"]),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
