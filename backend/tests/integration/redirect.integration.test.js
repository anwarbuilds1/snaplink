process.env.NODE_ENV = "test";

import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import Url from "../../src/models/Url.js";

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

describe("GET /r/:shortCode", () => {
  it("should redirect to original url", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Anwar",
        email: "anwar@example.com",
        password: "password123",
      });

    const token = registerResponse.body.data.accessToken;

    const createResponse = await request(app)
      .post("/api/v1/urls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        originalUrl: "https://github.com",
      });

    expect(createResponse.status).toBe(201);

    const shortCode = createResponse.body.data.shortCode;

    const response = await request(app).get(`/r/${shortCode}`).redirects(0);

    expect(response.status).toBe(302);

    expect(response.headers.location).toBe("https://github.com");
  });

  it("should return 404 when shortcode does not exist", async () => {
    const response = await request(app).get("/r/does-not-exist");

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });

  it("should return 410 when the short url is expired", async () => {
    await Url.create({
      userId: new mongoose.Types.ObjectId(),
      originalUrl: "https://github.com",
      shortCode: "expired",
      expiresAt: new Date("2020-01-01T00:00:00.000Z"),
    });

    const response = await request(app).get("/r/expired").redirects(0);

    expect(response.status).toBe(410);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("URL has expired");
  });

  it("should leave root-level short codes unhandled by the redirect route", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Route not found");
  });
});
