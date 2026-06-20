import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/url.repository.js", () => ({
  findExpiredUrls: vi.fn(),
  deleteManyUrls: vi.fn(),
}));

vi.mock("../../../src/cache/redisCache.js", () => ({
  deleteCache: vi.fn(),
}));

vi.mock("../../../src/utils/logger.js", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import * as urlRepository from "../../../src/repositories/url.repository.js";

import { deleteCache } from "../../../src/cache/redisCache.js";

import deleteExpiredUrlsJob from "../../../src/jobs/deleteExpiredUrls.job.js";

import logger from "../../../src/utils/logger.js";

describe("deleteExpiredUrlsJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do nothing when no expired urls exist", async () => {
    urlRepository.findExpiredUrls.mockResolvedValue([]);

    await deleteExpiredUrlsJob();

    expect(urlRepository.deleteManyUrls).not.toHaveBeenCalled();

    expect(deleteCache).not.toHaveBeenCalled();
  });

  it("should delete expired urls and clear cache", async () => {
    const expiredUrls = [
      {
        _id: "1",
        shortCode: "google",
      },
      {
        _id: "2",
        shortCode: "github",
      },
    ];

    urlRepository.findExpiredUrls.mockResolvedValue(expiredUrls);

    await deleteExpiredUrlsJob();

    expect(deleteCache).toHaveBeenCalledWith("url:google");

    expect(deleteCache).toHaveBeenCalledWith("url:github");

    expect(urlRepository.deleteManyUrls).toHaveBeenCalledWith(["1", "2"]);
  });

  it("should handle repository errors gracefully", async () => {
    urlRepository.findExpiredUrls.mockRejectedValue(
      new Error("Database Error"),
    );

    await expect(deleteExpiredUrlsJob()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalled();
  });
});
