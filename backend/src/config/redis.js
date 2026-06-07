import { createClient } from "redis";

const createRedisClient = (redisUrl) => {
  if (!redisUrl) {
    throw new Error("REDIS_URL is required");
  }

  return createClient({ url: redisUrl });
};

export default createRedisClient;
