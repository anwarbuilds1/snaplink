import { Router } from "express";

import {
  getUrlAnalytics,
  getDashboardStats,
} from "../controllers/analytics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { urlIdParamSchema } from "../validators/url.validator.js";

const router = Router();

router.get("/dashboard", getDashboardStats);

router.get("/:urlId", validate(urlIdParamSchema, "params"), getUrlAnalytics);

export default router;
