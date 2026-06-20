import { beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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

import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../../src/app.js";

describe("POST /api/v1/auth/register", () => {
  it("should register a user successfully", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.user.email).toBe("anwar@example.com");

    expect(response.body.data.token).toBeDefined();
  });
  it("should not allow duplicate email registration", async () => {
    const user = {
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should login successfully", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "anwar@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.token).toBeDefined();
  });

  it("should reject invalid password", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "Anwar",
      email: "anwar@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "anwar@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});

describe("GET /api/v1/auth/profile", () => {
  it("should return authenticated user profile", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Anwar",
        email: "anwar@example.com",
        password: "password123",
      });

    const token = registerResponse.body.data.token;

    const response = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.email).toBe("anwar@example.com");
  });

  it("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/v1/auth/profile");

    expect(response.status).toBe(401);
  });
});

describe("POST /api/v1/urls", () => {
  it("should create a short url", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Anwar",
        email: "anwar@example.com",
        password: "password123",
      });

    const token = registerResponse.body.data.token;

    const response = await request(app)
      .post("/api/v1/urls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        originalUrl: "https://github.com",
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.originalUrl).toBe("https://github.com");

    expect(response.body.data.shortCode).toBeDefined();
  });
  it("should reject unauthenticated requests", async () => {
    const response = await request(app).post("/api/v1/urls").send({
      originalUrl: "https://github.com",
    });

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/urls/:id", () => {
  it("should get url by id", async () => {
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

    const urlId = createResponse.body.data._id;

    const response = await request(app)
      .get(`/api/v1/urls/${urlId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(urlId);
  });
});

describe("PATCH /api/v1/urls/:id", () => {
  it("should update url", async () => {
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

    const urlId = createResponse.body.data._id;

    const response = await request(app)
      .patch(`/api/v1/urls/${urlId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        originalUrl: "https://updated.com",
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.originalUrl).toBe("https://updated.com");
  });
});

describe("DELETE /api/v1/urls/:id", () => {
  it("should delete url", async () => {
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

    const urlId = createResponse.body.data._id;

    const response = await request(app)
      .delete(`/api/v1/urls/${urlId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });
});
