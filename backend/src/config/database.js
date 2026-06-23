import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

export let isDatabaseConnected = false;
export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    isDatabaseConnected = true;
    logger.info({
      event: "DATABASE_CONNECTED",
    });
  } catch (error) {
    isDatabaseConnected = false;
    logger.error({
      event: "DATABASE_CONNECTION_FAILED",
      message: error.message,
    });

    process.exit(1);
  }
};
