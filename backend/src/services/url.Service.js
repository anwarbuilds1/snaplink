import { generateShortCode } from "../utils/generateShortCode.js";
import * as urlRepository from "../repositories/url.repository.js";

export const createShortUrl = async (originalUrl) => {
  const shortCode = generateShortCode();

  const url = await urlRepository.createUrl({
    originalUrl,
    shortCode,
  });

  return url;
};
