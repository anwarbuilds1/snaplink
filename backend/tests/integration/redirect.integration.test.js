process.env.NODE_ENV = "test";

import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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

describe("GET /:shortCode", () => {
  it("should redirect to original url", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Anwar",
        email: "anwar@example.com",
        password: "password123",
      });

    const token = registerResponse.body.data.token;

    const createResponse = await request(app)
      .post("/api/v1/urls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        originalUrl: "https://github.com",
      });

    const shortCode = createResponse.body.data.shortCode;

    const response = await request(app).get(`/${shortCode}`).redirects(0);

    expect(response.status).toBe(302);

    expect(response.headers.location).toBe("https://github.com");
  });

  it("should return 404 when shortcode does not exist", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });
});
