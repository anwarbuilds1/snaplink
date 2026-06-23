import { isDatabaseConnected } from "../config/database.js";

import { isRedisConnected } from "../config/redis.js";

export const health = (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
  });
};

export const readiness = (req, res) => {
  const ready = isDatabaseConnected && isRedisConnected;

  return res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? "READY" : "NOT_READY",
    services: {
      database: isDatabaseConnected ? "UP" : "DOWN",

      redis: isRedisConnected ? "UP" : "DOWN",
    },
  });
};
