import * as analyticsRepository from "../repositories/analytics.repository.js";
import { extractDeviceInfo } from "../utils/extractDeviceInfo.js";

export const trackClick = async (urlId, req) => {
  const userAgent = req.headers["user-agent"] || "";

  const referrer = req.headers.referer || "direct";

  const { browser, os } = extractDeviceInfo(userAgent);

  await analyticsRepository.createAnalyticsEvent({
    urlId,
    browser,
    os,
    userAgent,
    referrer,
  });
};
