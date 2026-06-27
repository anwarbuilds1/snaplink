import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

import app from "../../src/app.js";
import { connectDB } from "../../src/config/database.js";
import mongoose from "mongoose";

describe("Metrics Endpoint", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should expose Prometheus metrics", async () => {
    const response = await request(app).get("/api/v1/metrics");

    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toContain("text/plain");

    expect(response.text).toContain("http_requests_total");

    expect(response.text).toContain("http_request_duration_seconds");

    expect(response.text).toContain("mongodb_up");

    expect(response.text).toContain("redis_up");
  });

  it("should increment request metrics", async () => {
    await request(app).get("/health");

    const response = await request(app).get("/api/v1/metrics");

    expect(response.text).toContain("http_requests_total");
  });
});
