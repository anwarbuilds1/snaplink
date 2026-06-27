import cron from "node-cron";
import deleteExpiredUrlsJob from "./deleteExpiredUrls.job.js";
import analyticsAggregationJob from "./analyticsAggregation.job.js";
import logger from "../utils/logger.js";

export const startJobs = () => {
  const jobs = [];

  const deleteExpiredUrlsTask = cron.schedule(
    "0 * * * *",
    async () => {
      try {
        logger.info({
          event: "RUN_DELETE_EXPIRED_URLS_JOB",
        });

        await deleteExpiredUrlsJob();

        logger.info({
          event: "DELETE_EXPIRED_URLS_JOB_COMPLETED",
        });
      } catch (error) {
        logger.error({
          event: "DELETE_EXPIRED_URLS_JOB_FAILED",
          message: error.message,
        });
      }
    },
    {
      scheduled: false,
    },
  );

  const analyticsAggregationTask = cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        logger.info({
          event: "RUN_ANALYTICS_AGGREGATION_JOB",
        });

        await analyticsAggregationJob();

        logger.info({
          event: "ANALYTICS_AGGREGATION_JOB_COMPLETED",
        });
      } catch (error) {
        logger.error({
          event: "ANALYTICS_AGGREGATION_JOB_FAILED",
          message: error.message,
        });
      }
    },
    {
      scheduled: false,
    },
  );

  deleteExpiredUrlsTask.start();
  analyticsAggregationTask.start();

  jobs.push(deleteExpiredUrlsTask);
  jobs.push(analyticsAggregationTask);

  logger.info({
    event: "CRON_JOBS_STARTED",
    count: jobs.length,
  });

  return jobs;
};
