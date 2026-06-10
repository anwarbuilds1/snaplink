import { Router } from "express";

import {
  getUrlAnalytics,
  getDashboardStats,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/dashboard", getDashboardStats);

router.get("/:urlId", getUrlAnalytics);

export default router;
