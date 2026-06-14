import * as analyticsRepository from "../repositories/analytics.repository.js";
import * as analyticsSummaryRepository from "../repositories/analyticsSummary.repository.js";

import logger from "../utils/logger.js";

const countOccurrences = (items) => {
  return items.reduce((acc, item) => {
    const key = item || "unknown";

    acc[key] = (acc[key] || 0) + 1;

    return acc;
  }, {});
};

const analyticsAggregationJob = async () => {
  try {
    const analytics = await analyticsRepository.getDailyAnalyticsAggregation();

    for (const item of analytics) {
      await analyticsSummaryRepository.upsertSummary({
        urlId: item._id.urlId,
        date: item._id.date,
        totalClicks: item.totalClicks,
        browsers: countOccurrences(item.browsers),
        operatingSystems: countOccurrences(item.operatingSystems),
      });
    }

    logger.info({
      event: "ANALYTICS_AGGREGATION_COMPLETED",
      processed: analytics.length,
    });
  } catch (error) {
    logger.error({
      event: "ANALYTICS_AGGREGATION_FAILED",
      message: error.message,
    });
  }
};

export default analyticsAggregationJob;
