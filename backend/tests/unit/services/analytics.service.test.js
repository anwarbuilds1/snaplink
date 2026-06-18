import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/analytics.repository.js", () => ({
  createAnalyticsEvent: vi.fn(),
  getBrowserStats: vi.fn(),
  getOsStats: vi.fn(),
}));

vi.mock("../../../src/utils/extractDeviceInfo.js", () => ({
  extractDeviceInfo: vi.fn(),
}));

import * as analyticsRepository from "../../../src/repositories/analytics.repository.js";

import { extractDeviceInfo } from "../../../src/utils/extractDeviceInfo.js";

import {
  trackClick,
  getUrlAnalytics,
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
    analyticsRepository.getBrowserStats.mockResolvedValue([
      { _id: "chrome", count: 10 },
      { _id: "firefox", count: 5 },
    ]);

    analyticsRepository.getOsStats.mockResolvedValue([
      { _id: "linux", count: 8 },
      { _id: "windows", count: 7 },
    ]);

    const result = await getUrlAnalytics("url123");

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
});
