import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";

import requestId from "./middlewares/requestId.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import urlRoute from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import logger from "./utils/logger.js";
import systemRoutes from "./routes/system.routes.js";
import { metricsMiddleware } from "./middlewares/metrics.middleware.js";
import metricsRoutes from "./routes/metrics.routes.js";

const app = express();

app.use(express.json());
app.use((req, _res, next) => {
  if (req.query) {
    Object.defineProperty(req, "query", {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  if (req.params) {
    Object.defineProperty(req, "params", {
      value: { ...req.params },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});
app.use(mongoSanitize());
app.use(cors());
app.use(helmet());
app.use(requestId);
app.use(metricsMiddleware);
app.use((req, _res, next) => {
  logger.info({
    requestId: req.requestId,
    path: req.originalUrl,
    method: req.method,
  });

  next();
});
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", healthRoutes);
app.use("/system", systemRoutes);
app.use("/api/v1/metrics", metricsRoutes);
app.use("/api/v1/urls", urlRoute);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/r", redirectRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
