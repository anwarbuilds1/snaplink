import cron from "node-cron";
import deleteExpiredUrlsJob from "./deleteExpiredUrls.job.js";
import analyticsAggregationJob from "./analyticsAggregation.job.js";
import logger from "../utils/logger.js";

export const startJobs = () => {
  cron.schedule("0 * * * *", async () => {
    logger.info({
      event: "RUN_DELETE_EXPIRED_URLS_JOB",
    });

    await deleteExpiredUrlsJob();
  });
};

cron.schedule("0 0 * * *", async () => {
  await analyticsAggregationJob();
});
