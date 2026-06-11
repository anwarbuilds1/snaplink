import { Router } from "express";
import { redirectToOriginalUrl } from "../controllers/redirect.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { shortCodeParamSchema } from "../validators/url.validator.js";

const router = Router();
/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags:
 *       - Redirect
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to original URL
 *       404:
 *         description: Short URL not found
 *       410:
 *         description: URL expired
 */
router.get(
  "/:shortCode",
  validate(shortCodeParamSchema, "params"),
  redirectToOriginalUrl,
);

export default router;
