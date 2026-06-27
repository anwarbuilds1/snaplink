import logger from "./logger.js";
import { disconnectDB } from "../config/database.js";
import { disconnectRedis } from "../config/redis.js";

export const registerGracefulShutdown = (server, jobs = []) => {
  let isShuttingDown = false;

  const shutdown = async (signal) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    logger.info({
      event: "GRACEFUL_SHUTDOWN_STARTED",
      signal,
    });

    server.close(async () => {
      logger.info({
        event: "HTTP_SERVER_CLOSED",
      });

      try {
        // Stop scheduled jobs
        for (const job of jobs) {
          job.stop();
        }

        logger.info({
          event: "CRON_JOBS_STOPPED",
        });

        // Close database connection
        await disconnectDB();

        // Close Redis connection
        await disconnectRedis();

        logger.info({
          event: "APPLICATION_SHUTDOWN_COMPLETED",
        });

        process.exit(0);
      } catch (error) {
        logger.error({
          event: "APPLICATION_SHUTDOWN_FAILED",
          message: error.message,
        });

        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error({
        event: "GRACEFUL_SHUTDOWN_TIMEOUT",
      });

      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};
