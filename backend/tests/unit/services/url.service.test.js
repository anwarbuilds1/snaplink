import { describe, it, expect } from "vitest";
import { createShortUrl } from "../../../src/services/url.Service.js";

describe("createShortUrl", () => {
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
});
