import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import logger from "./utils/logger.js";
import { startJobs } from "./jobs/index.js";
import { registerGracefulShutdown } from "./utils/gracefulShutdown.js";

const startServer = async () => {
  try {
    await connectDB();

    try {
      await connectRedis();
    } catch {
      logger.warn({
        event: "REDIS_CACHE_DISABLED",
        message: "Redis unavailable. Running without cache.",
      });
    }

    startJobs();

    const server = app.listen(env.PORT, () => {
      logger.info({
        event: "SERVER_STARTED",
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });

    registerGracefulShutdown(server);
  } catch (error) {
    logger.error({
      event: "SERVER_STARTUP_FAILED",
      message: error.message,
    });

    process.exit(1);
  }
};

startServer();
