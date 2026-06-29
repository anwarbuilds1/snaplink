import { z } from "zod";

const isTest = process.env.NODE_ENV === "test";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  captchaToken: isTest ? z.string().optional() : z.string().min(1, "CAPTCHA token is required"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(0),
  captchaToken: isTest ? z.string().optional() : z.string().min(1, "CAPTCHA token is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
