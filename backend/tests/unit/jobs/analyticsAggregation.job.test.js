import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/analytics.repository.js", () => ({
  getDailyAnalyticsAggregation: vi.fn(),
}));

vi.mock("../../../src/repositories/analyticsSummary.repository.js", () => ({
  upsertSummary: vi.fn(),
}));

vi.mock("../../../src/utils/logger.js", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import * as analyticsRepository from "../../../src/repositories/analytics.repository.js";

import * as analyticsSummaryRepository from "../../../src/repositories/analyticsSummary.repository.js";

import logger from "../../../src/utils/logger.js";

import analyticsAggregationJob from "../../../src/jobs/analyticsAggregation.job.js";

describe("analyticsAggregationJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do nothing when no analytics data exists", async () => {
    analyticsRepository.getDailyAnalyticsAggregation.mockResolvedValue([]);

    await analyticsAggregationJob();

    expect(analyticsSummaryRepository.upsertSummary).not.toHaveBeenCalled();
  });

  it("should aggregate analytics and save summary", async () => {
    analyticsRepository.getDailyAnalyticsAggregation.mockResolvedValue([
      {
        _id: {
          urlId: "123",
          date: "2026-06-20",
        },
        totalClicks: 3,
        browsers: ["chrome", "chrome", "firefox"],
        operatingSystems: ["linux", "linux", "windows"],
      },
    ]);

    await analyticsAggregationJob();

    expect(analyticsSummaryRepository.upsertSummary).toHaveBeenCalledWith({
      urlId: "123",
      date: "2026-06-20",

      totalClicks: 3,

      browsers: {
        chrome: 2,
        firefox: 1,
      },

      operatingSystems: {
        linux: 2,
        windows: 1,
      },
    });
  });

  it("should handle repository errors gracefully", async () => {
    analyticsRepository.getDailyAnalyticsAggregation.mockRejectedValue(
      new Error("Database Error"),
    );

    await expect(analyticsAggregationJob()).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalled();
  });
});
