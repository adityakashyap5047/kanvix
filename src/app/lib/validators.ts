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
});

export const sprintSchema = z.object({
    name: z.string().min(1, "Sprint name is required").max(100, "Sprint name must be less than 100 characters"),
    startDate: z.date(),
    endDate: z.date()
});

export const issueSchema = z.object({
    title: z.string().min(1, "Issue title is required").max(200, "Issue title must be less than 200 characters"),
    assigneeId: z.string().cuid("Please select assignee"),
    description: z.string().max(1000, "Issue description must be less than 1000 characters").optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})