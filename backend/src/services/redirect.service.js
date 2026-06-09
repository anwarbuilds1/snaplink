import * as urlRepository from "../repositories/url.repository.js";
import * as analyticsService from "./analytics.service.js";

import AppError from "../utils/AppError.js";

import { getCache, setCache } from "../cache/redisCache.js";

export const getOriginalUrl = async (shortCode, req) => {
  const cacheKey = `url:${shortCode}`;

  const cachedUrl = await getCache(cacheKey);

  if (cachedUrl) {
    console.log("CACHE HIT");

    const data = JSON.parse(cachedUrl);
    await urlRepository.incrementClickCount(data.id);

    await analyticsService.trackClick(data.id, req);

    return data.originalUrl;
  }

  console.log("CACHE MISS");

  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  await urlRepository.incrementClickCount(url._id);

  await analyticsService.trackClick(url._id, req);

  await setCache(cacheKey, {
    id: url._id.toString(),
    originalUrl: url.originalUrl,
  });

  return url.originalUrl;
};
