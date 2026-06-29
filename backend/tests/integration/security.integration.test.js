import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
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

describe("NoSQL Injection Protection", () => {
  describe("POST /api/v1/auth/login with NoSQL query injection", () => {
    it("should sanitize malicious properties and fail authentication", async () => {
      // Register a legitimate user
      await request(app).post("/api/v1/auth/register").send({
        name: "Security Test",
        email: "secure@test.com",
        password: "securepassword123",
      });

      // Try to log in using a NoSQL injection payload
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: { "$gt": "" },
          password: "securepassword123",
        });

      // Assert it failed authentication/validation
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/register with NoSQL query injection", () => {
    it("should sanitize nested keys containing $ and fail validation", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Malicious User",
          email: { "$ne": null },
          password: "password123",
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/urls with NoSQL query injection", () => {
    it("should sanitize query objects and reject bad requests", async () => {
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "user@test.com",
          password: "password123",
        });

      const token = registerResponse.body.data.accessToken;

      const response = await request(app)
        .post("/api/v1/urls")
        .set("Authorization", `Bearer ${token}`)
        .send({
          originalUrl: { "$ne": "https://github.com" },
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });
});
