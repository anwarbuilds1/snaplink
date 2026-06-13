import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import logger from "./utils/logger.js";
import { startJobs } from "./jobs/index.js";

// import Url from "./models/Url.js";
// import User from "./models/User.js";
// import Analytics from "./models/Analytics.js";
const startServer = async () => {
  await connectDB();
  try {
    await connectRedis();
  } catch (error) {
    logger.warn("Redis unavailable. Running without cache.");
  }

  startJobs();
  app.listen(env.PORT, () => {
    logger.info({
      port: env.PORT,
      environment: env.NODE_ENV,
      message: "Server started",
    });
  });
};

startServer();
