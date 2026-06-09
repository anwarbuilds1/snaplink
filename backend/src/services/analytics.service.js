import * as analyticsRepository from "../repositories/analytics.repository.js";
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
