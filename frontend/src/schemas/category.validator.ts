import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Please enter your name.")
    .min(3, "Name must be at least 3 characters long.")
    .max(20, "Name cannot be longer than 20 characters."),

  description: z
    .string()
    .trim()
    .nonempty("Please enter a description.")
    .min(10, "Description must be at least 10 characters long.")
    .max(300, "Description cannot be longer than 300 characters."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
