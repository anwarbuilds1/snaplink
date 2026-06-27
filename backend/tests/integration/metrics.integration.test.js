import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import app from "../../src/app.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();

  await mongoServer.stop();
});

describe("Metrics Endpoint", () => {
  it("should expose Prometheus metrics", async () => {
    const response = await request(app).get("/api/v1/metrics");

    expect(response.status).toBe(200);

    expect(response.headers["content-type"]).toContain("text/plain");

    expect(response.text).toContain("http_requests_total");
    expect(response.text).toContain("http_request_duration_seconds");
    expect(response.text).toContain("mongodb_up");
    expect(response.text).toContain("redis_up");
  });

  it("should expose request metrics after serving requests", async () => {
    await request(app).get("/system/health");

    const response = await request(app).get("/api/v1/metrics");

    expect(response.status).toBe(200);

    expect(response.text).toContain("http_requests_total");
  });
});
