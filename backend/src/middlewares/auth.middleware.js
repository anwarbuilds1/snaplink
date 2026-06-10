import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decord = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: decord.userId,
    };
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
