import * as analyticsRepository from "../repositories/analytics.repository.js";
import * as urlRepository from "../repositories/url.repository.js";

import { extractDeviceInfo } from "../utils/extractDeviceInfo.js";

export const trackClick = async (urlId, clickContext) => {
  const { userAgent, referrer } = clickContext;
  const { browser, os } = extractDeviceInfo(userAgent);

  await analyticsRepository.createAnalyticsEvent({
    urlId,
    browser,
    os,
    userAgent,
    referrer,
  });
};

const formatStats = (stats) => {
  return stats.reduce((acc, item) => {
    acc[item._id || "unknown"] = item.count;
    return acc;
  }, {});
};

export const getUrlAnalytics = async (urlId) => {
  const docs = await analyticsRepository.getAnalyticsByUrlId(urlId);

  console.log("Analytics Docs:", docs);
  const browserStats = await analyticsRepository.getBrowserStats(urlId);

  const osStats = await analyticsRepository.getOsStats(urlId);

  const totalClicks = browserStats.reduce((sum, item) => sum + item.count, 0);

  return {
    totalClicks,
    topBrowsers: formatStats(browserStats),
    topOperatingSystems: formatStats(osStats),
  };
};

export const getDashboardStats = async () => {
  const totalUrls = await urlRepository.getTotalUrls();

  const totalClicks = await urlRepository.getTotalClicks();

  return {
    totalUrls,
    totalClicks,
  };
};
