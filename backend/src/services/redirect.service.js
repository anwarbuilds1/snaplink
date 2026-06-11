import * as urlRepository from "../repositories/url.repository.js";
import * as analyticsService from "./analytics.service.js";

import AppError from "../utils/AppError.js";

import { getCache, setCache } from "../cache/redisCache.js";

export const getOriginalUrl = async (shortCode, clickContext) => {
  const cacheKey = `url:${shortCode}`;

  const cachedUrl = await getCache(cacheKey);

  if (cachedUrl) {
    console.log("CACHE HIT");

    const data = JSON.parse(cachedUrl);
    console.log("NOW:", new Date());
    console.log("EXPIRES:", data.expiresAt);
    console.log("EXPIRED:", data.expiresAt < new Date());

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      await deleteCache(cacheKey);

      throw new AppError("URL has expired", 410);
    }

    await urlRepository.incrementClickCount(data.id);

    await analyticsService.trackClick(data.id, clickContext);

    return data.originalUrl;
  }

  console.log("CACHE MISS");

  const url = await urlRepository.findByShortCode(shortCode);
  console.log("NOW:", new Date());
  console.log("EXPIRES:", url.expiresAt);
  console.log("EXPIRED:", url.expiresAt < new Date());

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    await deleteCache(cacheKey);

    throw new AppError("URL has expired", 410);
  }

  await urlRepository.incrementClickCount(url._id);

  await analyticsService.trackClick(url._id, clickContext);

  await setCache(cacheKey, {
    id: url._id.toString(),
    originalUrl: url.originalUrl,
    expiresAt: url.expiresAt,
  });

  return url.originalUrl;
};
