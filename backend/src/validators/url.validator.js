import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

export const shortCodeParamSchema = z.object({
  shortCode: z.string().trim().min(1, "Short code is required"),
});
