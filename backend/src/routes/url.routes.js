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
/**
 * @swagger
 * /api/v1/urls/{id}:
 *   get:
 *     summary: Get URL by ID
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL details
 */
router.get("/:id", authenticate, getUrlById);
/**
 * @swagger
 * /api/v1/urls:
 *   post:
 *     summary: Create a short URL
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://github.com
 *               customAlias:
 *                 type: string
 *                 example: github
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "6a2977ccf28d59ed2a4a2fe7"
 *                 originalUrl: "https://github.com"
 *                 shortCode: "github"
 */
router.post("/", authenticate, validate(createUrlSchema), createUrl);
/**
 * @swagger
 * /api/v1/urls/{id}:
 *   patch:
 *     summary: Update URL
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL updated successfully
 */
router.patch("/:id", authenticate, validate(updateUrlSchema), updateUrl);
/**
 * @swagger
 * /api/v1/urls/{id}:
 *   delete:
 *     summary: Delete URL
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully
 */
router.delete("/:id", authenticate, deleteUrl);
export default router;
