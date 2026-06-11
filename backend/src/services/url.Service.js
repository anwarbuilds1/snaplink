import { generateShortCode } from "../utils/generateShortCode.js";
import * as urlRepository from "../repositories/url.repository.js";
import { deleteCache } from "../cache/redisCache.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const createShortUrl = async (userId, originalUrl, customAlias) => {
  let shortCode;

  if (customAlias) {
    const existingUrl = await urlRepository.findByShortCode(customAlias);

    if (existingUrl) {
      throw new AppError("Custom alias already exists", 409);
    }

    shortCode = customAlias;
  } else {
    shortCode = generateShortCode();
  }

  const url = await urlRepository.createUrl({
    userId,
    originalUrl,
    shortCode,
  });

  return url;
};

export const updateUrl = async (urlId, userId, originalUrl) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new AppError("Invalid URL ID", 400);
  }
  const url = await urlRepository.findById(urlId);

  if (!url) {
    throw new AppError("URL not found", 404);
  }

  if (url.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const updatedUrl = await urlRepository.updateUrl(urlId, {
    originalUrl,
  });

  await deleteCache(`url:${url.shortCode}`);

  return updatedUrl;
};

export const deleteUrl = async (urlId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new AppError("Invalid URL ID", 400);
  }
  const url = await urlRepository.findById(urlId);

  if (!url) {
    throw new AppError("URL not found", 404);
  }

  if (url.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await urlRepository.deleteUrl(urlId);
  await deleteCache(`url:${url.shortCode}`);
};
export const getMyUrls = async (userId) => {
  return urlRepository.findByUserId(userId);
};

export const getUrlById = async (urlId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    throw new AppError("Invalid URL ID", 400);
  }
  const url = await urlRepository.findById(urlId);

  if (!url) {
    throw new AppError("URL not found", 404);
  }

  if (url.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return url;
};
