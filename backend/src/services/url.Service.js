import { generateShortCode } from "../utils/generateShortCode.js";
import * as urlRepository from "../repositories/url.repository.js";
import { setCache } from "../cache/redisCache.js";

export const createShortUrl = async (originalUrl) => {
  const shortCode = generateShortCode();

  const url = await urlRepository.createUrl({
    originalUrl,
    shortCode,
  });

  // await setCache(`url:${shortCode}`, {
  //   id: url._id.toString(),
  //   originalUrl: url.originalUrl,
  // });

  return url;
};
