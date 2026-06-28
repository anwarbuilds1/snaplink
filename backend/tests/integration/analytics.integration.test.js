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

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const createUserAndUrl = async () => {
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    });

  const token = registerResponse.body.data.accessToken;

  const createUrlResponse = await request(app)
    .post("/api/v1/urls")
    .set("Authorization", `Bearer ${token}`)
    .send({
      originalUrl: "https://github.com",
    });

  const url = createUrlResponse.body.data;

  // Generate one analytics record through the public redirect route.
  await request(app).get(`/r/${url.shortCode}`).redirects(0);

  return {
    token,
    urlId: url._id,
  };
};

describe("GET /api/v1/analytics/:urlId", () => {
  it("should return analytics for a url", async () => {
    const { token, urlId } = await createUserAndUrl();

    const response = await request(app)
      .get(`/api/v1/analytics/${urlId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.totalClicks).toBe(1);
  });

  it("should reject unauthenticated requests", async () => {
    const { urlId } = await createUserAndUrl();

    const response = await request(app).get(`/api/v1/analytics/${urlId}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return 404 for an unknown url", async () => {
    const { token } = await createUserAndUrl();

    const response = await request(app)
      .get(`/api/v1/analytics/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe("GET /api/v1/analytics/dashboard", () => {
  it("should return dashboard statistics", async () => {
    const { token } = await createUserAndUrl();

    const response = await request(app)
      .get("/api/v1/analytics/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.totalClicks).toBe(1);
  });

  it("should reject unauthenticated dashboard requests", async () => {
    const response = await request(app).get("/api/v1/analytics/dashboard");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
