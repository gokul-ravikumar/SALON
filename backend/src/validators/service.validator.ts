import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Please enter a service title.")
    .min(2, "Title must be at least 2 characters long.")
    .max(80, "Title cannot be longer than 80 characters."),

  description: z
    .string()
    .trim()
    .nonempty("Please enter a description.")
    .min(10, "Description must be at least 10 characters long.")
    .max(300, "Description cannot be longer than 300 characters."),

  category: z.string().trim().nonempty("Please choose a category."),

  duration: z
    .string()
    .trim()
    .nonempty("Please enter a duration.")
    .regex(/\d/, "Use a format like “45 min” or “1h 30m”.")
    .regex(
      /^(\d+\s*h(?:rs?)?)?\s*(\d+\s*m(?:in(?:s)?)?)?$/i,
      "Use a format like “45 min” or “1h 30m”.",
    ),

  price: z
    .number({ message: "Please enter a price." })
    .positive("Price must be greater than 0.")
    .max(100000, "Price looks too large."),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
