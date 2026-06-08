import * as urlRepository from "../repositories/url.repository.js";
import AppError from "../utils/AppError.js";

export const getOriginalUrl = async (shortCode) => {
  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  await urlRepository.incrementClickCount(url._id);
  return url.originalUrl;
};
