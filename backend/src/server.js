import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import logger from "./utils/logger.js";
import { startJobs } from "./jobs/index.js";

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Connect Redis (optional dependency)
    try {
      await connectRedis();
    } catch {
      logger.warn({
        event: "REDIS_CACHE_DISABLED",
        message: "Redis unavailable. Running without cache.",
      });
    }

    // Start background jobs
    startJobs();

    // Start HTTP server
    app.listen(env.PORT, () => {
      logger.info({
        event: "SERVER_STARTED",
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.error({
      event: "SERVER_STARTUP_FAILED",
      message: error.message,
    });

    process.exit(1);
  }
};

startServer();
