import redisClient from "../config/redis.js";

export const getCache = async (key) => {
  if (!redisClient.isOpen) return null;

  return redisClient.get(key);
};

export const setCache = async (key, value, ttl = 3600) => {
  if (!redisClient.isOpen) return;

  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};

export const deleteCache = async (key) => {
  if (!redisClient.isOpen) return;

  await redisClient.del(key);
};
