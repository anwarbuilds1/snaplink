import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Histogram,
  Gauge,
} from "prom-client";

const register = new Registry();

// Collect default Node.js metrics
collectDefaultMetrics({
  register,
  prefix: "url_shortener_",
});

// Counter - Total HTTP Requests
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Histogram - Request Duration
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// MongoDB Connection Status
export const mongoStatus = new Gauge({
  name: "mongodb_up",
  help: "MongoDB connection status",
  registers: [register],
});

// Redis Connection Status
export const redisStatus = new Gauge({
  name: "redis_up",
  help: "Redis connection status",
  registers: [register],
});

export default register;
