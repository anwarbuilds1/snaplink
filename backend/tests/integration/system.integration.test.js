import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../../src/app.js";

describe("System Routes", () => {
  describe("GET /system/health", () => {
    it("should return application health status", async () => {
      const response = await request(app).get("/system/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        status: "UP",
      });
    });
  });

  describe("GET /system/ready", () => {
    it("should return readiness status", async () => {
      const response = await request(app).get("/system/ready");

      expect([200, 503]).toContain(response.status);

      expect(response.body).toHaveProperty("status");

      expect(response.body).toHaveProperty("services");

      expect(response.body.services).toHaveProperty("database");

      expect(response.body.services).toHaveProperty("redis");
    });
  });
});
