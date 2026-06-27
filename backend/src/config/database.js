import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";
import { mongoStatus } from "../metrics/metrics.js";

export let isDatabaseConnected = false;

// MongoDB Connection Events
mongoose.connection.on("connected", () => {
  isDatabaseConnected = true;
  mongoStatus.set(1);

  logger.info({
    event: "DATABASE_CONNECTED",
  });
});

mongoose.connection.on("disconnected", () => {
  isDatabaseConnected = false;
  mongoStatus.set(0);

  logger.warn({
    event: "DATABASE_DISCONNECTED",
  });
});

mongoose.connection.on("error", (error) => {
  isDatabaseConnected = false;
  mongoStatus.set(0);

  logger.error({
    event: "DATABASE_ERROR",
    message: error.message,
  });
});

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    isDatabaseConnected = false;
    logger.error({
      event: "DATABASE_CONNECTION_FAILED",
      message: error.message,
    });

    process.exit(1);
  }
};
