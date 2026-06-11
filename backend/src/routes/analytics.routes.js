import { Router } from "express";

import {
  getUrlAnalytics,
  getDashboardStats,
} from "../controllers/analytics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { urlIdParamSchema } from "../validators/url.validator.js";

const router = Router();
/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/dashboard", getDashboardStats);
/**
 * @swagger
 * /api/v1/analytics/{urlId}:
 *   get:
 *     summary: Get analytics for a URL
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 */

router.get("/:urlId", validate(urlIdParamSchema, "params"), getUrlAnalytics);

export default router;
