import { z } from "zod";

export const projectSchema = z.object({
    name: z
        .string()
        .min(1, "Project name is required")
        .max(100, "Project name must be less than 100 characters"),
    key: z
        .string()
        .min(2, "Project key is required")
        .max(10, "Project key must be less than 10 characters"),
    description: z
        .string()
        .max(500, "Project description must be less than 500 characters")
        .optional(),
})