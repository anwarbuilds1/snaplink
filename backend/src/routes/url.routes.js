import { Router } from "express";
import {
  createUrl,
  deleteUrl,
  getUrlById,
  updateUrl,
} from "../controllers/url.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUrlSchema,
  updateUrlSchema,
} from "../validators/url.validator.js";

const router = Router();
router.get("/:id", authenticate, getUrlById);
router.post("/", authenticate, validate(createUrlSchema), createUrl);
router.patch("/:id", authenticate, validate(updateUrlSchema), updateUrl);
router.delete("/:id", authenticate, deleteUrl);
export default router;
