import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteCache } from "../../../src/cache/redisCache.js";
vi.mock("../../../src/repositories/url.repository.js", () => ({
  findByShortCode: vi.fn(),
  createUrl: vi.fn(),
  findById: vi.fn(),
  updateUrl: vi.fn(),
  deleteUrl: vi.fn(),
}));

vi.mock("../../../src/cache/redisCache.js", () => ({
  deleteCache: vi.fn(),
}));

import * as urlRepository from "../../../src/repositories/url.repository.js";
import {
  createShortUrl,
  updateUrl,
  deleteUrl,
  getUrlById,
} from "../../../src/services/url.Service.js";

describe("createShortUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if expiration date is in the past", async () => {
    await expect(
      createShortUrl(
        "userId",
        "https://google.com",
        null,
        "2020-01-01T00:00:00.000Z",
      ),
    ).rejects.toThrow("Expiration date must be in the future");
  });

  it("should throw error if custom alias already exists", async () => {
    urlRepository.findByShortCode.mockResolvedValue({
      _id: "123",
    });

    await expect(
      createShortUrl("userId", "https://google.com", "google", null),
    ).rejects.toThrow("Custom alias already exists");
  });

  it("should create short url successfully", async () => {
    urlRepository.findByShortCode.mockResolvedValue(null);

    urlRepository.createUrl.mockResolvedValue({
      _id: "123",
      originalUrl: "https://google.com",
      shortCode: "google",
    });

    const result = await createShortUrl(
      "userId",
      "https://google.com",
      "google",
      null,
    );

    expect(result).toEqual({
      _id: "123",
      originalUrl: "https://google.com",
      shortCode: "google",
    });

    expect(urlRepository.findByShortCode).toHaveBeenCalledWith("google");

    expect(urlRepository.createUrl).toHaveBeenCalledTimes(1);
  });
});

describe("updateUrl", () => {
  it("should throw error if url id is invalid", async () => {
    await expect(
      updateUrl("invalid-id", "user123", "https://google.com"),
    ).rejects.toThrow("Invalid URL ID");
  });

  it("should throw error if url does not exist", async () => {
    urlRepository.findById.mockResolvedValue(null);

    await expect(
      updateUrl("6a2c5199d45691f3b7c5f6bf", "user123", "https://google.com"),
    ).rejects.toThrow("URL not found");

    expect(urlRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw error if user does not own the url", async () => {
    urlRepository.findById.mockResolvedValue({
      _id: "6a2c5199d45691f3b7c5f6bf",
      userId: {
        toString: () => "owner123",
      },
    });

    await expect(
      updateUrl(
        "6a2c5199d45691f3b7c5f6bf",
        "differentUser456",
        "https://google.com",
      ),
    ).rejects.toThrow("Forbidden");

    expect(urlRepository.updateUrl).not.toHaveBeenCalled();
  });

  it("should update url successfully", async () => {
    const existingUrl = {
      _id: "6a2c5199d45691f3b7c5f6bf",
      userId: {
        toString: () => "user123",
      },
      shortCode: "google",
    };

    const updatedUrl = {
      ...existingUrl,
      originalUrl: "https://updated.com",
    };

    urlRepository.findById.mockResolvedValue(existingUrl);

    urlRepository.updateUrl.mockResolvedValue(updatedUrl);

    const result = await updateUrl(
      "6a2c5199d45691f3b7c5f6bf",
      "user123",
      "https://updated.com",
    );

    expect(result).toEqual(updatedUrl);

    expect(urlRepository.updateUrl).toHaveBeenCalledWith(
      "6a2c5199d45691f3b7c5f6bf",
      {
        originalUrl: "https://updated.com",
      },
    );

    expect(deleteCache).toHaveBeenCalledWith("url:google");
  });
});

describe("deleteUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if url id is invalid", async () => {
    await expect(deleteUrl("invalid-id", "user123")).rejects.toThrow(
      "Invalid URL ID",
    );
  });

  it("should throw error if url does not exist", async () => {
    urlRepository.findById.mockResolvedValue(null);

    await expect(
      deleteUrl("6a2c5199d45691f3b7c5f6bf", "user123"),
    ).rejects.toThrow("URL not found");

    expect(urlRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw error if user does not own the url", async () => {
    urlRepository.findById.mockResolvedValue({
      _id: "6a2c5199d45691f3b7c5f6bf",
      userId: {
        toString: () => "owner123",
      },
      shortCode: "google",
    });

    await expect(
      deleteUrl("6a2c5199d45691f3b7c5f6bf", "differentUser456"),
    ).rejects.toThrow("Forbidden");

    expect(urlRepository.deleteUrl).not.toHaveBeenCalled();
  });

  it("should delete url successfully", async () => {
    const existingUrl = {
      _id: "6a2c5199d45691f3b7c5f6bf",
      userId: {
        toString: () => "user123",
      },
      shortCode: "google",
    };

    urlRepository.findById.mockResolvedValue(existingUrl);

    await deleteUrl("6a2c5199d45691f3b7c5f6bf", "user123");

    expect(urlRepository.deleteUrl).toHaveBeenCalledWith(
      "6a2c5199d45691f3b7c5f6bf",
    );

    expect(deleteCache).toHaveBeenCalledWith("url:google");
  });
});

describe("getUrlById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if url id is invalid", async () => {
    await expect(getUrlById("invalid-id", "user123")).rejects.toThrow(
      "Invalid URL ID",
    );
  });

  it("should throw error if url does not exist", async () => {
    urlRepository.findById.mockResolvedValue(null);

    await expect(
      getUrlById("6a2c5199d45691f3b7c5f6bf", "user123"),
    ).rejects.toThrow("URL not found");

    expect(urlRepository.findById).toHaveBeenCalledWith(
      "6a2c5199d45691f3b7c5f6bf",
    );
  });

  it("should throw error if user does not own the url", async () => {
    urlRepository.findById.mockResolvedValue({
      _id: "6a2c5199d45691f3b7c5f6bf",
      userId: {
        toString: () => "owner123",
      },
    });

    await expect(
      getUrlById("6a2c5199d45691f3b7c5f6bf", "differentUser456"),
    ).rejects.toThrow("Forbidden");
  });

  it("should return url successfully", async () => {
    const url = {
      _id: "6a2c5199d45691f3b7c5f6bf",
      shortCode: "google",
      originalUrl: "https://google.com",
      userId: {
        toString: () => "user123",
      },
    };

    urlRepository.findById.mockResolvedValue(url);

    const result = await getUrlById("6a2c5199d45691f3b7c5f6bf", "user123");

    expect(result).toEqual(url);

    expect(urlRepository.findById).toHaveBeenCalledWith(
      "6a2c5199d45691f3b7c5f6bf",
    );
  });
});
