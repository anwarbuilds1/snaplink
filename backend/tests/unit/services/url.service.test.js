import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/url.repository.js", () => ({
  findByShortCode: vi.fn(),
  createUrl: vi.fn(),
}));

import * as urlRepository from "../../../src/repositories/url.repository.js";
import { createShortUrl } from "../../../src/services/url.Service.js";

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
