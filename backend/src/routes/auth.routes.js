import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyUrls } from "../controllers/url.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authenticate, getProfile);
router.get("/urls", authenticate, getMyUrls);

export default router;
