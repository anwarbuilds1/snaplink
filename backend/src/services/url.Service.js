import { generateShortCode } from "../utils/generateShortCode.js";
import * as urlRepository from "../repositories/url.repository.js";

export const createShortUrl = async (userId, originalUrl) => {
  const shortCode = generateShortCode();

  const url = await urlRepository.createUrl({
    userId,
    originalUrl,
    shortCode,
  });

  return url;
};

export const getMyUrls = async (userId) => {
  return urlRepository.findByUserId(userId);
};
