import * as urlRepository from "../repositories/url.repository.js";
import * as analyticsService from "./analytics.service.js";
import AppError from "../utils/AppError.js";

export const getOriginalUrl = async (shortCode, req) => {
  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  await urlRepository.incrementClickCount(url._id);
  await analyticsService.trackClick(url._id, req);
  return url.originalUrl;
};
