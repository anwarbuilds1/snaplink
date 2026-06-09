import { Router } from "express";
import { redirectToOriginalUrl } from "../controllers/redirect.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { shortCodeParamSchema } from "../validators/url.validator.js";

const router = Router();

router.get(
  "/:shortCode",
  validate(shortCodeParamSchema, "params"),
  redirectToOriginalUrl,
);

export default router;
