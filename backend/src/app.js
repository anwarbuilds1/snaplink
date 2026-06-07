import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";

import urlRoute from "./routes/url.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/health", healthRoutes);
app.use("/api/v1/urls", urlRoute);

export default app;
