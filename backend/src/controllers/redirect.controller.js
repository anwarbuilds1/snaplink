import * as redirectService from "../services/redirect.service.js";
import { buildClickContext } from "../utils/requestContext.js";

export const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.validatedParams;
    const originalUrl = await redirectService.getOriginalUrl(
      shortCode,
      buildClickContext(req),
    );

    return res.redirect(originalUrl);
  } catch (error) {
    next(error);
  }
};
