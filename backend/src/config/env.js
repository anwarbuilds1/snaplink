import "dotenv/config";
import { z } from "zod";

const isTest = process.env.NODE_ENV === "test";

const envSchema = z.object({
  PORT: z.string().default("5000"),

  MONGODB_URI: isTest ? z.string().optional() : z.string().min(1),

  REDIS_URL: isTest ? z.string().optional() : z.string().min(1),

  JWT_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: isTest ? z.string().optional() : z.string().min(10),

  JWT_EXPIRES_IN: z.string().default("15m"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  BASE_URL: isTest
    ? z.string().default("http://localhost:5000")
    : z.string().url(),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = parsed.data;
