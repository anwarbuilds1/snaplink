import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/analytics.repository.js", () => ({
  createAnalyticsEvent: vi.fn(),
  getBrowserStats: vi.fn(),
  getOsStats: vi.fn(),
}));

vi.mock("../../../src/repositories/url.repository.js", () => ({
  findById: vi.fn(),
  getTotalUrlsByUser: vi.fn(),
  getTotalClicksByUser: vi.fn(),
  getTopUrlByUser: vi.fn(),
}));

vi.mock("../../../src/utils/extractDeviceInfo.js", () => ({
  extractDeviceInfo: vi.fn(),
}));

import * as analyticsRepository from "../../../src/repositories/analytics.repository.js";
import * as urlRepository from "../../../src/repositories/url.repository.js";

import { extractDeviceInfo } from "../../../src/utils/extractDeviceInfo.js";

import {
  trackClick,
  getUrlAnalytics,
  getDashboardStats,
} from "../../../src/services/analytics.service.js";

describe("trackClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create analytics event", async () => {
    extractDeviceInfo.mockReturnValue({
      browser: "chrome",
      os: "linux",
    });

    await trackClick("url123", {
      userAgent: "Mozilla",
      referrer: "google.com",
    });

    expect(analyticsRepository.createAnalyticsEvent).toHaveBeenCalledWith({
      urlId: "url123",
      browser: "chrome",
      os: "linux",
      userAgent: "Mozilla",
      referrer: "google.com",
    });
  });
});

describe("getUrlAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return formatted analytics", async () => {
    urlRepository.findById.mockResolvedValue({
      _id: "url123",
      userId: {
        toString: () => "user123",
      },
    });

    analyticsRepository.getBrowserStats.mockResolvedValue([
      { _id: "chrome", count: 10 },
      { _id: "firefox", count: 5 },
    ]);

    analyticsRepository.getOsStats.mockResolvedValue([
      { _id: "linux", count: 8 },
      { _id: "windows", count: 7 },
    ]);

    const result = await getUrlAnalytics("url123", "user123");

    expect(result).toEqual({
      totalClicks: 15,

      topBrowsers: {
        chrome: 10,
        firefox: 5,
      },

      topOperatingSystems: {
        linux: 8,
        windows: 7,
      },
    });
  });

  it("should throw forbidden when user does not own url", async () => {
    urlRepository.findById.mockResolvedValue({
      _id: "url123",
      userId: {
        toString: () => "another-user",
      },
    });

    await expect(getUrlAnalytics("url123", "user123")).rejects.toThrow(
      "Forbidden",
    );
  });
});

describe("getDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dashboard statistics", async () => {
    urlRepository.getTotalUrlsByUser.mockResolvedValue(5);

    urlRepository.getTotalClicksByUser.mockResolvedValue(100);

    urlRepository.getTopUrlByUser.mockResolvedValue({
      shortCode: "abc123",
      clickCount: 50,
    });

    const result = await getDashboardStats("user123");

    expect(result).toEqual({
      totalUrls: 5,
      totalClicks: 100,
      topUrl: {
        shortCode: "abc123",
        clicks: 50,
      },
    });
  });

  it("should return null topUrl when user has no urls", async () => {
    urlRepository.getTotalUrlsByUser.mockResolvedValue(0);

    urlRepository.getTotalClicksByUser.mockResolvedValue(0);

    urlRepository.getTopUrlByUser.mockResolvedValue(null);

    const result = await getDashboardStats("user123");

    expect(result).toEqual({
      totalUrls: 0,
      totalClicks: 0,
      topUrl: null,
    });
  });
});
