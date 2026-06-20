import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/url.repository.js", () => ({
  findByShortCode: vi.fn(),
  incrementClickCount: vi.fn(),
}));

vi.mock("../../../src/services/analytics.service.js", () => ({
  trackClick: vi.fn(),
}));

vi.mock("../../../src/cache/redisCache.js", () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  deleteCache: vi.fn(),
}));

import * as urlRepository from "../../../src/repositories/url.repository.js";
import * as analyticsService from "../../../src/services/analytics.service.js";

import {
  getCache,
  setCache,
  deleteCache,
} from "../../../src/cache/redisCache.js";

import { getOriginalUrl } from "../../../src/services/redirect.service.js";

describe("getOriginalUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return url from cache", async () => {
    getCache.mockResolvedValue(
      JSON.stringify({
        id: "123",
        originalUrl: "https://google.com",
        expiresAt: null,
      }),
    );

    const result = await getOriginalUrl("google", {
      userAgent: "Mozilla",
      referrer: "google.com",
    });

    expect(result).toBe("https://google.com");

    expect(urlRepository.findByShortCode).not.toHaveBeenCalled();

    expect(urlRepository.incrementClickCount).toHaveBeenCalledWith("123");

    expect(analyticsService.trackClick).toHaveBeenCalledWith("123", {
      userAgent: "Mozilla",
      referrer: "google.com",
    });
  });

  it("should return url and cache it on cache miss", async () => {
    getCache.mockResolvedValue(null);

    const url = {
      _id: "123",
      originalUrl: "https://google.com",
      shortCode: "google",
      expiresAt: null,
    };

    urlRepository.findByShortCode.mockResolvedValue(url);

    const result = await getOriginalUrl("google", {
      userAgent: "Mozilla",
      referrer: "google.com",
    });

    expect(result).toBe("https://google.com");

    expect(urlRepository.findByShortCode).toHaveBeenCalledWith("google");

    expect(urlRepository.incrementClickCount).toHaveBeenCalledWith("123");

    expect(analyticsService.trackClick).toHaveBeenCalledWith("123", {
      userAgent: "Mozilla",
      referrer: "google.com",
    });

    expect(setCache).toHaveBeenCalledWith("url:google", {
      id: "123",
      originalUrl: "https://google.com",
      expiresAt: null,
    });
  });

  it("should throw error if cached url is expired", async () => {
    getCache.mockResolvedValue(
      JSON.stringify({
        id: "123",
        originalUrl: "https://google.com",
        expiresAt: "2020-01-01T00:00:00.000Z",
      }),
    );

    await expect(
      getOriginalUrl("google", {
        userAgent: "Mozilla",
        referrer: "google.com",
      }),
    ).rejects.toThrow("URL has expired");

    expect(deleteCache).toHaveBeenCalledWith("url:google");

    expect(urlRepository.incrementClickCount).not.toHaveBeenCalled();
  });

  it("should throw error if database url is expired", async () => {
    getCache.mockResolvedValue(null);

    urlRepository.findByShortCode.mockResolvedValue({
      _id: "123",
      originalUrl: "https://google.com",
      shortCode: "google",
      expiresAt: new Date("2020-01-01"),
    });

    await expect(
      getOriginalUrl("google", {
        userAgent: "Mozilla",
        referrer: "google.com",
      }),
    ).rejects.toThrow("URL has expired");

    expect(deleteCache).toHaveBeenCalledWith("url:google");

    expect(urlRepository.incrementClickCount).not.toHaveBeenCalled();
  });

  it("should throw error if short url does not exist", async () => {
    getCache.mockResolvedValue(null);

    urlRepository.findByShortCode.mockResolvedValue(null);

    await expect(
      getOriginalUrl("google", {
        userAgent: "Mozilla",
        referrer: "google.com",
      }),
    ).rejects.toThrow("Short URL not found");

    expect(urlRepository.findByShortCode).toHaveBeenCalledWith("google");

    expect(urlRepository.incrementClickCount).not.toHaveBeenCalled();

    expect(analyticsService.trackClick).not.toHaveBeenCalled();
  });
});
