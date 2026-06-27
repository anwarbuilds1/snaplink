import { createClient } from "redis";
import { env } from "./env.js";
import logger from "../utils/logger.js";
import { redisStatus } from "../metrics/metrics.js";

export let isRedisConnected = false;

export let isRedisConnected = false;
const redisClient = createClient({
  url: env.REDIS_URL,
});

// Redis Connection Events
redisClient.on("ready", () => {
  isRedisConnected = true;
  redisStatus.set(1);

  logger.info({
    event: "REDIS_READY",
  });
});

redisClient.on("end", () => {
  isRedisConnected = false;
  redisStatus.set(0);

  logger.warn({
    event: "REDIS_DISCONNECTED",
  });
});

redisClient.on("error", (error) => {
  isRedisConnected = false;
  redisStatus.set(0);

  logger.error({
    event: "REDIS_ERROR",
    message: error.message,
  });
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    isRedisConnected = false;
    redisStatus.set(0);

    logger.error({
      event: "REDIS_CONNECTION_FAILED",
      message: error.message,
    });

    throw error;
  }
};

export default redisClient;
