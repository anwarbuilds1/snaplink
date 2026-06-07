import "dotenv/config";

export const env = {
  PORT: process.env.PORT || "5000",
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
