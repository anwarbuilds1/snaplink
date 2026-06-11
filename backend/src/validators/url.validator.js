import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),

  customAlias: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, hyphens and underscores are allowed",
    )
    .optional(),
});

export const updateUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

export const shortCodeParamSchema = z.object({
  shortCode: z.string().trim().min(1, "Short code is required"),
});

export const urlIdParamSchema = z.object({
  urlId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid URL id"),
});
